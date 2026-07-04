"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {
  message: "",
};

export default function LoginForm({ notice, next = "/admin" }: { notice?: string; next?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const message = state.message || notice;

  return (
    <form className="adminLoginForm" action={formAction}>
      <input type="hidden" name="next" value={next} />

      {message ? <p className="adminLoginMessage">{message}</p> : null}

      <button className="adminLoginButton" type="submit" disabled={isPending}>
        <LogIn size={18} />
        {isPending ? "Connecting..." : "Continue with Google"}
      </button>
    </form>
  );
}
