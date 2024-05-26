import { firestore } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const simplifyDebts = async (groupId: string) => {
  console.log(`Simplifying debts for group: ${groupId}`);
  const groupRef = doc(firestore, 'groups', groupId);
  const expensesSnapshot = await getDocs(collection(groupRef, 'expenses'));

  const balances: { [key: string]: number } = {};

  // Calculate balances of every member
  expensesSnapshot.forEach(doc => {
    const expense = doc.data();
    console.log('Processing expense: ', expense);
    if (!expense.settled) {
      const share = expense.amount / expense.sharedWith.length;
      expense.sharedWith.forEach((member: string) => {
        if (!balances[member]) {
          balances[member] = 0;
        }
        balances[member] += share;
        console.log(`Updated balance for ${member}: ${balances[member]}`);
      });
    }
  });

  const debts = [];
  const members = Object.keys(balances);
  for (let i = 0; i < members.length; i++) {
    for (let j = 0; j < members.length; j++) {
      if (i !== j) {
        const debtor = members[i];
        const creditor = members[j];
        const amount = balances[debtor] - balances[creditor];
        if (amount > 0) {
          debts.push({ debtor, creditor, amount });
          console.log(`Debt calculated: ${debtor} owes ${creditor}: ${amount}`);
        }
      }
    }
  }

  console.log('Calculated Simplified Debts: ', debts);

  // Delete all previous simplified debts
  const simplifiedDebtsSnapshot = await getDocs(collection(groupRef, 'simplifiedDebts'));
  for (const doc of simplifiedDebtsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
  console.log('Previous simplified debts deleted.');

  // Save new simplified debts
  for (const debt of debts) {
    const debtRef = doc(collection(groupRef, 'simplifiedDebts'));
    await setDoc(debtRef, debt);
    console.log(`Debt saved: ${JSON.stringify(debt)}`);
  }
  console.log('Simplified Debts saved to Firestore');
};
