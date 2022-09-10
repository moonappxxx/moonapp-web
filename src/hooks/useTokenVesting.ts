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

      const vestedAmount = await vestingContract.vestedAmount(tokenAddress);

      return formatUnits(vestedAmount, 0);
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

      const vestedAmount = await vestingContract.releasableAmount(tokenAddress);

      return formatUnits(vestedAmount, 0);
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
        refetchReleasableAmount();
      },
    },
  );

  const isLoading =
    releasing ||
    releasableAmountStatus === "loading" ||
    vestedAmountStatus === "loading";

  return {
    isLoading,
    vestedAmount,
    refetchVestedAmount,
    releasableAmount,
    refetchReleasableAmount,
    releaseTokens,
  };
};

export default useTokenVesting;
