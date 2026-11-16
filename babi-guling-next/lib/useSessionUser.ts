import { useSyncExternalStore } from "react";

export type SessionUser = {
  id?: number;
  name: string | null;
  email: string;
  role: string;
};

function subscribe() {
  return () => {};
}

// Mengambil data user yang sedang login dari sessionStorage
export function useSessionUser(): SessionUser | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}