import { atom } from "jotai";

export const showAddModalAtom = atom(false);

export const showBackupModalAtom = atom(false);

export interface Cookie {
  name: string;
  code: string;
  hash: string;
  id: string;
  master: string;
}
