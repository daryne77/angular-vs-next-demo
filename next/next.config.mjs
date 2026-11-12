import path from "node:path";

process.env.DEMO_DATA_FILE ??= path.join(import.meta.dirname, "../backend/data.json");

export default {
  // The backend module lives outside this folder, like a shared backend package in a monorepo.
  turbopack: { root: path.join(import.meta.dirname, "..") },
};
