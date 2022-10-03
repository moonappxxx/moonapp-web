import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useDisclosure } from "@chakra-ui/react";

import { useWeb3React } from "@web3-react/core";

import { env } from "../../env/client.mjs";

import useENSName from "../../hooks/useENSName";
import useTokenBalance from "../../hooks/useTokenBalance";
import { parseBalance } from "../../utils/format";

import { connectors } from "../../connectors";
import { formatEtherscanLink, shortenHex } from "../../utils/format";

import { Button } from "../../components/common/Button";

import styles from "./ConnectWallet.module.scss";

import SelectWalletModal from "./SelectWalletModal";

type OwnProps = {};

const ConnectWallet: React.FC<OwnProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();

  const { data: tokenBalance } = useTokenBalance(
    account || null,
    env.NEXT_PUBLIC_TOKEN_ADDRESS,
  );

  const ENSName = useENSName(account || undefined);

  const refreshState = () => {
    window.localStorage.setItem("provider", "");
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider as "injected" | "walletConnect"]);
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        {typeof account !== "string" ? (
          <>
            {!active ? (
              <Button size="small" color="primary-outline" onClick={onOpen}>
                Connect Wallet
              </Button>
            ) : (
              <Button size="small" color="primary-outline" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </>
        ) : (
          <div className={styles.wallet}>
            <div className={styles.balance}>
              {`${env.NEXT_PUBLIC_TOKEN_SYMBOL} Balance`}:{" "}
              {parseBalance(tokenBalance, 18, 2) ?? 0}
            </div>
            <Link
              href={
                chainId && account
                  ? formatEtherscanLink("Account", [chainId, account])
                  : ""
              }
            >
              <a
                className={styles.address}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ENSName || `${shortenHex(account, 4)}`}
              </a>
            </Link>
            <Button
              size="small"
              color="primary-outline"
              onClick={disconnect}
              className={styles.disconnect}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M215.469 332.802l29.863 29.864L352 256 245.332 149.333l-29.863 29.865 55.469 55.469H64v42.666h205.864l-54.395 55.469zM405.334 64H106.666C83.198 64 64 83.198 64 106.666V192h42.666v-85.333h298.668v298.668H106.666V320H64v85.334C64 428.802 83.198 448 106.666 448h298.668C428.802 448 448 428.802 448 405.334V106.666C448 83.198 428.802 64 405.334 64z"></path>
              </svg>
            </Button>
          </div>
        )}
      </div>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
};

export default ConnectWallet;
