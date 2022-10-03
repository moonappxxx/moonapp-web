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

  const { accountVestingAddress, investorTokensAmount } = useSeed(
    env.NEXT_PUBLIC_SEED_ADDRESS,
    account,
  );

  const { balance, nextReleaseDate, releaseTokens, isLoading } =
    useTokenVesting(accountVestingAddress, env.NEXT_PUBLIC_TOKEN_ADDRESS);

  const releaseDisabled = balance?.releasableAmount == 0 || isLoading;

  return (
    <DashboardLayout>
      <div className={styles["seed-cards"]}>
        <div className={styles["seed-card"]}>
          <div className={styles.value}>
            {parseBalance(investorTokensAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </div>
          <div className={styles.info}>Total amount of tokens bought</div>
        </div>
        <div className={styles["seed-card"]}>
          <div className={styles.value}>
            {parseBalance(balance?.releasedAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </div>
          <div className={styles.info}>Amount of tokens claimed</div>
        </div>
        <div className={styles["seed-card"]}>
          <div className={styles.value}>
            {parseBalance(balance?.lockedAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </div>
          <div className={styles.info}>Amount of locked tokens left</div>
        </div>
      </div>
      <div className={styles.claim}>
        <div className={styles["claim-header"]}>
          <div className={styles["locked-tokens-title"]}>
            Available for claim:{" "}
            {parseBalance(balance?.releasableAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </div>
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
            Claim {parseBalance(balance?.releasableAmount, 18, 2)}{" "}
            {env.NEXT_PUBLIC_TOKEN_SYMBOL}
          </Button>

          <div className={styles["next-release"]}>
            <div className={styles["next-release-title"]}>
              Next release date
            </div>
            <div className={styles["next-release-value"]}>
              {nextReleaseDate ?? "-"}
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
