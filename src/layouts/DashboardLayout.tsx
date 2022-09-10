import React from 'react';
import dynamic from "next/dynamic";

const ConnectWallet = dynamic(
  () => import("../features/wallet/ConnectWallet"),
  { ssr: false },
);

import styles from './DashboardLayout.module.scss';

type OwnProps = {
  children: any;
}

const DashboardLayout: React.FC<OwnProps> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollable}>
        <div className={styles.container}>
          <div className={styles.title}>
            Pre-Seed &amp; Seed
          </div>

          <div className={styles['connect-wallet']}>
            <ConnectWallet />
          </div>

          {children}
        </div>

        <div className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.copyright}>
              <p>
                Holding, trading or using crypto assets carry significant risks, please carefully read our Disclaimer page. MoonApp and aspecially MoonApp team does not provide any financial, legal or tax advice, no should this website or any materials on this site be viewed as an offer or inducement to make any financial decisions. You alone are responsible for any decisions you make.
              </p>
              <p>
                All content ©2022 MoonApp. All rights reserved
              </p>
            </div>
            <div className={styles.social}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout;