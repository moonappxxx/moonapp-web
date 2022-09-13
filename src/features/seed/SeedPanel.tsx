import React from "react";
import { useWeb3React } from "@web3-react/core";

import { env } from "../../env/client.mjs";

import { Button } from "../../components/common/Button";
import DashboardLayout from "../../layouts/DashboardLayout";

import useSeed from "../../hooks/useSeed";
import useTokenVesting from "../../hooks/useTokenVesting";
import { parseBalance } from "../../utils/format";

import styles from "./SeedPanel.module.scss";

const SeedPanel: React.FC = () => {
  const { account } = useWeb3React();

  const { accountVestingAddress } = useSeed(
    env.NEXT_PUBLIC_SEED_ADDRESS,
    account,
  );

  const {
    releasableAmount,
    vestedAmount,
    lockedAmount,
    releaseTokens,
    isLoading,
  } = useTokenVesting(accountVestingAddress, env.NEXT_PUBLIC_TOKEN_ADDRESS);

  const releaseDisabled = releasableAmount == 0 || isLoading;

  return (
    <DashboardLayout>
      <div className={styles.claim}>
        <div className={styles["claim-header"]}>
          <div className={styles.ticker}>{env.NEXT_PUBLIC_TOKEN_SYMBOL}</div>

          <div className={styles["claim-title"]}>Moonapp Token Locked</div>
        </div>
        <div className={styles["claim-body"]}>
          <Button
            color="primary"
            size="large"
            disabled={releaseDisabled}
            onClick={(e) => {
              e.preventDefault();

              if (releaseDisabled) return;
              releaseTokens();
            }}
          >
            Unlock {parseBalance(releasableAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </Button>

          <div className={styles["locked-tokens"]}>
            <div className={styles["locked-tokens-title"]}>Locked tokens</div>
            <div className={styles["locked-tokens-value"]}>
              {parseBalance(lockedAmount, 18, 2)}{" "}
              <span>{env.NEXT_PUBLIC_TOKEN_SYMBOL} locked</span>
            </div>
          </div>
        </div>
        <div className={styles["claim-footer"]}>
          <div className={styles.note}>
            You can claim 10% of {env.NEXT_PUBLIC_TOKEN_SYMBOL} tokens on
            listing and then monthly unlock for 15% starting from the second
            month.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedPanel;
