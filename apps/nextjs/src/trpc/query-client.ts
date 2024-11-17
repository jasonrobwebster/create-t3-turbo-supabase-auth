import type { TRPCClientErrorLike } from "@trpc/client";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/api";

type Maybe<T> = T | null | undefined;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        retry(failureCount, _err) {
          const err = _err as never as Maybe<TRPCClientErrorLike<AppRouter>>;
          const code = err?.data?.code;
          if (
            code === "BAD_REQUEST" ||
            code === "FORBIDDEN" ||
            code === "UNAUTHORIZED"
          ) {
            // if input data is wrong or you're not authorized there's no point retrying a query
            return false;
          }
          const MAX_QUERY_RETRIES = 3;
          return failureCount < MAX_QUERY_RETRIES;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
