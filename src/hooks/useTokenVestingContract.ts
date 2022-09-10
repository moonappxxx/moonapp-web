import TOKEN_VESTING_CONTRACT from "../contracts/TokenVesting.json";
import useContract from "./useContract";

export default function useTokenVestingContract(vestingAddress: string) {
  return useContract<any>(vestingAddress, TOKEN_VESTING_CONTRACT.abi);
}
