import { Form } from "@remix-run/react";

// app/routes/login.tsx
export default function Login() {
    return (
      <Form action="/auth/asgardeo" method="post">
        <button>Login with Asgardeo</button>
      </Form>
    );
  }