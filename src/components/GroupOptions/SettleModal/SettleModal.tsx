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
  amount: number; // Usar number en lugar de BigNumber
}

interface Signature {
  signer: string;
  signature: string;
}

interface SettleModalProps {
  show: boolean;
  handleClose: () => void;
  groupId: string;
  debts: Debt[];
  currentUser: string;
  hasActiveProposal: boolean;
  userHasSigned: boolean;
  settleProposalId: string;
}

Modal.setAppElement('#root');

const SettleModal: React.FC<SettleModalProps> = ({
  show,
  handleClose,
  groupId,
  debts,
  currentUser,
  hasActiveProposal,
  userHasSigned,
  settleProposalId
}) => {
  const { walletProvider } = useWeb3ModalProvider();

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

    // Convertir las deudas a BigNumber usando ethers.utils.parseUnits
    const formattedDebts = debts.map(debt => ({
      debtor: ethers.utils.getAddress(debt.debtor),
      creditor: ethers.utils.getAddress(debt.creditor),
      amount: ethers.utils.parseUnits(debt.amount.toString(), 18).toString() // Convertir a cadena antes de guardar
    }));

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
    const actionHashContract = await contract.calculateActionHash(groupId, formattedDebts, groupNonce);
    console.log("action hash script:", actionHashScript);
    console.log("Action hash contract:", actionHashContract);
    if (actionHashScript !== actionHashContract) {
      throw new Error("Hashes do not match");
    }

    const signature = await signer.signMessage(ethers.utils.arrayify(actionHashScript));

    console.log('Group ID:', groupId);
    console.log('Formatted Debts:', formattedDebts);
    console.log('Nonce:', groupNonce);
    console.log('Action Hash Script:', actionHashScript);
    console.log('Action Hash Contract:', actionHashContract);
    console.log('Signature:', signature);

    if (!hasActiveProposal) {
      const settleProposal = {
        groupId,
        debts: formattedDebts, // Asegúrate de que se usen las deudas formateadas
        proposer: currentUser,
        signatures: [{ signer: currentUser, signature }]
      };

      await addDoc(collection(firestore, 'groups', groupId, 'settleProposals'), settleProposal);
      console.log('Settle proposal created and signed successfully');
    } else if (!userHasSigned) {
      const proposalRef = doc(firestore, 'groups', groupId, 'settleProposals', settleProposalId);
      await updateDoc(proposalRef, {
        signatures: arrayUnion({ signer: currentUser, signature })
      });

      const groupDoc = await getDoc(doc(firestore, 'groups', groupId));
      const groupData = groupDoc.data();
      const signatureThreshold = groupData?.signatureThreshold;

      const updatedProposalSnap = await getDoc(proposalRef);
      const updatedProposalData = updatedProposalSnap.data();
      if (updatedProposalData && updatedProposalData.signatures.length >= signatureThreshold) {
        console.log('Signatures:', updatedProposalData.signatures);
        await contract.settleDebtsWithSignatures(
          groupId,
          formattedDebts,
          updatedProposalData.signatures.map((sig: Signature) => sig.signature)
        );
        console.log('Transaction completed successfully');

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
        console.log("Expenses marked as settled successfully");
      }

      console.log('Signed settle proposal successfully');
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
          {debts.map((debt, index) => (
            <li key={index} className={styles.debtItem}>
              {debt.debtor} owes {debt.creditor}: ${debt.amount.toFixed(2)} {/* Asegúrate de que debt.amount sea un número */}
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
