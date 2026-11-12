import { listMembers } from "../../lib/backend";
import { InviteForm } from "./invite-form";
import { MembersTable } from "./members-table";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  console.log("[server] PeoplePage render");
  const members = await listMembers();
  return (
    <>
      <h1>Users</h1>
      <MembersTable members={members.items} />
      <InviteForm />
    </>
  );
}
