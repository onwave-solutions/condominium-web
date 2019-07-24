import { ITransformer, ITransformerParams } from "@rijudev/parseus";
export class BooleanTransformer implements ITransformer {
  from({ key, data }: ITransformerParams) {
    const value = data[key];

    return Boolean(value);
  }

  to({ key, data }: ITransformerParams) {
    const value = data[key];

    if (typeof value === "boolean") return value;

    return false;
  }
}
