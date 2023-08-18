import { useEffect, useState } from "react";

import { getReleases } from "@/api";

export default function useReleases() {
  const [releases, setReleases] = useState<any>([]);
  useEffect(() => {
    getReleases().then(({ data }) => {
      setReleases(data);
    });
  }, []);
  return releases;
}
