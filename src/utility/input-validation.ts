const rules: { [key: string]: RegExp[] } = {
  email: [
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  ],
  password: [/^[a-z0-9.]{8,24}$/],
  text: [/[a-zA-Z0-9]/],
};

export const isValueValid = (value: string, type: string): boolean => {
  if (!rules[type]) return true;
  for (const pattern of rules[type]) {
    if (!pattern.test(value)) return false;
  }
  return true;
};
