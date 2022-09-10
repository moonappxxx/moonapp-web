import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";

import useMetaMaskOnboarding from "../../hooks/useMetaMaskOnboarding";
import useENSName from "../../hooks/useENSName";
import useTokenBalance from "../../hooks/useTokenBalance";
import { parseBalance } from "../../utils/format";

import { injected } from "../../connectors";
import { formatEtherscanLink, shortenHex } from "../../utils/format";

import { Button } from "../../components/common/Button";

import styles from "./ConnectWallet.module.scss";

type OwnProps = {};

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const symbol = "$XXX";

const ConnectWallet: React.FC<OwnProps> = () => {
  const { active, error, activate, chainId, account, setError, library } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  const { data: tokenBalance } = useTokenBalance(account || null, tokenAddress);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(() => {
    setConnecting(true);

    activate(injected, undefined, true).catch((error) => {
      // ignore the error if it's a user rejected request
      if (error instanceof UserRejectedRequestError) {
        setConnecting(false);
      } else {
        setError(error);
      }
    });
  }, [setConnecting, setError, activate]);

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  useEffect(() => {
    connect();
  }, [connect]);

  const ENSName = useENSName(account || undefined);

  if (error) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {typeof account !== "string" ? (
        <>
          {isWeb3Available ? (
            <Button
              size="medium"
              color="primary-outline"
              disabled={connecting}
              onClick={connect}
            >
              {isMetaMaskInstalled
                ? "Connect to MetaMask"
                : "Connect your Wallet"}
            </Button>
          ) : (
            <Button
              size="medium"
              color="primary-outline"
              onClick={startOnboarding}
            >
              Install Metamask
            </Button>
          )}
        </>
      ) : (
        <div className={styles.wallet}>
          <div className={styles.balance}>
            {`${symbol} Balance`}: {tokenBalance ?? 0}
          </div>
          <Link
            href={
              chainId && account
                ? formatEtherscanLink("Account", [chainId, account])
                : ""
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <a className={styles.address}>
              {ENSName || `${shortenHex(account, 4)}`}
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
