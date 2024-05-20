import { functions } from './main'; // Asegúrate de que la ruta sea correcta
import { httpsCallable } from 'firebase/functions';

export const getSimplifiedDebts = async (groupId: string) => {
  const simplifyDebts = httpsCallable(functions, 'simplifyDebts');
  const result = await simplifyDebts({ groupId });
  return result.data.simplifiedDebts;
};
