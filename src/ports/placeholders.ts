import type { DescribeClient } from "./types";

// Stand-in until the describe Worker arrives in ticket 06: every Reading uses its Fallback Description.

export const fallbackDescribeClient: DescribeClient = {
  describe: async () => ({ kind: "fallback" }),
};
