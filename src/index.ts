import Arweave from 'arweave';
import ArDB from '@textury/ardb';

export const GlobalStorage = (name: string) => `Hello ${name}`;

export const getGlobalStorageOfWallet = async (arweave: Arweave, JWK: string) => {
  const ardb = new ArDB(arweave);
  const tx = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(1).find();
  
  return(tx.length ? tx : null);
}