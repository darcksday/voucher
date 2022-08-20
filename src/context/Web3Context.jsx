import React, { useEffect, useState } from "react";
import { Web3ReactProvider } from '@web3-react/core'
import { ethers, BigNumber } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';


export const Web3Context = React.createContext();
export const SignInProvider = ({ children }) => {
  const [CHAIN_ID, CHAIN_NAME, RPC_URL, EXPLORER_URL, TOKEN_SYMBOL, TOKEN_DECIMALS] = [import.meta.env.V_CHAIN_ID, import.meta.env.V_CHAIN_NAME, import.meta.env.V_RPC_URL, import.meta.env.V_EXPLORER_URL, import.meta.env.V_TOKEN_SYMBOL, import.meta.env.V_TOKEN_DECIMALS];
  const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 5000;
    return library;
  }


  const isMetamaskInstalled = () => {
    return typeof window.ethereum !== "undefined";
  };


  const checkNetwork = async (chainId) => {
    if (!chainId) {
      chainId = await window.ethereum.request({ method: 'eth_chainId' });
      chainId = BigNumber.from(chainId).toNumber();
    }
    return chainId === BigNumber.from(CHAIN_ID).toNumber();
  }


  const connectWeb3Wallets = async (activate, chainId) => {
    try {
      const injected = new InjectedConnector({
        supportedChainIds: [BigNumber.from(CHAIN_ID).toNumber()]
      });
      await activate(injected);

    } catch (e) {
      console.log('Connection Error!', e)
    }

    if (!chainId) {
      await switchNetworkToCorrect();
    }
  }


  const switchNetworkToCorrect = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN_ID,
              chainName: CHAIN_NAME,
              rpcUrls: RPC_URL.split(','),
              blockExplorerUrls: [EXPLORER_URL],
              nativeCurrency: {
                symbol: TOKEN_SYMBOL,
                decimals: parseInt(TOKEN_DECIMALS)
              }
            }]
        });
      }
    }
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Context.Provider
        value={{
          switchNetworkToCorrect,
          connectWeb3Wallets,
          checkNetwork,
          isMetamaskInstalled,
        }}>
        {children}
      </Web3Context.Provider>
    </Web3ReactProvider>

  )

}