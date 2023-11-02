"use client";
import React from "react";
import { EdgeStoreProvider as Provider } from "@/lib/edgestore";

type Props = {
  children: React.ReactNode;
};

function EdgeStoreProvider({ children }: Props) {
  return <Provider>{children}</Provider>;
}

export default EdgeStoreProvider;
