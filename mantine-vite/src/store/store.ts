import { atom } from "nanostores";

type SelfUser = {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export const me = atom<SelfUser | null>(null);

export function addUser(user: SelfUser) {
  me.set(user);
}

export function removeUser() {
  me.set(null);
}
