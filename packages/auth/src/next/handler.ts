import type { NextRequest } from "next/server";

import { confirm } from "./methods/confirm";
import { oauthConfirm } from "./methods/oauthConfirm";
import { recovery } from "./methods/recovery";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string }> },
) {
  const { auth } = await params;
  switch (auth) {
    case "recovery":
      return recovery(request);
    case "oauth-confirm":
      return oauthConfirm(request);
    case "confirm":
      return confirm(request);
    default:
      return new Response("Not Found", { status: 404 });
  }
}
