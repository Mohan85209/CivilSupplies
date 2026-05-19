"use client";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      richColors
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-md border bg-background text-foreground shadow",
        },
      }}
      {...props}
    />
  );
}
