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

export function useSessionUser(): SessionUser | null {
  const data = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );

  return data ? JSON.parse(data) : null;
}
