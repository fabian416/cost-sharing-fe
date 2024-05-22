import { firestore } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const simplifyDebts = async (groupId: string) => {
  const groupRef = doc(firestore, 'groups', groupId);
  const expensesSnapshot = await getDocs(collection(groupRef, 'expenses'));

  const balances: { [key: string]: number } = {};

  // Calculate balances of every member 
  expensesSnapshot.forEach(doc => {
    const expense = doc.data();
    if (!expense.settled) {
      expense.sharedWith.forEach((member: string) => {
        if (!balances[member]) {
          balances[member] = 0;
        }
        balances[member] += expense.amount / expense.sharedWith.length;
      });
    }
  });

  const debts = [];
  for (const [debtor, amount] of Object.entries(balances)) {
    for (const [creditor, creditAmount] of Object.entries(balances)) {
      if (debtor !== creditor && amount > 0 && creditAmount < 0) {
        const debtAmount = Math.min(amount, -creditAmount);
        debts.push({ debtor, creditor, amount: debtAmount });
        balances[debtor] -= debtAmount;
        balances[creditor] += debtAmount;
      }
    }
  }

  // Delete all previous simplified debts
  const simplifiedDebtsSnapshot = await getDocs(collection(groupRef, 'simplifiedDebts'));
  simplifiedDebtsSnapshot.forEach(doc => {
    deleteDoc(doc.ref);
  });

  // Save new simplified debts
  debts.forEach(debt => {
    const debtRef = doc(collection(groupRef, 'simplifiedDebts'));
    setDoc(debtRef, debt);
  });
};

export const fetchSimplifiedDebts = async (groupId: string) => {
  const debtsCollectionRef = collection(firestore, 'groups', groupId, 'simplifiedDebts');
  const debtsSnapshot = await getDocs(debtsCollectionRef);
  const debts = debtsSnapshot.docs.map(doc => doc.data() as { debtor: string, creditor: string, amount: number });
  return debts;
};
