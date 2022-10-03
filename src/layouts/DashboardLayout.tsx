import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const ConnectWallet = dynamic(
  () => import("../features/wallet/ConnectWallet"),
  { ssr: false },
);

import styles from "./DashboardLayout.module.scss";

type OwnProps = {
  children: any;
};

const DashboardLayout: React.FC<OwnProps> = ({ children }) => {
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 991px)",
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Link href="https://www.moonapp.org">
                <a>
                  <Image
                    className={styles["logo-img"]}
                    src="https://static.tildacdn.com/tild6236-6161-4433-a432-613231303837/moon-app-logo.svg"
                    alt="MOONAPP"
                    width={40}
                    height={40}
                  />
                </a>
              </Link>
            </div>
            <ul className={styles.nav}>
              <li>
                <Link href="https://www.moonapp.org">
                  <a>BACK TO WEBSITE</a>
                </Link>
              </li>
              {!isTabletOrMobile && (
                <>
                  <li>
                    <Link href="https://drive.google.com/file/d/1mrR8Crhme1602Du5fG6uUnlVEzNyc_ED/view?usp=sharing">
                      <a target="_blank">WHITEPAPER</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.moonapp.org/moonapptoken">
                      <a target="_blank">MOONAPP TOKEN</a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          {!isTabletOrMobile && (
            <div className={styles.right}>
              <div className={styles["connect-wallet"]}>
                <ConnectWallet />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.scrollable}>
        <div className={styles.container}>
          <div className={styles.title}>
            MoonApp Claim portal for Pre-Seed &amp; Seed
          </div>

          {isTabletOrMobile && (
            <div className={styles["connect-wallet"]}>
              <ConnectWallet />
            </div>
          )}

          {children}
        </div>

        <div className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.copyright}>
              <p>
                Holding, trading or using crypto assets carry significant risks,
                please carefully read our Disclaimer page. MoonApp and
                aspecially MoonApp team does not provide any financial, legal or
                tax advice, no should this website or any materials on this site
                be viewed as an offer or inducement to make any financial
                decisions. You alone are responsible for any decisions you make.
              </p>
              <p>All content ©2022 MoonApp. All rights reserved</p>
            </div>
            <div className={styles.social}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
