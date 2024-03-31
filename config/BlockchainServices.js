import Web3 from "web3";
import { ethers } from "ethers";
import Token from "../contracts/did.json";
import Escrow from "../contracts/escrow.json";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();
if (ethereum) {
  isBrowser().web3 = new Web3(ethereum);
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}
const gigidadd = "0x45660CDFA3691F904f7d387C8081F842e927918B";
const escrowadd = "0x4bD782b05E888c961b7e534d6ee923f464332Ab6";

export const raiseDispute = async () => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = "0xEb60eF428D2f2469AD99f978c8Acc250A383A11E";
  const reason = "This person is against the contract";
  const contract = new ethers.Contract(escrowadd, Escrow, signer);
  try {
    const didInfo = await contract.raiseDispute(address, reason);
    console.log("Registered did:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
};

export const createdid = async ({ address, role, ipfsHash }) => {
  if (!window.ethereum) {
    throw new Error("Ethereum object not found, install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  console.log("Address requested:", address);
  const contract = new ethers.Contract(gigidadd, Token, signer);

  try {
    const didInfo = await contract.registerDID(address, role, ipfsHash);
    console.log("Registered did:", didInfo);
    return didInfo;
  } catch (error) {
    console.error("Error fetching DID info:", error);
    throw error;
  }
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
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, Token, signer);
  const tokenId = await Role.getAllDIDInfo();
  return tokenId;
};
