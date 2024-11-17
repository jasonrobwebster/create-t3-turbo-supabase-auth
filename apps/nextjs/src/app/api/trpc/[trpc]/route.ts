import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api";
import { supabaseAuth } from "@acme/auth";

export const runtime = "edge";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (req: Request, res: Response) => {
  const allowedOrigins = ["http://localhost:3000"];

  const origin = req.headers.get("Origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Request-Method", "*");
    res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, x-trpc-source, trpc-batch-mode",
    );
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }
};

export const OPTIONS = (req: Request) => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(req, response);
  return response;
};

const handler = supabaseAuth(async (req) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        user: req.user,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(req, response);
  return response;
});

export { handler as GET, handler as POST };
