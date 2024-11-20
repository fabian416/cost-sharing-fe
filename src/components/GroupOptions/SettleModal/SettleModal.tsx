import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './SettleModal.module.css';
import { addDoc, updateDoc, doc, arrayUnion, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { BigNumber, ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../../../consts/contracts';

interface Debt {
  debtor: string;
  creditor: string;
  amount: number;
}

interface Expense {
  amount: number;
  description: string;
  paidBy: string;
  sharedWith: string[];
  settled: boolean;
  timestamp: any;
}

interface Signature {
  signer: string;
  signature: string;
}

interface SettleModalProps {
  show: boolean;
  handleClose: () => void;
  groupId: string;
  currentUser: string;
  hasActiveProposal: boolean;
  userHasSigned: boolean;
  settleProposalId: string;
}

Modal.setAppElement('#root');

const calculateSimplifiedDebts = (expenses: Expense[]): Debt[] => {
  const balances: { [key: string]: number } = {};

  // Calcular los balances
  expenses.forEach(expense => {
    if (!expense.settled) {
      const totalParticipants = expense.sharedWith.length + 1; // Incluye al pagador
      const share = expense.amount / totalParticipants;

      expense.sharedWith.forEach(member => {
        if (!balances[member]) balances[member] = 0;
        balances[member] -= share; // Los participantes deben una parte del gasto
      });

      if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
      balances[expense.paidBy] += share * expense.sharedWith.length; // El pagador asume el gasto restante
    }
  });

  // Simplificar las deudas
  const simplifiedDebts: Debt[] = [];
  for (const [debtor, debt] of Object.entries(balances)) {
    if (debt < 0) {
      for (const [creditor, credit] of Object.entries(balances)) {
        if (credit > 0) {
          const amount = Math.min(-debt, credit);
          if (amount > 0) {
            simplifiedDebts.push({ debtor, creditor, amount });
            balances[debtor] += amount;
            balances[creditor] -= amount;
          }
        }
      }
    }
  }

  return simplifiedDebts;
};

const SettleModal: React.FC<SettleModalProps> = ({
  show,
  handleClose,
  groupId,
  currentUser,
  hasActiveProposal,
  userHasSigned,
  settleProposalId
}) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [simplifiedDebts, setSimplifiedDebts] = useState<Debt[]>([]);

  // Obtener y calcular las deudas simplificadas al abrir el modal
  useEffect(() => {
    const fetchExpensesAndCalculateDebts = async () => {
      const expensesSnapshot = await getDocs(collection(firestore, 'groups', groupId, 'expenses'));
      const expenses: Expense[] = expensesSnapshot.docs.map(doc => doc.data() as Expense);

      const debts = calculateSimplifiedDebts(expenses);
      setSimplifiedDebts(debts);

      // Imprimir las deudas simplificadas
      console.log('Simplified debts:', debts);
    };

    if (show) {
      fetchExpensesAndCalculateDebts();
    }
  }, [show, groupId]);
  const handleProposeSettle = async () => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      return;
    }
  
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider);
    const signer = ethersProvider.getSigner();
    const contract = new ethers.Contract(
      APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
      APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
      signer
    );
  
    const isMember = await contract.isMember(groupId, currentUser);
    if (!isMember) {
      console.error('Current user is not a member of the group');
      return;
    }
  
    const group = await contract.groups(groupId);
    const groupNonce = group.nonce;
  
    // Convertir las deudas simplificadas a BigNumber
    const formattedDebts = simplifiedDebts.map(debt => ({
      debtor: ethers.utils.getAddress(debt.debtor),
      creditor: ethers.utils.getAddress(debt.creditor),
      amount: ethers.utils.parseUnits(debt.amount.toString(), 18).toString(),
    }));
  
    console.log("Simplified Debts:", simplifiedDebts); // Imprimir las deudas simplificadas en consola
  
    const calculateActionHash = (groupId: string, debts: typeof formattedDebts, nonce: BigNumber) => {
      let hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['bytes32'], [groupId]));
      for (const debt of debts) {
        hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
          ['bytes32', 'address', 'address', 'uint256'],
          [hash, debt.debtor, debt.creditor, BigNumber.from(debt.amount)]
        ));
      }
      return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'string', 'uint256'],
        [hash, 'settleDebts', nonce]
      ));
    };
  
    const actionHashScript = calculateActionHash(groupId, formattedDebts, groupNonce);
    const signature = await signer.signMessage(ethers.utils.arrayify(actionHashScript));
  
    if (!hasActiveProposal) {
      // Crear una nueva propuesta de settle
      const settleProposal = {
        groupId,
        debts: formattedDebts,
        proposer: currentUser,
        signatures: [{ signer: currentUser, signature }]
      };
  
      await addDoc(collection(firestore, 'groups', groupId, 'settleProposals'), settleProposal);
      console.log('Settle proposal created and signed successfully');
    } else if (!userHasSigned) {
      // Agregar la firma del usuario a una propuesta activa
      const proposalRef = doc(firestore, 'groups', groupId, 'settleProposals', settleProposalId);
      await updateDoc(proposalRef, {
        signatures: arrayUnion({ signer: currentUser, signature })
      });
  
      // Verificar si se alcanzó el umbral de firmas
      const groupDoc = await getDoc(doc(firestore, 'groups', groupId));
      const groupData = groupDoc.data();
      const signatureThreshold = groupData?.signatureThreshold;
  
      const updatedProposalSnap = await getDoc(proposalRef);
      const updatedProposalData = updatedProposalSnap.data();
      if (updatedProposalData && updatedProposalData.signatures.length >= signatureThreshold) {
        console.log('Signatures:', updatedProposalData.signatures);
  
        // Llamar al contrato para realizar el settle
        try {
          const tx = await contract.settleDebtsWithSignatures(
            groupId,
            formattedDebts,
            updatedProposalData.signatures.map((sig: Signature) => sig.signature)
          );
          console.log('Transaction sent:', tx.hash);
  
          // Esperar confirmación
          await tx.wait();
          console.log('Transaction confirmed successfully.');
  
          // Marcar las expenses como settled en Firestore
          const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
          const snapshot = await getDocs(expensesRef);
  
          const batch = writeBatch(firestore);
  
          snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.settled) {
              const expenseRef = doc.ref;
              batch.update(expenseRef, { settled: true });
            }
          });
  
          await batch.commit();
          console.log('Expenses marked as settled successfully.');
        } catch (error) {
          console.error('Error during settle transaction:', error);
        }
      } else {
        console.log('Signed settle proposal successfully.');
      }
    }
  
    handleClose();
  };

  
  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Settle Debts</h2>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
      </div>
      <div className={styles.modalBody}>
        <ul className={styles.debtsList}>
          {simplifiedDebts.map((debt, index) => (
            <li key={index} className={styles.debtItem}>
              {debt.debtor} owes {debt.creditor}: ${debt.amount.toFixed(2)}
            </li>
          ))}
        </ul>
        <button className={styles.proposeButton} onClick={handleProposeSettle} disabled={hasActiveProposal && userHasSigned}>
          {hasActiveProposal ? (userHasSigned ? 'Signed' : 'Sign') : 'Propose Settle'}
        </button>
      </div>
    </Modal>
  );
};

export default SettleModal;