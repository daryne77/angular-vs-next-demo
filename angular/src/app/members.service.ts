import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface Member {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class MembersService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3001/api/members';

  list() {
    return this.http.get<{ items: Member[] }>(this.url);
  }

  invite(email: string) {
    return this.http.post<Member>(this.url, { email });
  }
}
