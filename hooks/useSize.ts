import { useAtom } from "jotai";

import { useEffect, useState } from "react";

import { sizeAtom } from "../atoms";
import Layout from "../constants/Layout";

type Size = "small" | "normal" | "medium" | "large" | "extraLarge";

export default function useSize() {
  const [size] = useAtom<Size>(sizeAtom);
  const [sizePixel, setSizePixel] = useState(14);
  useEffect(() => {
    setSizePixel(Layout.size[size]);
  }, [size]);
  return sizePixel;
}
