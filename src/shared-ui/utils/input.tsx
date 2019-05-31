import { ChangeEvent } from "react";

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
