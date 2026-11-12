"use client";
import { useEffect, useState } from "react";

export function MembersTable({ members }) {
  console.log("[client] MembersTable render");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    console.log("[client] MembersTable mounted");
    return () => console.log("[client] MembersTable unmounted");
  }, []);
  return (
    <table>
      <tbody>
        {members.map((member) => (
          <tr key={member.id} className={selected === member.id ? "selected" : undefined} onClick={() => setSelected(member.id)}>
            <td>{member.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
