type T_jwk = string;
type T_txid = string;

type T_errorReadContract = {
  type: string,
  otherInfo: {
    message: string,
    requestedTxId: T_txid
  }
}

export type {T_jwk, T_txid, T_errorReadContract}