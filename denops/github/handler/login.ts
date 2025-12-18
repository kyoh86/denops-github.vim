import type { Denops } from "@denops/std";
import { batch } from "@denops/std/batch";
import { echo } from "@denops/std/helper";
import { systemopen } from "@lambdalisue/systemopen";

import {
  createOAuthDeviceAuth,
  type GitHubAppStrategyOptions,
} from "@octokit/auth-oauth-device";
type OnVerificationCallback = GitHubAppStrategyOptions["onVerification"];

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
    },
  };

  const auth = createOAuthDeviceAuth({
    clientType: "github-app",
    clientId: clientID,
    ...options,
  });
  return await auth({ type: "oauth" });
}
