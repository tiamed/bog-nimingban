import { useAtom } from "jotai";
import { createContext } from "react";

import { loadingsAtom } from "@/atoms";
import Loadings from "@/constants/Loadings";

export const LoadingsContext = createContext(Loadings);

export default function AssetsProvider(props: any) {
  const [loadings] = useAtom(loadingsAtom);

  return <LoadingsContext.Provider value={loadings}>{props.children}</LoadingsContext.Provider>;
}
