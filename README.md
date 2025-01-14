# Meta-Transaction Counter Example

This is a React app that demonstrates how to perform Ethereum meta-transactions using the EIP-712 standard. It allows users to sign transactions off-chain and have them executed on-chain by another party.

## Features

- **Connect MetaMask wallet**: Connects the user's wallet to the app.
- **Sign a meta-transaction**: Signs an off-chain message to increment a counter.
- **Execute meta-transaction**: Sends the signed transaction to the blockchain to increment the counter.

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Contracts**:
   - Counter Contract: `0x---`
   - EIP712MetaTransaction Contract: `0x---`

## How It Works

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your MetaMask.
2. **Sign Transaction**: Sign a meta-transaction to increment the counter.
3. **Execute Transaction**: Execute the signed transaction to increment the counter on the blockchain.

## Running the App

Start the app with:

```bash
npm run dev
```
