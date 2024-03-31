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
const gigidadd = "0x5410A859ed6ed8964156C976580eFc4325Cf8D52";
const escrowadd = "0x9435060c40A5D2C3aA48F792dD81C74Bd5AF7Fe2";

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
