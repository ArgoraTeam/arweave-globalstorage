import Arweave from 'arweave';
import ArDB from '@textury/ardb';
import { contractInitState, contractSrcTxId } from './constants';
import {createContractFromTx, readContract} from 'smartweave';
import { T_errorReadContract } from './types';
import { stat } from 'fs';

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
  const tx = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(5).find();
  
  let status = "ok";
  let result;
  
  for(let i = 0 ; i < tx.length ; i++){
    console.log(i)
    try {
      result = await readContract(arweave, tx[i].id);
      console.log(result);
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