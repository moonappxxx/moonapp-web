import { useQuery, useMutation } from "react-query";
import { formatUnits } from "@ethersproject/units";

import { parseBalance } from "../utils/format";

import useTokenVestingContract from "./useTokenVestingContract";

const useTokenVesting = (vestingAddress: string, tokenAddress: string) => {
  const vestingContract = useTokenVestingContract(vestingAddress);

  const shouldFetch =
    typeof vestingAddress === "string" &&
    typeof tokenAddress === "string" &&
    !!vestingContract;

  const {
    data: vestedAmount,
    refetch: refetchVestedAmount,
    status: vestedAmountStatus,
  } = useQuery(
    ["token-vested-amount", vestingAddress, tokenAddress],
    async () => {
      if (!vestingContract || !tokenAddress) return 0;

      const amount = await vestingContract.vestedAmount(tokenAddress);
      if (!amount) return 0;

      return formatUnits(amount, 0);
    },
    {
      enabled: shouldFetch,
    },
  );

  const {
    data: releasableAmount,
    status: releasableAmountStatus,
    refetch: refetchReleasableAmount,
  } = useQuery(
    ["releasable-amount", vestingAddress, tokenAddress],
    async () => {
      if (!vestingContract || !tokenAddress) return 0;

      const amount = await vestingContract.releasableAmount(tokenAddress);
      if (!amount) return 0;

      return formatUnits(amount, 0);
    },
    {
      enabled: shouldFetch,
    },
  );

  const {
    data: lockedAmount,
    status: lockedAmountStatus,
    refetch: refetchLockedAmount,
  } = useQuery(
    ["locked-amount", vestingAddress, tokenAddress],
    async () => {
      if (!vestingContract || !tokenAddress) return 0;

      const amount = await vestingContract.lockedAmount(tokenAddress);
      if (!amount) return 0;

      return formatUnits(amount, 0);
    },
    {
      enabled: shouldFetch,
    },
  );

  const { mutate: releaseTokens, isLoading: releasing } = useMutation(
    async () => {
      if (!vestingContract || !tokenAddress) return 0;
      await vestingContract.release(tokenAddress);
    },
    {
      onSuccess: () => {
        console.log("success");
        refetchReleasableAmount();
        refetchLockedAmount();
      },
    },
  );

  const isLoading =
    releasing ||
    releasableAmountStatus === "loading" ||
    lockedAmountStatus === "loading" ||
    vestedAmountStatus === "loading";

  return {
    isLoading,
    vestedAmount: vestedAmount || 0,
    refetchVestedAmount,
    lockedAmount: lockedAmount || 0,
    refetchLockedAmount,
    releasableAmount: releasableAmount || 0,
    refetchReleasableAmount,
    releaseTokens,
  };
};

export default useTokenVesting;
