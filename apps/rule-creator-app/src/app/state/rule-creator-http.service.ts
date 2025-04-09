import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RuleCreatorHttpService {
  private apiUrl = '/api/gpt'; // Update to match your backend API endpoint

  constructor(private http: HttpClient) {}

  sendMessage(message: string, apiKey: string) {
    const body = {
      message, // The user message
      apiKey
    };

    // Send the request to your backend endpoint
    return this.http.post(this.apiUrl, body);
  }
}
