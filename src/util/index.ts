export function getQueryString(q: string | string[]): string {
  if (Array.isArray(q)) {
    return q[0];
  }
  return q;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce<T extends (args: any) => any>(func: T, wait: number, immediate: boolean): T {
  let timeout: NodeJS.Timeout;
  return (function () {
    // eslint-disable-next-line
    const context: any = this,
      // eslint-disable-next-line
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  } as unknown) as T;
}
