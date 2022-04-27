import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { postFilteredAtom, postFilteredRecordsAtom, shouldMemorizePostFilteredAtom } from "@/atoms";

export default function usePostFiltered(id: number) {
  const [currentId, setCurrentId] = useState(0);
  const [result, setResult] = useState(false);
  const [shouldMemorizePostFiltered] = useAtom(shouldMemorizePostFilteredAtom);
  const [postFilteredRecords, setPostFilteredRecords] = useAtom<number[], number[], void>(
    postFilteredRecordsAtom
  );
  const [postFiltered, setPostFiltered] = useAtom(postFilteredAtom);

  const toggle = () => {
    if (shouldMemorizePostFiltered) {
      if (result) {
        setPostFilteredRecords(postFilteredRecords.filter((x) => x !== currentId));
      } else {
        setPostFilteredRecords([...postFilteredRecords, currentId]);
      }
    } else {
      setPostFiltered(!postFiltered);
    }
  };

  useEffect(() => {
    setCurrentId(id);
  }, [id]);

  useEffect(() => {
    if (shouldMemorizePostFiltered) {
      setResult(postFilteredRecords.includes(currentId));
    } else {
      setResult(postFiltered);
    }
  }, [shouldMemorizePostFiltered, postFilteredRecords, currentId, postFiltered]);

  return { result, toggle, setCurrentId };
}
