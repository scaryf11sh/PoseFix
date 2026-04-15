import { w as writable } from "./index.js";
function createToastStore() {
  const { subscribe, update } = writable([]);
  function add(type, message, duration = 4e3) {
    const id = crypto.randomUUID();
    update((toasts) => [...toasts, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }
  function remove(id) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }
  return {
    subscribe,
    success: (msg, duration) => add("success", msg, duration),
    error: (msg, duration) => add("error", msg, duration),
    warning: (msg, duration) => add("warning", msg, duration),
    info: (msg, duration) => add("info", msg, duration),
    remove
  };
}
const toast = createToastStore();
export {
  toast as t
};
