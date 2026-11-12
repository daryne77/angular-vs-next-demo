"use server";
import { revalidatePath } from "next/cache";
import { inviteMember } from "../../lib/backend";

export async function invitePerson(previous, form) {
  console.log("[server] invitePerson");
  try {
    await inviteMember(form.get("email"));
  } catch (error) {
    return { error: error.message };
  }
  revalidatePath("/users");
  return {};
}
