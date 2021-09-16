const dummyGlobalAccount = JSON.stringify({
  identity: {
    username: "bidetaggle",
    links: [
      { name: "twitter", value: "https://twitter.com/bidetaggle" },
      { name: "website", value: "https://bidetaggle.com/" },
      { name: "my favorite movie", value: "https://www.youtube.com/watch?v=cTtIPBPSv0U&ab_channel=ModernWarInstitute" }
    ],
  },
  apps: [
    { name: "koii", storage: "{\"favorites\":[\"I8xgq3361qpR8_DvqcGpkCYAUTMktyAgvkm6kGhJzEQ\",\"WpGkJ8FoJSg1ZKHeIcP64GQXdDUeB7FzAghHMQxNY5U\"]}"},
    { name: "verto", storage: "{\"verto_theme\":\"System\",\"verto_watchlist\":[\"AR\"]}"},
    { name: "argora", storage: "{\"friends\":[\"89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw\",\"Opji45FVSmAXyW2DQ_e5T2-HkzD-Nuiu_tJ333uDy9E\"]}"}
  ]
});

import Arweave from 'arweave';
import ArDB from '@textury/ardb';

export const GlobalStorage = (name: string) => `Hello ${name}`;

export const getGlobalStorageOfWallet = async (JWK: string, arweave: Arweave) => {
  const ardb = new ArDB(arweave);
  const tx = await ardb.search('transactions')
    .tag('Protocol-Name', 'globalstorage')
    .tag('Protocol-Version', '0.1')
    .from(JWK)
    .limit(1).find();
  
  return(tx.length ? dummyGlobalAccount : null);
}