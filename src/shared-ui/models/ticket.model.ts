import { Field } from "@rijudev/parseus/dist/lib/src/decorators/fields/field";
import { KeylistType } from "./keylist";
import { User } from "./user";

export class TicketComment {
  @Field()
  public ticketId?: number;

  @Field()
  public comment?: string;

  @Field()
  public id?: number;

  @Field()
  public createdAt?: string;

  @Field()
  public updatedAt?: string;

  @Field()
  public createdBy?: number;

  @Field()
  public updatedBy?: number;

  @Field({ type: "object", factory: User })
  public userCreatedBy?: User;
}

export class Ticket {
  @Field()
  public condominiumId?: number;

  @Field()
  public description?: string;

  @Field()
  public title?: string;

  @Field()
  public solution?: string;

  @Field()
  public statusType?: string;

  @Field()
  public id?: number;

  @Field()
  public createdAt?: string;

  @Field()
  public updatedAt?: string;

  @Field()
  public createdBy?: number;

  @Field()
  public updatedBy?: number;

  @Field({ type: "object", factory: User })
  public userCreatedBy?: User;

  @Field({ type: "object", factory: KeylistType })
  public status?: KeylistType;
  @Field({ type: "array", factory: TicketComment })
  public comments?: TicketComment[];
}
