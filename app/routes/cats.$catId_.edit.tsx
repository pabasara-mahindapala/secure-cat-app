import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getCat, updateCat } from "../data";

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.catId, "Missing catId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateCat(params.catId, updates);
  return redirect(`/cats/${params.catId}`);
};

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.catId, "Missing catId param");
  const cat = await getCat(params.catId);
  if (!cat) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ cat });
};

export default function EditCat() {
  const { cat } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={cat.id} id="cat-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={cat.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={cat.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={cat.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={cat.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={cat.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
