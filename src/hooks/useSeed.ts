import { useQuery } from "react-query";
import { formatUnits } from "@ethersproject/units";

import useSeedContract from "./useSeedContract";

const useTokenVesting = (seedAddress: string, account?: string | null) => {
  const seedContract = useSeedContract(seedAddress);

  const shouldFetch =
    typeof seedAddress === "string" &&
    typeof account === "string" &&
    !!seedContract;

  const { data: accountVestingAddress, refetch: refetchAccountVestingAddress } =
    useQuery(
      ["account-vesting-address", seedAddress, account],
      async () => {
        if (!seedContract || !account) return 0;

        try {
          const vestingAddress = await seedContract.getInvestorVestingAddress(
            account,
          );

          return vestingAddress;
        } catch (error) {
          return "";
        }
      },
      {
        enabled: shouldFetch,
      },
    );

  const { data: investorTokensAmount, refetch: refetchInvestorTokensAmount } =
    useQuery(
      ["investor-balance", seedAddress, account],
      async () => {
        if (!seedContract || !account) return 0;

        try {
          const balance = await seedContract.getInvestorBalance(account);
          return balance ?? 0;
        } catch (error) {
          return 0;
        }
      },
      {
        enabled: shouldFetch,
      },
    );

  return {
    accountVestingAddress,
    refetchAccountVestingAddress,
    investorTokensAmount: investorTokensAmount || 0,
    refetchInvestorTokensAmount,
  };
};

export default useTokenVesting;
