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
