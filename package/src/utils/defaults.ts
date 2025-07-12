import { getHash } from "./hash";

export const DEFAULTS = {
  REVALIDATE: 7,
  tags: (url: string) => [getHash(url)],
};
