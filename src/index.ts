import Arweave from 'arweave';
import ArDB from '@textury/ardb';
import { contractInitState, contractSrcTxId } from './constants';
import {createContractFromTx, readContract} from 'smartweave';

export class GlobalStorage {
  private AppName: string;
  private arweave: Arweave;

  constructor(AppName: string, arweave: Arweave) {
    this.AppName = AppName;
    this.arweave = arweave;
  }

  async activate(): Promise<string> {
    const jwk = await window.arweaveWallet.getActiveAddress();
    const tx = createContractFromTx(
      this.arweave,
      'use_wallet',
      contractSrcTxId,
      contractInitState(jwk),
      [
        {name: 'Protocol-Name', value: 'globalstorage'},
        {name: 'Protocol-Version', value: '0.1'}
      ]
    );

    return tx;
  } 
}

export const getGlobalStorageOfWallet = async (JWK: string, arweave: Arweave) => {
  const ardb = new ArDB(arweave);
  const txs = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(5).find();
  
  let status = "ok";
  let result;
  
  for(const tx of txs){
    try {
      result = await readContract(arweave, tx.id);
      break;
    }
    catch(e: any){
      status = "pending"
    }
  }

  if(!result){
    status = "error";
    result = "Global Account not activated";
  }

  return({ status, result });
}