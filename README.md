# Angular vs Next demo

Two small apps with the same users screen: a list of members and a form that invites one more.

- `angular/` is an Angular 20 single-page app that calls a separate HTTP API.
- `next/` is a Next 16 app. It reads the list in a Server Component and saves with a Server Action.

Both apps use the same backend functions and the same data file, so a person invited in one app shows up in the other.

## Run it

You need Node 20.19 or later. Install the three projects once:

```bash
npm run setup
```

Build both apps and start the servers:

```bash
npm start
```

| URL | What runs there |
| --- | --- |
| http://localhost:4200/users | The Angular app, served as static files |
| http://localhost:3001/api/members | The API that the Angular app calls |
| http://localhost:3000/users | The Next app |

`npm run serve` starts the servers without building again. `npm run reset` deletes `backend/data.json`, so the list goes back to the three seed members.

The apps run as production builds, because `next dev` does not prefetch links.

## What to look for

Open DevTools on both apps and keep the Network tab and the Console visible. Keep an eye on the terminal too: the Next server prints its logs there.

1. **First visit.** Reload `/users` and select the first request. In Angular, the Response tab shows an empty `<app-root>`. In Next, the Preview tab already shows the rows. The same page also arrives as an RSC payload, in script tags at the end of the HTML.
2. **Link click.** In Next, go from Users to Roles. The request is `GET /roles?_rsc=…` with the header `RSC: 1`, and the response is the RSC payload of the new page, not HTML.
3. **Server Action.** In Next, invite an email. The request is `POST /users` with a `Next-Action` header. The response has `X-Action-Revalidated: 1`, and its body already contains the new list. Angular needs two requests for the same result: a `POST`, then a `GET` for the list.
4. **State.** Select a row first, then invite someone. The terminal shows the page rendering again on the server. In the browser, `MembersTable` renders with the new rows but does not mount again, so the selected row stays selected.
5. **Server code stays on the server.** In Next, search the files under DevTools, Sources, for `listMembers`. There is no match. In Angular, `main.js` contains the API URL instead.

The Next app logs each step. Lines that start with `[server]` and `[backend]` go to the terminal, and lines that start with `[client]` go to the browser console:

| Step | Terminal | Browser console |
| --- | --- | --- |
| Open `/users` | `PeoplePage render`, `listMembers`, `MembersTable render` | `MembersTable render`, `MembersTable mounted` |
| Click a row | nothing | `MembersTable render` |
| Invite a person | `invitePerson`, `inviteMember`, `PeoplePage render`, `listMembers` | `MembersTable render`. The selected row stays. |
| Link to Roles | `RolesPage render` | `MembersTable unmounted` |
| Link back to Users | `PeoplePage render`, `listMembers` | `MembersTable render`, `MembersTable mounted` |

On the first visit, `MembersTable` renders once on the server to build the HTML. After that it renders only in the browser.

In the Angular app, the browser console shows `UsersPage created` and `UsersPage destroyed`, and the terminal shows the API calls.

## Project layout

| Path | Role |
| --- | --- |
| `backend/members.js` | `listMembers` and `inviteMember`. They store the list in `backend/data.json`. |
| `api/server.js` | The HTTP API for Angular: `GET` and `POST /api/members`. |
| `angular/src/app/users-page.ts` | Loads the list with `MembersService`, which uses `HttpClient`. |
| `next/app/users/page.jsx` | `PeoplePage`, a Server Component that calls `listMembers` directly. |
| `next/app/users/members-table.jsx` | `MembersTable`, a Client Component with a selected row in its state. |
| `next/app/users/invite-form.jsx` | `InviteForm`, a Client Component that calls the Server Action. |
| `next/app/users/actions.js` | `invitePerson`, the Server Action. It calls `inviteMember` and `revalidatePath("/users")`. |
| `next/lib/backend.js` | Imports the backend with `server-only`, so a Client Component cannot import it. |
