export function getQueryString(q: string | string[]): string {
  if (Array.isArray(q)) {
    return q[0];
  }
  return q;
}
