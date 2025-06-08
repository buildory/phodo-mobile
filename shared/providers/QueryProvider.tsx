import { QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { PropsWithChildren } from "react";
import { queryClient } from "@/shared/lib/tanstack";

export const QueryProvider = ({ children }: PropsWithChildren) => {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
