import Web3 from "web3";
import { ethers } from "ethers";
import Token from "../contracts/did.json";

const isBrowser = () => typeof window !== "undefined";
const { ethereum } = isBrowser();
if (ethereum) {
  isBrowser().web3 = new Web3(ethereum);
  isBrowser().web3 = new Web3(isBrowser().web3.currentProvider);
}
const gigidadd = "0x9618D1c5f4A80947Ac7dA394cF2aC56aB2920FA9";

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

export const Checkdid = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
};
export const CheckTokenBalance = async ({ address }) => {
  console.log("address", address);
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer);
  const Role = new ethers.Contract(tokenadd, Token, signer);
  console.log(Role);
  const tokenId = await Role.balanceOf(address);
  console.log(tokenId);
  return tokenId;
};

export const RetreiveByAddress = async ({ address }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.RetreiveByAddress(address);
  return tokenId;
};

export const RetreiveByDid = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.RetreiveByDid(did);
  return tokenId;
};

export const Onboard = async ({ ipfshash, did, choice }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const message = "Happy to Onboard you";
  const messageBytes32 = ethers.utils.formatBytes32String(message);

  const userSignature = await signer.signMessage(
    ethers.utils.arrayify(messageBytes32)
  );
  const serverPrivateKey =
    "7068d64261be1dd07e2dfd3e295f088c681b7aab7224e11959d7ff5b6c332146";
  const serverWallet = new ethers.Wallet(serverPrivateKey, provider);

  const Role = new ethers.Contract(gigidadd, gigidabi, serverWallet);

  console.log("userSignature", userSignature);
  console.log("messageBytes32", messageBytes32);
  const r = userSignature.slice(0, 66);
  const s = "0x" + userSignature.slice(66, 130);
  const v = parseInt(userSignature.slice(130, 132), 16);
  console.log({ r, s, v });
  const txnResponse = await Role.Onboard(
    ipfshash,
    did,
    messageBytes32,
    v,
    r,
    s,
    choice
  );
  const receipt = await txnResponse.wait();
  console.log("Transaction Receipt", receipt);
  return receipt.transactionHash;
};

export const checkOnboarded = async ({ address }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.checkOnboarded(address);
  return tokenId;
};

export const AddDetails = async ({ newipfshash, did, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.AddDetails(newipfshash, did, sign, message);
  return tokenId;
};

export const getDetails = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.getDetails(did);
  return tokenId;
};

export const requestAccess = async ({ did, requestor }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.requestAccess(did, requestor);
  return tokenId;
};

export const grantAccess = async ({ did, requestor, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.grantAccess(did, requestor, sign, message);
  return tokenId;
};

export const RevokeAccess = async ({ did, requestor, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.RevokeAccess(did, requestor, sign, message);
  return tokenId;
};

export const getRequesters = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.getRequesters(did);
  return tokenId;
};

export const getGrantees = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.getGrantees(did);
  return tokenId;
};

export const postGigs = async ({ ipfshash, gigprice }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const message = "Happy to Onboard you";
  const messageBytes32 = ethers.utils.formatBytes32String(message);

  const userSignature = await signer.signMessage(
    ethers.utils.arrayify(messageBytes32)
  );
  const serverPrivateKey =
    "7068d64261be1dd07e2dfd3e295f088c681b7aab7224e11959d7ff5b6c332146";
  const serverWallet = new ethers.Wallet(serverPrivateKey, provider);
  const Role = new ethers.Contract(gighubadd, gighubabi, serverWallet);
  console.log("ip", ipfshash);
  console.log("price", gigprice);
  console.log("userSignature", userSignature);
  console.log("messageBytes32", messageBytes32);
  const r = userSignature.slice(0, 66);
  const s = "0x" + userSignature.slice(66, 130);
  const v = parseInt(userSignature.slice(130, 132), 16);
  console.log({ r, s, v });
  console.log("initiating transaction");
  const txnResponse = await Role.postGig(
    ipfshash,
    gigprice,
    messageBytes32,
    v,
    r,
    s
  );
  console.log("Transaction txnResponse", txnResponse);
  const receipt = await txnResponse.wait();
  console.log("Transaction Receipt", receipt);
  return receipt.transactionHash;
};

export const checkOnboardType = async ({ address }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gigidadd, gigidabi, signer);
  const tokenId = await Role.checkOnboardType(address);
  return tokenId;
};

export const GigEscrow = async ({ gigprice, gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const gigPriceBigNumber = ethers.BigNumber.from(gigprice);
  const Role = new ethers.Contract(escrowadd, escrowabi, signer);
  console.log(`Gig Price: ${gigprice}, Gig ID: ${gigId}`);
  const tokenId = await Role.GigEscrow(gigPriceBigNumber, gigId, {
    value: gigPriceBigNumber,
    // gasLimit: ethers.utils.hexlify(1000000),
  });

  return tokenId;
};

export const IsGigPaidToEscrow = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(escrowadd, escrowabi, signer);
  const tokenId = await Role.IsGigPaidToEscrow(gigId);
  return tokenId;
};

export const AllowPost = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const serverPrivateKey =
    "7068d64261be1dd07e2dfd3e295f088c681b7aab7224e11959d7ff5b6c332146";
  const serverWallet = new ethers.Wallet(serverPrivateKey, provider);
  const Role = new ethers.Contract(gighubadd, gighubabi, serverWallet);
  const tokenId = await Role.AllowPost(gigId);
  return tokenId;
};

export const getAppliedDids = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getAppliedDids(gigId);
  return tokenId;
};

export const getPostLife = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getPostLife(gigId);
  return tokenId;
};

export const ExtendGig = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(escrowadd, escrowabi, signer);
  const tokenId = await Role.ExtendGig(gigId);
  return tokenId;
};

export const getPostStatus = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getPostStatus(gigId);
  return tokenId;
};

export const getAllPosts = async () => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getAllPosts();
  return tokenId;
};

export const ApplyGigs = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  await provider.send("eth_requestAccounts", []);
  const message = "Applying for the post";
  const messageBytes32 = ethers.utils.formatBytes32String(message);
  const signer = provider.getSigner();
  const userSignature = await signer.signMessage(
    ethers.utils.arrayify(messageBytes32)
  );
  const serverPrivateKey =
    "7068d64261be1dd07e2dfd3e295f088c681b7aab7224e11959d7ff5b6c332146";
  const serverWallet = new ethers.Wallet(serverPrivateKey, provider);
  const Role = new ethers.Contract(gighubadd, gighubabi, serverWallet);
  console.log("userSignature", userSignature);
  console.log("messageBytes32", messageBytes32);
  const r = userSignature.slice(0, 66);
  const s = "0x" + userSignature.slice(66, 130);
  const v = parseInt(userSignature.slice(130, 132), 16);
  console.log({ r, s, v });
  console.log("initiating transaction");
  const txnResponse = await Role.ApplyGigs(gigId, messageBytes32, v, r, s);
  console.log("Transaction txnResponse", txnResponse);
  const receipt = await txnResponse.wait();
  console.log("Transaction Receipt", receipt);
  return receipt.transactionHash;
};

export const SelectDev = async ({ gigID, did, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.SelectDev(gigID, did, sign, message);
  return tokenId;
};

export const GigComplete = async ({ gigID }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.GigComplete(gigID);
  return tokenId;
};

export const GigPayOut = async ({ gigId, recipient }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(escrowadd, escrowabi, signer);
  const tokenId = await Role.GigPayOut(gigId, recipient);
  return tokenId;
};

export const developerWithdraw = async ({ gigID, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.developerWithdraw(gigID, sign, message);
  return tokenId;
};

export const gigProviderWithdraw = async ({ gigID, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.gigProviderWithdraw(gigID, sign, message);
  return tokenId;
};

export const WithDrawGig = async ({ gigId }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(escrowadd, escrowabi, signer);
  const tokenId = await Role.WithDrawGig(gigId);
  return tokenId;
};

export const getTheTotalNoOfGigs = async () => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getTheTotalNoOfGigs();
  return tokenId;
};

export const setHourlyRate = async ({ gigID, rate, sign, message }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.setHourlyRate(gigID, rate, sign, message);
  return tokenId;
};

export const getHourlyRate = async ({ did }) => {
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();
  const signer = provider.getSigner();
  const Role = new ethers.Contract(gighubadd, gighubabi, signer);
  const tokenId = await Role.getHourlyRate(did);
  return tokenId;
};

export const Transfer = async ({ val, toAdd, fromAdd }) => {
  console.log(val, toAdd, fromAdd);
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();

  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer);
  const valueInWei = ethers.utils.parseEther(val);
  console.log(valueInWei);
  const Role = new ethers.Contract(tokenadd, Token, signer);
  console.log(Role);

  const tokenId = await Role.transferFrom(fromAdd, toAdd, val, {
    value: valueInWei,
  });
  console.log(tokenId);
  return tokenId;
};
export const TransferToEscow = async ({ val }) => {
  console.log(val);
  const provider =
    window.ethereum != null
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();

  console.log(provider);
  const signer = provider.getSigner();
  console.log(signer);
  const valueInWei = ethers.utils.parseEther(val);
  console.log(valueInWei);
  const Role = new ethers.Contract(tokenescrow, TokenEscrow, signer);
  console.log(Role);
  const valInWei = ethers.BigNumber.from(val);
  const valInInt = parseInt(val);
  console.log("valInInt", valInInt);
  const valInEth = ethers.utils.parseEther(val);

  console.log("valInEth", valInEth);

  const Role2 = new ethers.Contract(tokenadd, Token, signer);
  console.log("role2", Role2);

  const transferPromise2 = await Role2.approve(tokenescrow, valInEth);

  await transferPromise2.wait();

  console.log("approval", transferPromise2);

  const tokenId = await Role.receiveTokens(valInEth);
  console.log(tokenId);
  return tokenId;
};
