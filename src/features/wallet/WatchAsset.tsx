import React from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { Button } from "../../components/common/Button";

const WatchAsset: React.FC<{ address: string; symbol: string }> = ({
  address,
  symbol,
}) => {
  const watchAsset = async () => {
    const provider: any = await detectEthereumProvider({
      timeout: 1000,
      mustBeMetaMask: true,
    });

    if (provider) {
      await provider?.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address,
            symbol,
            decimals: 18,
          },
        },
      });
    }
  };

  return (
    <Button size="small" color="primary-outline" onClick={watchAsset}>
      Add to MetaMask
    </Button>
  );
};

export default WatchAsset;
