type T_jwk = string;
type T_txid = string;

type T_errorReadContract = {
  type: string,
  otherInfo: {
    message: string,
    requestedTxId: T_txid
  }
}

type T_GlobalAccount = {
  status: "ok" | "pending" | "error",
  description: string,
  result: null | T_GlobalStorage
}

type T_GlobalStorageApp = {
  name: string,
  timestamp: number,
  storage: {name: string, value: string}[]
}

type T_GlobalStorage = {
  owner: T_jwk,
  apps: [T_GlobalStorageApp]
}

export type {T_jwk, T_txid, T_errorReadContract, T_GlobalAccount, T_GlobalStorage, T_GlobalStorageApp}