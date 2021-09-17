# arweave-globalstorage

localStorage arweave synchronizer

## What is arweave-globalstorage?

arweave-globalstorage is a wallet centric data storage solution for arweave applications on the permaweb.
It is an hybrid local/on-chain storage solution made to be used the same way the native `localStorage` property works as library.

### As a protocol

- A __global storage__ is a smartweave contract of which the original wallet only can write the state.
- A __wallet's global account__ is simply the last state of its __global storage__.
- A wallet that has deployed a __global storage__ contract at least 1 time with the tag `Protocol-Name: globalstorage` to the transaction is considered having a __global account__.
- To read a __wallet's global account__, you only need to query the last tx containing the tag `Protocol-Name: globalstorage` and read the __global storage__ contract stored.

#### Consequences & benefits

When a __global storage__ state becomes heavy, the user can deploy a new __global storage__ contract using the __wallet's global account__' state as the init state. This way, users are assured to keep their specific apps data under controle while being scalable on the long term.

### As a library

The goal of globalStorage is to be able to keep data in the same fashion as `localStorage` do while having a possibility to take a "snapshot" of it on-chain. Therefore we have a way to keep user specific data accross devices.

# __global storage__ contract state format

A global storage store app related data.

```
{
  identity: {
    username: string,
    links: [{ name: string, value: string }]
  },
  apps: [
    {
      _createdAt: number,
      _updatedAt: number,
      name: string, 
      storage: string
    }
  ]
}
```

Example:
```
{
  identity: {
    username: "bidetaggle",
    links: [
      { name: "twitter", value: "https://twitter.com/bidetaggle" }
      { name: "website", value: "https://bidetaggle.com/" }
      { name: "my favorite movie", value: "https://www.youtube.com/watch?v=cTtIPBPSv0U&ab_channel=ModernWarInstitute" }
    ],
  },
  apps: [
    { name: "koii", storage: "{\"favorites\":[\"I8xgq3361qpR8_DvqcGpkCYAUTMktyAgvkm6kGhJzEQ\",\"WpGkJ8FoJSg1ZKHeIcP64GQXdDUeB7FzAghHMQxNY5U\"]}" },
    { name: "verto", storage: "{\"verto_theme\":\"System\",\"verto_watchlist\":[\"AR\"]}" },
    { name: "argora", storage: "{\"friends\":[\"89tR0-C1m3_sCWCoVCChg4gFYKdiH5_ZDyZpdJ2DDRw\",\"Opji45FVSmAXyW2DQ_e5T2-HkzD-Nuiu_tJ333uDy9E\"]}"
  ]
}
```

# Library references

## 1. Getting started

### GlobalStorage(App-Name: string, JWK: string): (GlobalStorage | null)
```
import {GlobalStorage} from 'arweave-globalstorage';
const globalStorage = new GlobalStorage("your-app-name", "aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog");
```
Initialize a global storage. You must create only one instance per app, the `App-Name` value of the tx taglobalStorage related to the current app.

#### Return
- The `GlobalStorage` object to manipulte items and synchronize it to the smartweave contract
- If no GlobalStorage tx found: `null`

## 2. Local data manipulation

### globalStorage.sync(): boolean
```
globalStorage.sync();
```
Read contract of the last tx having a `Protocol-Name: globalstorage` tag from `JWK`.

Override local storage with the contract state related to `your-app-name`.
#### Return
- `true`: went okay
- `false`: went wrong

### globalStorage.setItem(key: string, value: string): undefined
```
globalStorage.setItem("theme", "dark");
```
Set an item locally, similar to [`localStorage.setItem()`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)

### globalStorage.getItem(key: string): DOMString | null
```
const theme = globalStorage.getItem("theme");
console.log(theme);
> dark
```
Get an item from local, similar to [`localStorage.getItem()`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem)

#### Return
- A `DOMString` containing the value of the key.
- If the key does not exist, `null` is returned.

### globalStorage.removeItem(key: string): undefined
```
globalStorage.removeItem(key: string);
```
Remove a local item, similar to [`localStorage.removeItem()`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem)

## 3. Chain interaction (needs transaction)

_The following needs to make a transaction on arweave to be executed_

### globalStorage.save(): boolean
```
globalStorage.save();
```
Interact with the global storage contract to override your app globalStorage content with the local content

#### Return
- `true`: went okay
- `false`: went wrong

-----------

## Standalone utilities

`arweave-globalstorage` brings also 2 more utilities: 
- `getGlobalStorageOfWallet`: query the last tx from the specified wallet with the tag `Protocol-Name: globalstorage`, read the __global storage__ contract stored and output a JSON object that represents the last state of the __global storage__, therefore the current __wallet's global account__.
- `createGlobalStorage`: [reserved usage] deploy a new smartweave globalStorage contract with the default init state and `Protocol-Name: globalstorage` tag name.

### getGlobalStorageOfWallet(JWK: string): json object
import {getGlobalStorageOfWallet} from 'arweave-globalstorage';
```
await getGlobalStorageOfWallet("aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog");
```
Read a specific __wallet's global account__ state.

#### Return
- JSON object describing the state
- `null`: Global Account not activated
- `undefined`: Global Account was recently reset and the last deployment has not been confirmed by the network yet.

### [Dangerous] createGlobalStorage(): boolean
import {createGlobalStorage} from 'arweave-globalstorage';
```
await createGlobalStorage();
```
Init or reset the connected __wallet's global account__.

Reserved for the _Global Account_ app only.

#### Return
- `true`: went okay
- `false`: went wrong

# Misc.

Package started from [this tutorial](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c).