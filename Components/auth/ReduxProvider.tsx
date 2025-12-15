"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/store/slices/userSlice";

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
