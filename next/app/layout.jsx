import Link from "next/link";
import "./globals.css";

export const metadata = { title: "Next demo" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/users">Users</Link>
          <Link href="/roles">Roles</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
