import { atom } from "jotai";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";

export const previewsAtom = atom<IImageInfo[]>([]);

export const previewIndexAtom = atom(0);
