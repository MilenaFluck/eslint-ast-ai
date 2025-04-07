import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RuleCreatorHttpService {
  private apiUrl = '/openai/v1/chat/completions';
  private apiKey = '';

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
