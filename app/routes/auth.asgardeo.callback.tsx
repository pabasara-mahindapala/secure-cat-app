// app/routes/auth.asgardeo.callback.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/asgardeo.server";

export let loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};