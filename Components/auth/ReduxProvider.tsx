"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
