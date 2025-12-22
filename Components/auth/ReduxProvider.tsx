"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { checkAuth } from "@/store/slices/userSlice";
import { AuthProvider } from "@/hooks/useAuth";

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔄 AuthInitializer: Mounting, dispatching checkAuth...");
    dispatch(checkAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <AuthProvider>{children}</AuthProvider>
      </AuthInitializer>
    </Provider>
  );
}
