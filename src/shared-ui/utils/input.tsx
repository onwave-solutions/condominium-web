import { ChangeEvent } from "react";
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";

export type InputChangeValue = (name: string, value: any) => void;

export type ChangeHandlerType = <T>(value: T) => void;

export function onInputChange(func: InputChangeValue) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    func && func(target.name, target.value);
  };
}

export function changeHandler<T>(obj: T, onChange: ChangeHandlerType) {
  return (event: any) => {
    const { name, value } = event.target;
    onChange({ ...obj, [name]: value });
  };
}

export function stringToInt(value: string, defValue: number = 0) {
  if (!value) {
    return 0;
  } else if (!isNaN(value as any)) {
    return parseInt(value, 10);
  }
  return defValue;
}

export function stringToDecimal(value: string, defValue: number = 0) {
  if (!value) {
    return 0;
  } else if (!isNaN(value as any)) {
    return parseFloat(value);
  }
  return defValue;
}

export function stringToPosetiveInt(value: string, defValue: number = 0) {
  const val = stringToInt(value, defValue);
  return val > -1 ? val : defValue;
}

export function stringToPositiveDecimal(value: string, defValue: number = 0) {
  const val = stringToDecimal(value, defValue);
  return val > -1 ? val : defValue;
}

export const identificationFormat = (type: string = "CE") => {
  return (str: string = "") => {
    const value = str.substr(0, 13);
    if (type === "CE") return idFormat(value);
    return value;
  };
};

export const phoneFormat = (str: string = "") => {
  if (str[0] === "1") return str.substr(1);

  const digits = parsePhoneNumberFromString(str);

  if (digits && digits!.isValid()) return str;
  const values = str.replace(/\D/g, "").substr(0, 10);

  return new AsYouType("US").input(values);
};

export const rncFormat = (str: string = "") => {
  const digits = str.replace(/\D/g, "").substr(0, 9);
  if (digits.length !== 9) {
    return digits;
  }

  return str.replace(/^(\d{3})(\d{2})(\d{4})$/g, "$1-$2-$3");
};

export const isValidDocument = (type: string = "CE") => (str: string = "") =>
  type === "CE" ? isValidId(str) : str.length >= 6 && str.length < 11;

export const isValidId = (str: string = "") =>
  str.replace(/\D/g, "").length === 11;

export const idFormat = (str: string = "") => {
  const digits = str.replace(/\D/g, "").substr(0, 11);
  if (digits.length !== 11) {
    return digits;
  }

  return str.replace(/^(\d{3})(\d{7})(\d{1})$/g, "$1-$2-$3");
};
