"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};
