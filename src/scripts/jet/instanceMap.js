export const JetInstanceMap = {
  set(key, value) {
    key.__jetInternalInstance = value;
  },

  get(key) {
    return key.__jetInternalInstance;
  },
};
