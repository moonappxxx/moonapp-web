import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { env } from "./env/client.mjs";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 31337],
});

const RPC_URLS: { [chainId: number]: string } = {
  1: env.NEXT_PUBLIC_RPC_URL_1 as string,
  5: env.NEXT_PUBLIC_RPC_URL_5 as string,
};

const walletConnect = new WalletConnectConnector({
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  infuraId: env.NEXT_PUBLIC_INFURA_ID,
});

export const connectors = {
  injected,
  walletConnect,
};
