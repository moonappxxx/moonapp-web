// @ts-check
import { z as zod } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = zod.object({
  // FOO: zod.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = zod.object({
  NEXT_PUBLIC_TOKEN_ADDRESS: zod.string(),
  NEXT_PUBLIC_TOKEN_SYMBOL: zod.string(),
  NEXT_PUBLIC_SEED_ADDRESS: zod.string(),
  NEXT_PUBLIC_RPC_URL_1: zod.string(),
  NEXT_PUBLIC_RPC_URL_5: zod.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof zod.infer<typeof clientSchema>]: zod.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_MOONAPP_TOKEN_ADDRESS,
  NEXT_PUBLIC_TOKEN_SYMBOL: process.env.NEXT_PUBLIC_TOKEN_SYMBOL,
  NEXT_PUBLIC_SEED_ADDRESS: process.env.NEXT_PUBLIC_SEED_CONTRACT_ADDRESS,
  NEXT_PUBLIC_RPC_URL_1: process.env.NEXT_PUBLIC_RPC_URL_1,
  NEXT_PUBLIC_RPC_URL_5: process.env.NEXT_PUBLIC_RPC_URL_5,
};
