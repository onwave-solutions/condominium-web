import { Field } from "@rijudev/parseus/dist/lib/src/decorators/fields/field";
export class KeylistType {
  @Field()
  public type?: string;

  @Field()
  public name?: string;

  @Field()
  public disabled?: boolean;
}

export class Keylist {
  @Field({ type: "array", factory: KeylistType })
  documentTypes?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  userStatus?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  roles?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  communicationTypes?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  banks?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  paymentMethods?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  paymentStatus?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  transactionStatus?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  invoiceStatus?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  ticketStatus?: KeylistType[];

  @Field({ type: "array", factory: KeylistType })
  serviceTypes?: KeylistType[];
}

export interface IQuery {
  query?: string;
  state?: string;
}

export type Query<T> = {
  like?: T;
  equals?: T;
  startWith?: T;
  endWith?: T;
  between?: {
    start: T;
    end: T;
  };
  not?: T;
  isNull?: boolean;
  in?: T[];
};

export type AdvanceQuery<T> = { [P in keyof T]?: Query<T[P]> | T[P] | T[P][] };
