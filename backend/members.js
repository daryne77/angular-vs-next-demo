import { readFile, writeFile } from "node:fs/promises";

const seed = [
  { id: "m_1", email: "ana@example.com" },
  { id: "m_2", email: "bogdan@example.com" },
  { id: "m_3", email: "carmen@example.com" },
];

// Both servers set this to the same file, so an invitation made in one app shows up in the other.
function dataFile() {
  const file = process.env.DEMO_DATA_FILE;
  if (!file) throw new Error("DEMO_DATA_FILE is not set");
  return file;
}

async function load() {
  try {
    return JSON.parse(await readFile(dataFile(), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [...seed];
    throw error;
  }
}

export async function listMembers() {
  console.log("[backend] listMembers");
  return { items: await load() };
}

export async function inviteMember(email) {
  console.log("[backend] inviteMember", email);
  const value = String(email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw new Error("Enter a valid email address");
  const members = await load();
  if (members.some((member) => member.email === value)) throw new Error("This person is already a member");
  const member = { id: `m_${members.length + 1}`, email: value };
  await writeFile(dataFile(), JSON.stringify([...members, member], null, 2));
  return member;
}
