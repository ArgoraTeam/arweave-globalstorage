import { T_jwk } from "./types";

const contractSrcTxId = "Em7CXVVXna7DUkNh2oV1p_rWLeNrXEKdQtyqiI9GqxI";
const contractInitState = (jwk: T_jwk) => `{
  "owner": "${jwk}",
  "apps": {
    "Global-Account": {
      "timestamp": ${new Date().getTime()},
      "data": {
        "welcome": "Your Global Account has been activated!",
        "congratulation": "You are using apps.Global-Account"
      }
    }
  }
}`;

export {contractSrcTxId, contractInitState};