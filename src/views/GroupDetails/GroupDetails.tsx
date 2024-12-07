import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupOptions from "../../components/GroupOptions/GroupOptions";
import GroupExpenses from "../../components/GroupOptions/GroupExpenses/GroupExpenses";
import GroupBalances, {
  fetchBalances,
} from "../../components/GroupOptions/GroupBalances/GroupBalances";

interface Balance {
  id: string;
  member: string;
  balance: string; // Manejo como string para BigNumber
}

const GroupDetails = () => {
  const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();
  const [balances, setBalances] = useState<Balance[]>([]);

  if (!groupId || !groupName) {
    return <div>Error: No se encontró el ID o el nombre del grupo.</div>;
  }

  const updateBalances = async () => {
    try {
      const fetchedBalances: Balance[] = await fetchBalances(groupId);
      setBalances(fetchedBalances);
      console.log("Balances actualizados en GroupDetails:", fetchedBalances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  useEffect(() => {
    updateBalances();
  }, [groupId]);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-6 bg-white rounded-lg shadow-md">
      <GroupOptions
        groupId={groupId}
        groupName={groupName}
        onBalancesUpdate={updateBalances}
      />
      <div className="flex flex-1 gap-6">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
          <GroupExpenses groupId={groupId} />
        </div>
        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm">
          <GroupBalances balances={balances} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;