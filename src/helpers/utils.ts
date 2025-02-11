export const debounce = (fn: (...args: any) => void, ms = 1000) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};
export const saveToLocalStorage = (key: string, value: string) => localStorage.setItem(key, JSON.stringify(value));
export const getFromLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) || '');
export const saveToLocalStorageWithDebounce = debounce(saveToLocalStorage, 500);
