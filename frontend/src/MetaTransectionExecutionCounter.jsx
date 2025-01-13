import React, { useState } from "react";
import { ethers } from "ethers";

const COUNTER_CONTRACT_ADDRESS = "0xa93aD20484DD8Bf0a76ca609f5c253aacC16a193";
const EIP712MetaTransaction_CONTRACT_ADDRESS =
  "0x5b80978E5a534a26e6e0b552da0c8B24ef6790A1";

import Counter from "../../contract/artifacts/contracts/Counter.sol/Counter.json";
import EIP712MetaTransaction from "../../contract/artifacts/contracts/EIP712MetaTransaction.sol/EIP712MetaTransaction.json";

const MetaTransactionCounterComponent = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [signer2, setSigner2] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [functionSignature, setFunctionSignature] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        await ethersProvider.send("eth_requestAccounts", []);
        const signer = await ethersProvider.getSigner();
        const address = await signer.getAddress();
        const chainId = (await ethersProvider.getNetwork()).chainId;

        console.log("chainId: ", chainId);
        console.log("chainId: ", chainId.toString());

        setProvider(ethersProvider);
        setSigner(signer);
        setUserAddress(address);
        setChainId(chainId.toString());
        setStatus("Wallet connected successfully!");

        console.log("Connecteed");
      } catch (error) {
        setStatus("Failed to connect wallet");
        console.error(error);
      }
    } else {
      setStatus("Please install MetaMask to connect your wallet");
    }
  };

  const signTransaction = async () => {
    if (!signer || !userAddress) {
      setStatus("Please connect your wallet first");
      return;
    }

    try {
      setStatus("Signing transaction...");

      // Initialize the EIP712 contract
      const EIP712Contract = new ethers.Contract(
        EIP712MetaTransaction_CONTRACT_ADDRESS,
        EIP712MetaTransaction.abi,
        signer
      );

      // Initialize the Counter contract
      const CounterContract = new ethers.Contract(
        COUNTER_CONTRACT_ADDRESS,
        Counter.abi,
        signer
      );

      console.log("chainId: ", chainId);
      console.log("userAddress : ", userAddress);

      const name = await EIP712Contract.getName();
      console.log("name : ", name);

      // Prepare the EIP-712 typed data
      const domain = {
        name: name,
        version: "1",
        verifyingContract: EIP712MetaTransaction_CONTRACT_ADDRESS,
        salt: ethers.zeroPadValue(ethers.toBeHex(chainId), 32),
      };

      const types = {
        MetaTransaction: [
          { name: "nonce", type: "uint256" },
          { name: "from", type: "address" },
          { name: "target", type: "address" },
          { name: "functionSignature", type: "bytes" },
        ],
      };

      // Encode the function signature for increment
      const functionSig =
        CounterContract.interface.encodeFunctionData("increment");

      setFunctionSignature(functionSig);
      console.log("functionSig: ", functionSig);

      // Get the nonce for the user
      const nonce = await EIP712Contract.getNonce(userAddress);

      console.log("nonce: ", nonce);
      console.log("nonce.toString(): ", nonce.toString());

      const message = {
        nonce: nonce.toString(),
        from: userAddress,
        target: COUNTER_CONTRACT_ADDRESS,
        functionSignature: functionSig,
      };

      // Sign the typed data
      const rawSignature = await signer.signTypedData(domain, types, message);
      console.log("rawSignature: ", rawSignature);

      const { r, s, v } = ethers.Signature.from(rawSignature);
      setSignature({ r, s, v });

      console.log("r, s, v: ", r, s, v);

      setStatus("Transaction signed successfully!");
    } catch (error) {
      setStatus("Failed to sign the transaction");
      console.error(error);
    }
  };

  const executeTransaction = async () => {
    if (!signer || !signature || !functionSignature) {
      setStatus("Please sign the transaction first");
      return;
    }

    const privateKey = "0x"; // Replace with your actual private key

    // Connect to a provider
    const provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/your-api-key"
    );

    // Create a signer
    const walletSigner = new ethers.Wallet(privateKey, provider);

    try {
      setStatus("Executing meta-transaction...");

      const EIP712Contract = new ethers.Contract(
        EIP712MetaTransaction_CONTRACT_ADDRESS,
        EIP712MetaTransaction.abi,
        walletSigner
      );

      // Execute the meta-transaction
      const tx = await EIP712Contract.executeMetaTransaction(
        userAddress,
        functionSignature,
        signature.r,
        signature.s,
        signature.v,
        { gasLimit: 100000n } // ethers v6 uses BigInt for gas limit
      );
      await tx.wait();

      setStatus("Meta-transaction executed successfully!");
    } catch (error) {
      setStatus("Failed to execute the transaction");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Meta-Transaction for USDT Approval</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <button onClick={signTransaction} disabled={!signer}>
        Sign Transaction
      </button>
      <button onClick={executeTransaction} disabled={!signature}>
        Execute Transaction
      </button>
      <p>{status}</p>
    </div>
  );
};

export default MetaTransactionCounterComponent;

// const chainId1 = 11155111;
// const salt = ethers.zeroPadValue(ethers.toBeHex(11155111), 32);
