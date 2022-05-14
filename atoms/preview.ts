import { atom } from "jotai";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

export const previewsAtom = atom<IImageInfo[]>([]);

export const previewUrlAtom = atom("");

export const previewIndexAtom = atom<number>(
  (get) => get(previewsAtom)?.findIndex((preview) => preview?.url === get(previewUrlAtom)) || 0
);
