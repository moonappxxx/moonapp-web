import MOONAPP_TOKEN from "../contracts/MoonappToken.json";
import useContract from "./useContract";

export default function useTokenContract(tokenAddress: string) {
  return useContract<any>(tokenAddress, MOONAPP_TOKEN.abi);
}
