"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { balanceOf, getDIDInfos } from "@/config/BlockchainServices";

const EthereumContext = createContext();

export const EthereumProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [didData, setDidData] = useState("");
  const [balance, setBalance] = useState("");
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAddress(address);

          const getdid = await getDIDInfos(address);
          const balance = await balanceOf(address);
          setBalance(balance);
          console.log("get", getdid);
          setDidData(getdid);
        } catch (error) {
          console.error(
            "An error occurred while fetching the DID data:",
            error
          );
        }
      }
    }
    initialize();
  }, []);

  return (
    <EthereumContext.Provider value={{ address, didData, balance }}>
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
