import { useQuery } from "react-query";
import { formatUnits } from "@ethersproject/units";

import useTokenContract from "./useTokenContract";

async function getTokenBalance(contract: any, address: string) {
  if (!contract || !address) return 0;
  const balance = await contract.balanceOf(address);
  return formatUnits(balance, 0);
}

export default function useTokenBalance(
  address: string | null,
  tokenAddress: string,
  suspense = false,
) {
  const contract = useTokenContract(tokenAddress);

  const shouldFetch =
    typeof address === "string" &&
    typeof tokenAddress === "string" &&
    !!contract;

  const { data, error, ...rest } = useQuery(
    ["TokenBalance", address, tokenAddress],
    async () => {
      if (!contract || !address) return 0;
      return await getTokenBalance(contract, address);
    },
    {
      suspense,
      enabled: shouldFetch,
    },
  );

  return { data: data || 0 };
}
