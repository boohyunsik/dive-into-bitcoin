# Dive into Bitcoin

This project is a toy project aimed at simulating a simple UTXO-based blockchain.

It is implemented in TypeScript and provides the following features:

* Generating private keys, public keys, and addresses through a wallet
* UTXO model (transaction inputs and outputs)
* ECDSA signing and verification
* Simple P2P simulation
* Proof-of-Work mining (block hash and difficulty)
* Coinbase transaction

## Project Structure

```
dive-into-bitcoin/
├── src/
│   ├── main.ts
│   ├── core/
│   │   ├── blockchain.ts
│   │   ├── block.ts
│   │   ├── utxo.ts
│   │   ├── miner.ts
│   │   ├── p2pnode.ts
│   │   └── wallet.ts
│   ├── utils/
│   │   └── crypto_utils.ts
│   └── config/
│       └── index.ts
├── package.json
└── tsconfig.json
```

## How to run

Install typescript and ts-node
```shell
npm install -g typescript
npm install -g ts-node
```

Install dependencies
```shell
yarn
```

Run the main file
```shell
ts-node src/main.ts
```

## Modules

### 1. `core/blockchain.ts`

Manages the entire state of the blockchain and provides various functions.
It handles adding blocks and validating the chain.

### 2. `core/block.ts`

Defines the block structure as an interface.

### 3. `core/utxo.ts`

Implements the UTXO (Unspent Transaction Output) model.
* TxIn: An input transaction that uses coins by referencing a specific output of a previous transaction
* TxOut: Ownership of newly created coins
* Transaction: Has one or more `TxIn` and `TxOut`, and has a unique transaction hash

### 4. `core/miner.ts`

Implements a simple Proof-of-Work mining logic.

Calculates the block hash repeatedly to meet a certain `DIFFICULTY`.

### 5. `core/p2pnode.ts`

A node class that handles the P2P simulation.

### 6. `core/wallet.ts`

Generates and stores the user's private key, public key, and address.

Uses the `secp256k1` elliptic curve from the `elliptic` library to create key pairs and sign data.

### 7. `utils/crypto_utils.ts`

Provides utility functions for hashing (SHA-256), signing, and verification.

Calculates block hashes with (`createBlockHash`) and verifies transactions with (`verifyTxIn`).