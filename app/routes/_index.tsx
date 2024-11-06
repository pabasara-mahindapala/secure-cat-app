import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/asgardeo.server";

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

export default function Index() {
  return (
    <p id="index-page">
      This is a demo for Remix.
      <br />
      Check out{" "}
      <a href="https://remix.run">the docs at remix.run</a>.
    </p>
  );
}
