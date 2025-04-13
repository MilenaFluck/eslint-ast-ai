export interface LintResultModel {
  message: string;
  line: number;
  column: number;
  endColumn: number;
  nodeType: string;
  severity: number,
}
