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
