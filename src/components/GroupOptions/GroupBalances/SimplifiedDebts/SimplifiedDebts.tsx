import React, { useEffect, useState } from 'react';
import { fetchSimplifiedDebts } from '../../../../utils/simplifiedDebts'; // Asegúrate de que la ruta sea correcta

interface SimplifiedDebtsProps {
  groupId: string;
}

const SimplifiedDebts: React.FC<SimplifiedDebtsProps> = ({ groupId }) => {
  const [debts, setDebts] = useState<{ debtor: string, creditor: string, amount: number }[]>([]);

  useEffect(() => {
    const loadDebts = async () => {
      const simplifiedDebts = await fetchSimplifiedDebts(groupId);
      setDebts(simplifiedDebts);
    };

    loadDebts();
  }, [groupId]);

  return (
    <div>
      <h2>Simplified Debts</h2>
      <ul>
        {debts.map((debt, index) => (
          <li key={index}>
            {debt.debtor} owes {debt.creditor}: {debt.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimplifiedDebts;
