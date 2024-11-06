import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteCat } from "../data";
import { authenticator } from "~/utils/asgardeo.server";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.catId, "Missing catId param");
  await deleteCat(params.catId);
  return redirect("/");
};

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request);
  let isLoggedIn = !!user;

  if (!isLoggedIn) {
    return redirect("/login");
  }

  return null;
};
