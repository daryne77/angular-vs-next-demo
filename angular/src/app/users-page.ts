import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Member, MembersService } from './members.service';

@Component({
  selector: 'app-users-page',
  template: `
    <h1>Users</h1>
    @if (loading()) {
      <p>Loading…</p>
    }
    <table>
      @for (member of members(); track member.id) {
        <tr [class.selected]="selected() === member.id" (click)="selected.set(member.id)">
          <td>{{ member.email }}</td>
        </tr>
      }
    </table>
    <form (submit)="invite($event)">
      <input name="email" placeholder="email" />
      <button [disabled]="saving()">{{ saving() ? 'Inviting…' : 'Invite' }}</button>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </form>
  `,
})
export class UsersPage implements OnDestroy {
  private readonly service = inject(MembersService);
  protected readonly members = signal<Member[]>([]);
  protected readonly selected = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    console.log('[browser] UsersPage created');
    this.load();
  }

  ngOnDestroy() {
    console.log('[browser] UsersPage destroyed');
  }

  private load() {
    this.service.list().subscribe((response) => {
      this.members.set(response.items);
      this.loading.set(false);
    });
  }

  protected invite(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = String(new FormData(form).get('email') ?? '');
    this.saving.set(true);
    this.error.set(null);
    this.service.invite(email).subscribe({
      next: () => {
        form.reset();
        this.saving.set(false);
        this.load();
      },
      error: (response) => {
        this.error.set(response.error?.error ?? 'The invitation failed');
        this.saving.set(false);
      },
    });
  }
}
