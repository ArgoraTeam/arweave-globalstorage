import Arweave from 'arweave';
import ArDB from '@textury/ardb';
import { contractInitState, contractSrcTxId } from './constants';
import {createContractFromTx, readContract} from 'smartweave';
import { T_GlobalAccount } from './types';

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

export const getGlobalStorageOfWallet = async (JWK: string, arweave: Arweave): Promise<T_GlobalAccount> => {
  const ardb = new ArDB(arweave);
  const txs = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(5).find();
  
  const response: T_GlobalAccount = {
    status: "ok",
    description: "Global Account latest state",
    result: null,
  };
  
  for(const tx of txs){
    try {
      response.result = await readContract(arweave, tx.id);
      break;
    }
    catch(e: any){
      response.status = "pending"
      response.description = "This user's Global Account was recently reset and its last state has not been confirmed by the network yet"
    }
  }

  if(!response.result){
    response.status = "error";
    response.description = "Global Account not activated";
  }

  return(response);
}

export * from './types';