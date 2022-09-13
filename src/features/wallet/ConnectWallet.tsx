import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";

import { env } from "../../env/client.mjs";

import useMetaMaskOnboarding from "../../hooks/useMetaMaskOnboarding";
import useENSName from "../../hooks/useENSName";
import useTokenBalance from "../../hooks/useTokenBalance";
import { parseBalance } from "../../utils/format";

import { injected } from "../../connectors";
import { formatEtherscanLink, shortenHex } from "../../utils/format";

import { Button } from "../../components/common/Button";

import styles from "./ConnectWallet.module.scss";

type OwnProps = {};

const ConnectWallet: React.FC<OwnProps> = () => {
  const { active, error, activate, chainId, account, setError, library } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  const { data: tokenBalance } = useTokenBalance(
    account || null,
    env.NEXT_PUBLIC_TOKEN_ADDRESS,
  );

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
            {`${env.NEXT_PUBLIC_TOKEN_SYMBOL} Balance`}:{" "}
            {parseBalance(tokenBalance, 18, 2) ?? 0}
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
