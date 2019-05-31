import moment from "moment";
import {
  ITransformer,
  ITransformerParams
} from "@rijudev/parseus/dist/lib/src/decorators/options/transformer";
import { KeyOf } from "./objects";

export function getDateWithoutOffset(
  date?: Date | string
): moment.Moment | undefined {
  if (!date) return;
  const momentdate = moment(date);
  const offset = momentdate.toDate().getTimezoneOffset();
  return moment(date).add(-offset, "minutes");
}

export function toSimpleDateFormat(date?: Date | string) {
  if (!date) return;
  return getDateWithoutOffset(date)!.format("DD/MM/YYYY");
}

export function toCompleteDateFormat(date?: Date | string) {
  if (!date) return;
  return getDateWithoutOffset(date)!.format("DD/MM/YYYY hh:mm:ssa");
}

export class DateTimeTransformer implements ITransformer {
  constructor(private format: string = "DD/MM/YYYY hh:mm:ss a") {}

  from({ key, data }: ITransformerParams) {
    return data[key] ? moment(data[key]).format(this.format) : null;
  }

  to({ key, data }: ITransformerParams) {
    return data[key] ? moment(data[key], this.format).toISOString() : null;
  }
}

export class DateTransformer implements ITransformer {
  constructor(private format: string = "DD/MM/YYYY") {}

  from({ key, data }: ITransformerParams) {
    return data[key]
      ? moment(data[key], "YYYY-MM-DD").format(this.format)
      : null;
  }

  to({ key, data }: ITransformerParams) {
    return data[key]
      ? moment(data[key], this.format).format("YYYY-MM-DD")
      : null;
  }
}
