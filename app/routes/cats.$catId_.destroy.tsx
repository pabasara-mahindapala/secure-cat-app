import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteCat } from "../data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.catId, "Missing catId param");
  await deleteCat(params.catId);
  return redirect("/");
};
