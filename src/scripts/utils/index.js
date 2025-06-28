export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallBack = Promise.resolve(updateDOM()).then(() => undefined);

    return {
      ready: Promise.reject(Error("Transition not supported")),
      updateCallbackDone: updateCallBack,
      finished: updateCallBack,
    };
  }
  return document.startViewTransition(updateDOM);
}
