import React from "react";
import { useWeb3React } from "@web3-react/core";

import { Button } from "../../components/common/Button";
import DashboardLayout from "../../layouts/DashboardLayout";

import useSeed from "../../hooks/useSeed";
import useTokenVesting from "../../hooks/useTokenVesting";

import styles from "./SeedPanel.module.scss";

const seedAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const SeedPanel: React.FC = () => {
  const { account } = useWeb3React();

  const { accountVestingAddress, accountBalance } = useSeed(
    seedAddress,
    account,
  );

  const { releasableAmount, releaseTokens, isLoading } = useTokenVesting(
    accountVestingAddress,
    tokenAddress,
  );

  const releaseDisabled = releasableAmount == 0 || isLoading;

  return (
    <DashboardLayout>
      <div className={styles.claim}>
        <div className={styles["claim-header"]}>
          <div className={styles.ticker}>$XXX</div>

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
            Unlock {releasableAmount} $XXX
          </Button>

          <div className={styles["locked-tokens"]}>
            <div className={styles["locked-tokens-title"]}>Locked tokens</div>
            <div className={styles["locked-tokens-value"]}>
              {accountBalance} <span>$XXX locked</span>
            </div>
          </div>
        </div>
        <div className={styles["claim-footer"]}>
          <div className={styles.note}>
            You can claim 10% of $XXX tokens on listing and then monthly unlock
            for 15% starting from the second month.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedPanel;
