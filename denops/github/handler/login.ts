import type { Denops } from "jsr:@denops/std@7.6.0";
import { batch } from "jsr:@denops/std@7.6.0/batch";
import { echo } from "jsr:@denops/std@7.6.0/helper";
import { systemopen } from "jsr:@lambdalisue/systemopen@1.0.0";

import {
  createOAuthDeviceAuth,
} from "https://esm.sh/@octokit/auth-oauth-device@8.0.1";
import type { OnVerificationCallback } from "https://esm.sh/v135/@octokit/auth-oauth-device@8.0.1/dist-types/types.d.ts";

export async function login(denops: Denops, clientID: string) {
  const options: {
    onVerification: OnVerificationCallback;
  } = {
    onVerification: (v) => {
      batch(denops, async (denops) => {
        await echo(
          denops,
          [
            `Open ${v.verification_uri}`,
            `and put your one-time code : ${v.user_code}`,
          ].join("\n "),
        );
      });
      systemopen(v.verification_uri);
      // TODO: If it does not inistalled, kyoh86-dotfiles should be installed.
      // https://github.com/settings/apps/kyoh86-dotfiles/installations
    },
  };

  const auth = createOAuthDeviceAuth({
    clientType: "github-app",
    clientId: clientID,
    ...options,
  });
  return await auth({ type: "oauth" });
}
