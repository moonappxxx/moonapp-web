import SEED_CONTRACT from "../contracts/Seed.json";
import useContract from "./useContract";

export default function useSeedContract(seedAddress: string) {
  return useContract<any>(seedAddress, SEED_CONTRACT.abi);
}
