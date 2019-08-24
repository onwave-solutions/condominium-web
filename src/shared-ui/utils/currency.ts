import { Condominium } from "../models/condominium";
import { KeyOf } from "./objects";

export const currencyFormat = ({ currencySymbol }: Condominium) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  return (amount: number) =>
    (currencySymbol || "") + formatter.format(amount || 0);
};

export function getSum<T>(arr: T[]) {
  return (key: KeyOf<T>): number => {
    return arr.reduce<number>(
      (acc, item) => acc + parseFloat(`${item[key] || 0}`),
      0
    );
  };
}
