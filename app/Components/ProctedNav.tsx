"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import walletpng from "../../assets/wallet.svg";
import { LuFileSpreadsheet } from "react-icons/lu";
import profile from "../../assets/profile.svg";
import {
  FaArrowRight,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

interface ProtectedNavbarProps {
  onSearch?: (searchTerm: string) => void;
}

const { chains, publicClient } = configureChains([sepolia], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "talentledger",
  projectId: "14b7354cf96cf3a50f28ab21ccd962d1",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
const myTheme: Theme = {
  colors: {
    modalBackground: "white",
    profileAction: "white",
  },
  radii: {
    connectButton: "10px",
  },
};

function ProtectedNavbar({ onSearch }: ProtectedNavbarProps) {
  const [activeLink, setActiveLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", id: "Home" },
    { name: "About Us", id: "about" },
    { name: "Find Gigs", id: "gigs" },
    { name: "Post Gigs", id: "gigs" },
    { name: "Contact Us", id: "contact" },
  ];

  const handleSearchChange = (e: any) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={myTheme} chains={chains}>
        <div className="bg-[#FBF4EE]relative ">
          <div className="flex py-6 px-20 justify-between items-center">
            <div className="relative  flex space-x-16 items-center">
              <Image src={logo} alt="logo" />
            </div>
            <div className="md:block hidden">
              <div className="flex text-md ml-20 font-bold space-x-14 items-center ">
                {navLinks.map((link) => (
                  <p
                    key={link.id}
                    className={`hover:text-[#00CBA0] cursor-pointer ${
                      activeLink === link.id ? "text-[#00CBA0]" : ""
                    }`}
                    onClick={() => setActiveLink(link.id)}
                  >
                    {link.name}
                  </p>
                ))}
                <div
                  onClick={toggleProfileDropdown}
                  className="relative cursor-pointer"
                >
                  {isProfileDropdownOpen && (
                    <div className="absolute -right-4 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                      <Link
                        href="/Profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaUser className="mr-3" /> Profile
                      </Link>
                      <Link
                        href="/Manage"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LuFileSpreadsheet className="mr-3" /> Manage Gigs
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-3" /> Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:block hidden">
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
                              className="bg-[#141413] flex space-x-2 px-4 text-sm text-white font-semibold py-3 rounded-xl"
                              onClick={openConnectModal}
                              type="button"
                            >
                              <span>Wallet Connect</span>{" "}
                              <Image src={walletpng} alt="" />
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
            </div>
            <div
              className="md:hidden flex items-center"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? (
                <FaTimes className="text-3xl" />
              ) : (
                <FaBars className="text-3xl" />
              )}
            </div>
          </div>
          {isNavOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center space-y-8 md:hidden">
              {navLinks.map((link) => (
                <p
                  key={link.id}
                  className={`text-white hover:text-[#00CBA0] text-xl cursor-pointer ${
                    activeLink === link.id ? " text-[#00CBA0]" : ""
                  }`}
                  onClick={() => {
                    setActiveLink(link.id);
                    setIsNavOpen(false);
                  }}
                >
                  {link.name}
                </p>
              ))}
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
                              className="bg-[#141413] flex space-x-2 px-4 text-sm text-white font-semibold py-3 rounded-xl"
                              onClick={openConnectModal}
                              type="button"
                            >
                              <span>Wallet Connect</span>{" "}
                              <Image src={walletpng} alt="" />
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
            </div>
          )}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default ProtectedNavbar;
