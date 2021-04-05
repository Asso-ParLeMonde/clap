/* eslint-disable */
import type { Project } from "types/models/project.type";
import type { Question } from "types/models/question.type";

/*
  Returns the user's questions list with their plans.
  Each question is added a plan list if it has not yet and a planStartIndex to know the plan number.
 */
export function getQuestions(project: Project): Question[] {
  return (project.questions || []).reduce((list: Question[], current: Question, index: number) => {
    let newCurrent: Question;
    if (index > 0) {
      const prev = list[index - 1];
      newCurrent = {
        ...current,
        planStartIndex: prev.planStartIndex + ((prev.plans || []).length || 1),
      };
    } else {
      newCurrent = { ...current, planStartIndex: 1 };
    }
    if (newCurrent.plans === undefined || newCurrent.plans === null || newCurrent.plans.length === 0) {
      newCurrent.plans = [];
    }
    list.push(newCurrent);
    return list;
  }, []);
}

export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';
export const ssoHost = process.env.NEXT_PUBLIC_PLM_HOST || '';
export const ssoHostName = ssoHost.replace(/(^\w+:|^)\/\//, '');

/**
 * Returns a random token. Browser only!
 * @param length length of the returned token.
 */
export function generateTemporaryToken(length: number = 40): string {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const cryptoObj = !process.browser
    ? null
    : window.crypto || 'msCrypto' in window
    ? (window as Window & typeof globalThis & { msCrypto: Crypto }).msCrypto
    : null; // for IE 11
  if (!cryptoObj) {
    return Array(length)
      .fill(validChars)
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
  }
  let array = new Uint8Array(length);
  cryptoObj.getRandomValues(array);
  array = array.map((x) => validChars.charCodeAt(x % validChars.length));
  const randomState = String.fromCharCode.apply(null, array);
  return randomState;
}

export function getQueryString(q: string | string[]): string {
  if (Array.isArray(q)) {
    return q[0];
  }
  return q;
}

// @ts-ignore
export function serializeToQueryUrl(obj: { [key: string]: any }) {
  if (Object.keys(obj).length === 0) {
    return "";
  }
  let str =
    "?" +
    Object.keys(obj)
      .reduce(function (a, k) {
        a.push(k + "=" + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join("&");
  return str;
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce<T extends (args: any) => any>(func: T, wait: number, immediate: boolean): T {
  let timeout: NodeJS.Timeout;
  return (function () {
    // @ts-ignore
    const context: any = this,
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
