import { isEmpty, isEmptyArray, isNullOrUndefined } from "./helpers";

const capitalizedLabel = (value: string) => {
  value.replace(/[^a-zA-Z ]/g, "");
  value.charAt(0).toUpperCase();
  return value;
};

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return "This field is required";

  return !!String(value).trim().length || "This field is required";
};

// 👉 Required Validator
export const requiredIfValidator = (
  value: unknown,
  target: string,
  targetValue: string
) => {
  if (target == targetValue && String(value).trim().length == 0) {
    console.log(1);
    return `This field is required when ${capitalizedLabel(
      target
    )} is ${targetValue}`;
  } else {
    console.log(2);
  }
};

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (Array.isArray(value))
    return (
      value.every((val) => re.test(String(val))) ||
      "The Email field must be a valid email"
    );

  return re.test(String(value)) || "The Email field must be a valid email";
};

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;

  const validPassword = regExp.test(password);

  return (
    validPassword ||
    "Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars"
  );
};

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>
  value === target || "The Confirm Password field confirmation does not match";

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value);

  return (
    (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) ||
    `Enter number between ${min} and ${max}`
  );
};

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  if (Array.isArray(value))
    return (
      value.every((val) => /^-?[0-9]+$/.test(String(val))) ||
      "This field must be an integer"
    );

  return /^-?[0-9]+$/.test(String(value)) || "This field must be an integer";
};

// 👉 Decimal Validator /^[0-9]*(\.[0-9]{0,2})?$/
export const decimalValidator = (value: unknown, limit: number) => {
  let expression = "^-?[0-9]+(?:.[0-9]{1," + limit + "})?$";
  let regex = new RegExp(expression);
  if (isEmpty(value)) return true;

  if (Array.isArray(value))
    return (
      value.every((val) => regex.test(String(val))) ||
      "This field must be have " + limit + " decimal at most"
    );

  return (
    regex.test(String(value)) ||
    "This field must be have " + limit + " decimal at most"
  );
};

// 👉 Regex Validator
export const regexValidator = (
  value: unknown,
  regex: RegExp | string
): string | boolean => {
  if (isEmpty(value)) return true;

  let regeX = regex;
  if (typeof regeX === "string") regeX = new RegExp(regeX);

  if (Array.isArray(value))
    return value.every((val) => regexValidator(val, regeX));

  return regeX.test(String(value)) || "The Regex field format is invalid";
};

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  return (
    /^[A-Z]*$/i.test(String(value)) ||
    "The Alpha field may only contain alphabetic characters"
  );
};

// 👉 Alpha Validator
export const alphaNumericValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  return (
    /^[a-z\d\-_\s]+$/i.test(String(value)) ||
    "The Alpha field may only contain alpha numeric characters"
  );
};

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const re =
    /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  return re.test(String(value)) || "URL is invalid";
};

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length === length ||
    `The Min Character field must be at least ${length} characters`
  );
};

// 👉 Length Validator
export const maxAlphaValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true;
  return (
    String(value).length < length ||
    `The Max Character field must be at most ${length} characters`
  );
};

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || "All Character are not valid";
};
