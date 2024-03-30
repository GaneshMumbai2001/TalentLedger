"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  balanceOf,
  getAllDIDInfo,
  getDIDInfos,
} from "@/config/BlockchainServices";

const EthereumContext = createContext();

const QueryURL =
  "https://api.studio.thegraph.com/query/69619/test/version/latest";
const query = `
  query {
    didregistereds {
      id
      role
      ipfsHash
    }
  }
`;

const escrowquery = `
query MyQuery {
  escrowCreateds(
    first: 10
    orderBy: id
    orderDirection: asc
    skip: 10
    subgraphError: allow
  ) {
    amount
    blockNumber
    blockTimestamp
    escrowId
    id
    provider
    transactionHash
  }
}`;
const client = new ApolloClient({
  uri: QueryURL,
  cache: new InMemoryCache(),
});
export const EthereumProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [getusers, setGetusers] = useState();
  const [didData, setDidData] = useState("");
  const [gigdata, setGigData] = useState("");
  const [userrole, setUserrole] = useState("");
  const [ipfsData, setIpfsData] = useState({});
  const [balance, setBalance] = useState("");
  const [dataUpdateds, setDataUpdates] = useState([]);

  useEffect(() => {
    const getDataUpdates = async () => {
      client
        .query({
          query: gql(query),
          variables: { userAddress: address },
        })
        .then((data) => {
          const finalData = data;
          console.log("Data from GraphQL", finalData.data.didregistereds);
          setDataUpdates(finalData.data.didregistereds);
        });
      client
        .query({
          query: gql(escrowquery),
          variables: { userAddress: address },
        })
        .then((data) => {
          const finalData = data;
          console.log("Data from GraphQL", finalData.data.didregistereds);
          setDataUpdates(finalData.data.didregistereds);
        });
    };
    getDataUpdates();
  }, []);

  console.log("dataUpdateds", dataUpdateds);

  function extractGitHubUsernames(ipfsDataArray) {
    return ipfsDataArray.flatMap((data) => {
      return data.links
        .map((link) => {
          const githubUrl = link.github || "";
          const match = githubUrl.match(/github\.com\/([^\/]+)/);
          return match ? match[1] : null;
        })
        .filter((username) => username !== null);
    });
  }

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAddress(address);

          const didInfo = await getDIDInfos(address);
          if (didInfo[2]) {
            fetchIPFSData(didInfo[2]);
          }
          if (didInfo[1] == 1) {
            setUserrole("Developer");
          } else {
            setUserrole("Provider");
          }
          const users = await getAllDIDInfo();
          console.log("users", users);

          const ipfsHashes = users[2];
          const ipfsDataPromises = ipfsHashes.map(fetchallIPFSData);
          try {
            const ipfsDataArray = await Promise.all(ipfsDataPromises);
            console.log("All IPFS Data:", ipfsDataArray);
            const githubUsernames = extractGitHubUsernames(ipfsDataArray);
            console.log("GitHub Usernames:", githubUsernames);
            setGigData(githubUsernames);
            setGetusers(ipfsDataArray);
          } catch (error) {
            console.error("Failed to fetch one or more IPFS data:", error);
          }
          const balance = await provider.getBalance(address);
          const balanceInEther = ethers.utils.formatEther(balance);
          setBalance(balanceInEther);

          console.log("DID Info:", didInfo);
          setDidData(JSON.stringify(didInfo));
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
    async function fetchallIPFSData(ipfsHash) {
      const url = `https://ipfs.io/ipfs/${ipfsHash}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch IPFS data:", error);
        return null;
      }
    }

    initialize();
  }, []);

  return (
    <EthereumContext.Provider
      value={{
        address,
        didData,
        balance,
        ipfsData,
        userrole,
        getusers,
        gigdata,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
