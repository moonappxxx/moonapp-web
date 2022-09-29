import { useQuery, useMutation, useQueryClient } from "react-query";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import { formatDateTimestamp } from "../utils/format";

import useTokenVestingContract from "./useTokenVestingContract";

const defaultBalance = {
  releasableAmount: 0,
  releasedAmount: 0,
  vestedAmount: 0,
  lockedAmount: 0,
};

const useTokenVesting = (vestingAddress: string, tokenAddress: string) => {
  const queryClient = useQueryClient();
  const { account } = useWeb3React();

  const vestingContract = useTokenVestingContract(vestingAddress);

  const shouldFetch =
    typeof vestingAddress === "string" &&
    typeof tokenAddress === "string" &&
    !!vestingContract;

  const {
    data: balance,
    status: balanceStatus,
    refetch: refetchBalance,
  } = useQuery(
    ["locked-amount", vestingAddress, tokenAddress],
    async () => {
      if (!vestingContract || !tokenAddress) return 0;

      const releasableAmount = await vestingContract.releasableAmount(
        tokenAddress,
      );
      const vestedAmount = await vestingContract.vestedAmount(tokenAddress);
      const lockedAmount = await vestingContract.lockedAmount(tokenAddress);
      const releasedAmount = await vestingContract.released();

      return {
        releasableAmount: releasableAmount ?? 0,
        vestedAmount: vestedAmount ?? 0,
        lockedAmount: lockedAmount ?? 0,
        releasedAmount: releasedAmount ?? 0,
      };
    },
    {
      enabled: shouldFetch,
    },
  );

  const {
    data: nextReleaseDate,
    status: nextReleaseDateStatus,
    refetch: refetchNextReleaseDate,
  } = useQuery(
    ["vesting-next-release-date", vestingAddress, tokenAddress],
    async () => {
      if (!vestingContract || !tokenAddress) return 0;

      const ONE_MONTH = 60 * 60 * 24 * 30;
      const nowTimestamp = Math.floor(new Date().getTime() / 1000);
      const cliffDate = +formatUnits(await vestingContract.cliff(), 0);

      let releaseTimestamp;
      if (nowTimestamp < cliffDate) {
        releaseTimestamp = cliffDate + ONE_MONTH;
      } else {
        const monthsGone = Math.floor((nowTimestamp - cliffDate) / ONE_MONTH);
        releaseTimestamp = cliffDate + monthsGone * ONE_MONTH + ONE_MONTH;
      }

      return formatDateTimestamp(releaseTimestamp * 1000);
    },
    {
      enabled: shouldFetch,
    },
  );

  const { mutate: releaseTokens, isLoading: releasing } = useMutation(
    async () => {
      if (!vestingContract || !tokenAddress) return 0;
      const release = await vestingContract.release(tokenAddress);
      await release?.wait();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "releasable-amount",
          vestingAddress,
          tokenAddress,
        ]);
        queryClient.invalidateQueries([
          "locked-amount",
          vestingAddress,
          tokenAddress,
        ]);
        queryClient.invalidateQueries(["token-balance", account, tokenAddress]);
      },
    },
  );

  const isLoading =
    releasing ||
    balanceStatus === "loading" ||
    nextReleaseDateStatus === "loading";

  return {
    isLoading,
    balance: balance || defaultBalance,
    nextReleaseDate,
    refetchBalance,
    releaseTokens,
    refetchNextReleaseDate,
  };
};

export default useTokenVesting;
