export namespace RuleCreatorStateUtil {
  export function exportToJsFile(jsString: string, filename: string) {
    const blob = new Blob([jsString], { type: 'application/javascript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.js`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
