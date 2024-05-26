import { firestore } from '../firebaseConfig';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

export const simplifyDebts = async (groupId: string) => {
  const groupRef = doc(firestore, 'groups', groupId);
  const expensesSnapshot = await getDocs(collection(groupRef, 'expenses'));

  const balances: { [key: string]: number } = {};

  // Calcular los balances de cada miembro
  expensesSnapshot.forEach(doc => {
    const expense = doc.data();
    if (!expense.settled) {
      const { amount, sharedWith, paidBy } = expense;

      // Dividir el monto entre los miembros compartidos
      const sharePerPerson = amount / sharedWith.length;
      
      // Ajustar el balance para cada miembro compartido
      sharedWith.forEach((member: string) => {
        if (member !== paidBy) {
          if (!balances[member]) {
            balances[member] = 0;
          }
          balances[member] += sharePerPerson;
        }
      });

      // Ajustar el balance para quien pagó
      if (!balances[paidBy]) {
        balances[paidBy] = 0;
      }
      balances[paidBy] -= amount;
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

  // Eliminar todas las deudas simplificadas anteriores
  const simplifiedDebtsSnapshot = await getDocs(collection(groupRef, 'simplifiedDebts'));
  const batch = writeBatch(firestore);
  simplifiedDebtsSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Guardar las nuevas deudas simplificadas
  debts.forEach(debt => {
    const debtRef = doc(collection(groupRef, 'simplifiedDebts'));
    batch.set(debtRef, debt);
  });

  await batch.commit();
};
