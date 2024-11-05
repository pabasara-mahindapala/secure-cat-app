// app/routes/auth.asgardeo.tsx
import { redirect, type ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/asgardeo.server";

export let loader = () => redirect("/login");

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request);
};