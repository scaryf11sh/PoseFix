import { w as writable } from "./index.js";
function getInitialMode() {
  return "system";
}
function createThemeStore() {
  const initial = getInitialMode();
  const { subscribe, set } = writable(initial);
  function apply(mode) {
    set(mode);
  }
  return { subscribe, set: apply };
}
const theme = createThemeStore();
export {
  theme as t
};
