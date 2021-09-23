import { T_jwk } from "./types";

// const contractSrcTxId = "Em7CXVVXna7DUkNh2oV1p_rWLeNrXEKdQtyqiI9GqxI";
const contractSrcTxId = "BSRs6SsIsK8vpjwiEWc4pjgdGexlXmPSyZVzcbSJyHc";

const contractInitState = (jwk: T_jwk) => `{
  "owner": "${jwk}",
  "apps": [
    {
      "name": "Global-Account",
      "timestamp": ${new Date().getTime()},
      "storage": [
        { "name": "welcome", "value": "Your Global Account has been activated!"},
        { "name": "congratulation", "value": "You are using apps.Global-Account"}
      ]
    }
  ]
}`;

export {contractSrcTxId, contractInitState};