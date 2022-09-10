import create from "zustand";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

type WalletState = {
  walletConnected: boolean;
  connectWallet: () => void;
};

const INITIAL_STATE = {
  walletConnected: false,
};

const providerOptions = {
};


const useWalletStore = create<WalletState>((set, get) => ({
  ...INITIAL_STATE,
  connectWallet: async () => {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      disableInjectedProvider: false,
      providerOptions 
    });

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const address = await signer.getAddress();


    console.log(instance, provider, signer, address)
  },
  
}));

export const selectConnectWallet = (state: WalletState) => state.connectWallet;

export { useWalletStore };
