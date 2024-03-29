import Web3 from "web3";
import { ethers } from "ethers";
import Token from "../contracts/did.json";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();
if (ethereum) {
  isBrowser().web3 = new Web3(ethereum);
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}
const gigidadd = "0x060cCc567a6533CAfF0854618BD1F1a5c174AcE2";

export const createdid = async ({ address, role, ipfsHash }) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const Role = new ethers.Contract(gigidadd, Token, signer);

  const tokenId = await Role.registerDID(address, role, ipfsHash);
  console.log(tokenId);
  return tokenId;
};

export const getDIDInfos = async (address) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);

  try {
    const didInfo = await contract.getDIDInfo(address);
    console.log("DID Info:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};

export const createAndAssignEscrow = async (amount, address) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);

  try {
    const didInfo = await contract.createAndAssignEscrow(amount, address);
    console.log("DID Info:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};

export const approveAndClaim = async (escrowId) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);

  try {
    const didInfo = await contract.approveAndClaim(escrowId);
    console.log("DID Info:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};

export const balanceOf = async (address) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);

  try {
    const didInfo = await contract.balanceOf(address);
    console.log("DID Info:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};

export const getAllDIDInfo = async () => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);
  try {
    const didInfo = await contract.getAllDIDInfo();
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};
