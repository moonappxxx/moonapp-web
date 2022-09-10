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

        const vestingAddress = await seedContract.getInvestorVestingAddress(
          account,
        );

        return vestingAddress;
      },
      {
        enabled: shouldFetch,
      },
    );

  const { data: accountBalance, refetch: refetchAccountBalance } = useQuery(
    ["investor-balance", seedAddress, account],
    async () => {
      if (!seedContract || !account) return 0;

      const balance = await seedContract.getInvestorBalance(account);

      return formatUnits(balance, 0);
    },
    {
      enabled: shouldFetch,
    },
  );

  return {
    accountVestingAddress,
    refetchAccountVestingAddress,
    accountBalance,
    refetchAccountBalance,
  };
};

export default useTokenVesting;
