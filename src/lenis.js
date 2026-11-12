// نگه‌داشتن یک نمونه‌ی مشترک از Lenis تا بقیه‌ی کامپوننت‌ها (مثلاً منو) بتوانند به آن اسکرول بدهند.
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};
export const getLenis = () => instance;
