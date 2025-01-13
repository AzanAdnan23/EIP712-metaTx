import React, { useState } from "react";
import { ethers } from "ethers";

const USDT_CONTRACT_ADDRESS = "0x396Ce2Eed93b79AbB3241226E17Cc34136b7c492";
const SPENDER_ADDRESS = "0x94fD63cA1282c4C645A6497a0aB32779604d1382"; // Address you
const AMOUNT_TO_APPROVE = ethers.parseUnits("10", 6);

const COUNTER_CONTRACT_ADDRESS = "0x23E359623F1CEfE7E7C004cAe0df66a5B87e7618";
const EIP712MetaTransaction = "0xcD1Cd23790E199E855e8AF9e628b750f232dBC88";

const usdtAbi = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function executeMetaTransaction(address userAddress, bytes functionSignature, uint8 v, bytes32 r, bytes32 s) public payable returns (bytes)",
  "function getNonce(address user) view returns (uint256)",
  "function name() public view returns (string memory)",
];

const MetaTransactionComponent = () => {
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

      // Initialize the USDT contract
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        usdtAbi,
        signer
      );

      console.log("chainId: ", chainId);
      console.log("userAddress : ", userAddress);

      const name = await usdtContract.name();
      console.log("name : ", name);

      console.log("USDT_CONTRACT_ADDRESS : ", USDT_CONTRACT_ADDRESS);

      // Prepare the EIP-712 typed data
      const domain = {
        name: name,
        version: "1",
        verifyingContract: USDT_CONTRACT_ADDRESS,
        salt: ethers.zeroPadValue(ethers.toBeHex(chainId), 32),
      };

      const types = {
        MetaTransaction: [
          { name: "nonce", type: "uint256" },
          { name: "from", type: "address" },
          { name: "functionSignature", type: "bytes" },
        ],
      };

      // Encode the function signature for approve
      const functionSig = usdtContract.interface.encodeFunctionData("approve", [
        SPENDER_ADDRESS,
        AMOUNT_TO_APPROVE,
      ]);

      setFunctionSignature(functionSig);
      console.log("functionSig: ", functionSig);

      // Get the nonce for the user
      const nonce = await usdtContract.getNonce(userAddress);

      console.log("nonce: ", nonce);
      console.log("nonce: ", nonce.toString());
      console.log("nonce.toString(): ", nonce.toString());

      const message = {
        nonce: nonce.toString(),
        from: userAddress,
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

    const privateKey =
      "0x21b36b222d4b22acc046701021ed748109afdff1df5170ee523dcfc386f4a6ef"; // Replace with your actual private key

    // Connect to a provider
    const provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/Q8F6ajRM3Z4bFZz6VmEEydGZPS8fCSHJ"
    );

    // Create a signer
    const walletSigner = new ethers.Wallet(privateKey, provider);

    try {
      setStatus("Executing meta-transaction...");

      // Define USDT contract ABI (Meta-transaction functions)
      const usdtAbi = [
        "function executeMetaTransaction(address userAddress, bytes functionSignature, bytes32 sigR, bytes32 sigS, uint8 sigV) public payable returns (bytes)",
      ];

      // Initialize the USDT contract with the signer
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        usdtAbi,
        walletSigner
      );

      // Execute the meta-transaction
      const tx = await usdtContract.executeMetaTransaction(
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

export default MetaTransactionComponent;

// const chainId1 = 11155111;
// const salt = ethers.zeroPadValue(ethers.toBeHex(11155111), 32);
