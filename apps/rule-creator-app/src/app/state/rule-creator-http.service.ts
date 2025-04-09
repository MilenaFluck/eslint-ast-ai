import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuleCreatorHttpService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, apiKey: string): Observable<{ success: boolean, message: { rule: string; ruleTest: string; } }> {
    return this.http.post<{ success: boolean, message: { rule: string; ruleTest: string; } }>(`${this.apiUrl}/gpt`, { message, apiKey }).pipe();
  }

  runTest(codeToTest: string, testCode: string): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/run-test`, { codeToTest, testCode }).pipe();
  }
}
