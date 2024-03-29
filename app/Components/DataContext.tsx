"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  balanceOf,
  getAllDIDInfo,
  getDIDInfos,
} from "@/config/BlockchainServices";

const EthereumContext = createContext();

export const EthereumProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [getusers, setGetusers] = useState([]);
  const [didData, setDidData] = useState("");
  const [userrole, setUserrole] = useState("");
  const [ipfsData, setIpfsData] = useState({});
  const [balance, setBalance] = useState("");
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAddress(address);

          const didInfo = await getDIDInfos(address); // Assuming this includes an ipfsHash
          if (didInfo[2]) {
            fetchIPFSData(didInfo[2]);
          }
          if (didInfo[1] == 1) {
            setUserrole("Developer");
          } else {
            setUserrole("Provider");
          }
          const users = await getAllDIDInfo();
          setGetusers(users);
          const balance = await provider.getBalance(address);
          const balanceInEther = ethers.utils.formatEther(balance);
          setBalance(balanceInEther);

          console.log("DID Info:", didInfo);
          setDidData(JSON.stringify(didInfo)); // Assuming you want to display the DID info as JSON
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    }

    async function fetchIPFSData(ipfsHash) {
      const url = `https://ipfs.io/ipfs/${ipfsHash}`; // Using a public IPFS gateway
      try {
        const response = await fetch(url);
        const data = await response.json(); // Assuming the IPFS data is in JSON format
        setIpfsData(data); // Store the fetched IPFS data
      } catch (error) {
        console.error("Failed to fetch IPFS data:", error);
      }
    }
    initialize();
  }, []);

  return (
    <EthereumContext.Provider
      value={{ address, didData, balance, ipfsData, userrole, getusers }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
