import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LintResultModel } from './model';

@Injectable({ providedIn: 'root' })
export class RuleCreatorHttpService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, apiKey: string): Observable<{ success: boolean, message: { ruleEsModules: string; ruleCommonJs: string; badExampleCode: string; } }> {
    return this.http.post<{ success: boolean, message: { ruleEsModules: string; ruleCommonJs: string; badExampleCode: string; } }>(`${this.apiUrl}/gpt`, { message, apiKey }).pipe();
  }

  lint(rule: string, badExampleCode: string): Observable<LintResultModel[]> {
    return this.http.post<LintResultModel[]>(`${this.apiUrl}/lint`, { rule, badExampleCode }).pipe();
  }
}
