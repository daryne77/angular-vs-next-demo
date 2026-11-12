"use client";
import { useActionState } from "react";
import { invitePerson } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState(invitePerson, {});
  return (
    <form action={formAction}>
      <input name="email" placeholder="email" />
      <button disabled={pending}>{pending ? "Inviting…" : "Invite"}</button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
