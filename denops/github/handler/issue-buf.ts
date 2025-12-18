import { ensure, is } from "@core/unknownutil";
import type { Buffer } from "@kyoh86/denops-router";

export function getIssueIdentifier(buf: Buffer) {
  const owner = ensure(buf.bufname.params?.owner, is.String, {
    message: "a 'owner' parmeter must be a string",
  });
  const repo = ensure(buf.bufname.params?.repo, is.String, {
    message: "a 'repo' parmeter must be a string",
  });
  const numStr = ensure(buf.bufname.params?.num, is.String, {
    message: "a 'num' parmeter must be a string",
  });
  const commentIdStr = ensure(
    buf.bufname.params?.commentId,
    is.UnionOf([is.String, is.Undefined]),
    {
      message: "a 'commentId' parmeter should be a string",
    },
  );
  return {
    owner,
    repo,
    num: parseInt(numStr, 10),
    ...(commentIdStr ? { commentId: parseInt(commentIdStr, 10) } : {}),
  };
}
