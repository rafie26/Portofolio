"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={action} className="rafi-login__form">
      <label className="rafi-login__label" htmlFor="password">
        password
      </label>
      <input
        className="rafi-login__input"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
      />
      {state.error ? <p className="rafi-login__error">{state.error}</p> : null}
      <button className="rafi-login__btn" type="submit" disabled={pending}>
        {pending ? "memeriksa…" : "masuk"}
      </button>
    </form>
  );
}
