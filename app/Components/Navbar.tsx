"use client";
import React, { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonZkEvmTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Image from "next/image";
import logo from "../../assets/logo.png";
import tokenlogo from "../../assets/tokenlogo.png";
import Link from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { CheckTokenBalance } from "@/config/BlockchainServices";

const { chains, publicClient } = configureChains(
  [polygonZkEvmTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Gigshub",
  projectId: "GigshubV1",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
const myTheme: Theme = {
  colors: {
    accentColor: "#190482",
    modalBackground: "white",
    profileAction: "white",
  },
  radii: {
    connectButton: "10px",
  },
};

function Navbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={myTheme} chains={chains}>
        <div className="flex justify-between items-center bg-black md:px-14 px-4 py-4">
          {props.did ? (
            <>
              <Link shallow href="/Home">
                <Image className="w-auto h-8 md:h-10" alt="" src={logo} />
              </Link>
            </>
          ) : (
            <>
              <Link shallow href="/">
                <Image className="w-auto h-8 md:h-10" alt="" src={logo} />
              </Link>
            </>
          )}
          <div className="text-white md:ml-40  md:flex hidden space-x-14 cursor-pointer text-md">
            <Link shallow href="/Home">
              <p>Home</p>
            </Link>
            <Link shallow href="/AllGigs">
              <p>Find Gigs</p>
            </Link>
            <Link shallow href="/PostGig">
              <p>Post Gig</p>
            </Link>
          </div>

          {props.did ? (
            <div>
              <p className="text-white py-2 md:hidden">
                {" "}
                {capitalizeFirstLetter(props.did.replace(/[^a-z0-9]/gi, ""))} 🚀
              </p>
            </div>
          ) : (
            <p className="text-white py-2 md:hidden ">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              className="bg-[#3498DB] px-4 text-sm font-semibold py-2 rounded-lg"
                              onClick={openConnectModal}
                              type="button"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button onClick={openChainModal} type="button">
                              Wrong network
                            </button>
                          );
                        }
                        return (
                          <div style={{ display: "flex", gap: 12 }}>
                            <button
                              onClick={openChainModal}
                              style={{ display: "flex", alignItems: "center" }}
                              type="button"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    marginRight: 4,
                                  }}
                                ></div>
                              )}
                            </button>
                            <button onClick={openAccountModal} type="button">
                              {account.displayName}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </p>
          )}

          <div className="hidden md:block text-md text-white">
            {props.did ? (
              <div className="flex space-x-12 items-center">
                <div className="flex space-x-3 items-center">
                  <Image src={tokenlogo} className="w-8 h-8" alt="" />
                  <p className="text-white py-2 ">
                    {props.balance ? props.balance : "0"}
                  </p>
                </div>
                <div>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {capitalizeFirstLetter(
                      props.did.replace(/[^a-z0-9]/gi, "")
                    )}{" "}
                    🚀
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute mt-2 w-40 right-6 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <Link shallow href="/MyProfile">
                        <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          View Profile
                        </p>
                      </Link>
                      <Link
                        shallow
                        href={
                          props.persona === "Dev"
                            ? "/Myapplications"
                            : "/PostedGigs"
                        }
                      >
                        <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          View Applications
                        </p>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                    return (
                      <div
                        {...(!ready && {
                          "aria-hidden": true,
                          style: {
                            opacity: 0,
                            pointerEvents: "none",
                            userSelect: "none",
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button
                                className="bg-[#3498DB] px-4 text-sm font-semibold py-2 rounded-lg"
                                onClick={openConnectModal}
                                type="button"
                              >
                                Connect Wallet
                              </button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button">
                                Wrong network
                              </button>
                            );
                          }
                          return (
                            <div style={{ display: "flex", gap: 12 }}>
                              <button
                                onClick={openChainModal}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 12,
                                      height: 12,
                                      borderRadius: 999,
                                      overflow: "hidden",
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        style={{ width: 12, height: 12 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button onClick={openAccountModal} type="button">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ""}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </p>
            )}
          </div>
        </div>
        <hr className="" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default Navbar;
