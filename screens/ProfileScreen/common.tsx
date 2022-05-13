import { atom } from "jotai";

export const showAddModalAtom = atom(false);

export const showCreateModalAtom = atom(false);

export interface Cookie {
  name: string;
  code: string;
  hash: string;
  id: string;
  master: string;
}
