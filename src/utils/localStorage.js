export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const saveLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};
