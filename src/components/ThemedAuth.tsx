"use client";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import type { ComponentType } from "react";

type ThemedAuthProps = {
  component: ComponentType<Record<string, unknown>>;
} & Record<string, unknown>;

export function ThemedAuth({
  component: Component,
  ...props
}: ThemedAuthProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Component {...props} appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }} />
  );
}
