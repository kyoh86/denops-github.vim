// deno-lint-ignore-file no-explicit-any

// Types that defined in "https://esm.sh/v135/@octokit/auth-oauth-device@8.0.1/dist-types/types.d.ts";
export type Verification = {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
};

export type OnVerificationCallback = (
  verification: Verification,
) => any | Promise<any>;
