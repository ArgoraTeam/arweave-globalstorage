import Arweave from 'arweave';
import ArDB from '@textury/ardb';
import { contractInitState, contractSrcTxId } from './constants';
import {createContractFromTx, readContract} from 'smartweave';
import { T_errorReadContract } from './types';

export class GlobalStorage {
  private AppName: string;
  private arweave: Arweave;

  constructor(AppName: string, arweave: Arweave) {
    this.AppName = AppName;
    this.arweave = arweave;
  }

  async activate(): Promise<string> {
    console.log("activate");
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
  const tx = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(1).find();

  let globalAccount;
  try{
    globalAccount = tx.length ? await readContract(arweave, tx[0].id) : null;
  }
  catch(e: any){
    globalAccount = undefined;
  }
  
  return(globalAccount);
}