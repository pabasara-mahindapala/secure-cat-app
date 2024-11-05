import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import appStylesHref from "./app.css?url";
import { createEmptyCat, getCats } from "./data";
import { useEffect } from "react";

export const action = async () => {
  const cat = await createEmptyCat();
  return redirect(`/cats/${cat.id}/edit`);
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const cats = await getCats(q);
  return json({ cats, q });
};

export default function App() {
  const { cats, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Cats</h1>
          <div>
            <Form id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search">
              <input
                id="q"
                aria-label="Search cats"
                className={searching ? "loading" : ""}
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div
                aria-hidden
                hidden={!searching}
                id="search-spinner"
              />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {cats.length ? (
              <ul>
                {cats.map((cat) => (
                  <li key={cat.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`cats/${cat.id}`}
                    >
                      <Link to={`cats/${cat.id}`}>
                        {cat.first || cat.last ? (
                          <>
                            {cat.first} {cat.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {cat.favorite ? (
                          <span>★</span>
                        ) : null}
                      </Link>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No cats</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching
              ? "loading"
              : ""
          }
          id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
