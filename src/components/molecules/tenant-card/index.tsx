import React from "react";
import { ContactCardWrapper } from "./style";
import { KeyOf } from "../../../shared-ui/utils/objects";
import { User } from "../../../shared-ui/models/user";

export interface ITenantCard {
  tenant: User;
  otherAttributes?: {
    title: string;
    value: KeyOf<User> | ((tenant: User) => string);
  }[];
}

export default function TenantCard({
  tenant = {},
  otherAttributes = []
}: ITenantCard) {
  const name = tenant.name ? tenant.name + " " + tenant.lastName : "Sin Nombre";
  const extraInfos: any[] = [];
  otherAttributes.forEach(attribute => {
    const value =
      typeof attribute.value === "function"
        ? attribute.value(tenant)
        : tenant[attribute.value];
    if (value) {
      extraInfos.push(
        <div
          className="isoContactCardInfos"
          key={
            typeof attribute.value === "function"
              ? (value as any)
              : (attribute.value as any)
          }
        >
          <p className="isoInfoLabel">{`${attribute.title}`}</p>
          <p className="isoInfoDetails">{value}</p>
        </div>
      );
    }
  });
  return (
    <ContactCardWrapper className="isoContactCard">
      <div className="isoContactCardHead">
        <div className="isoPersonImage">{/*<img alt="#" />*/}</div>
        <h1 className="isoPersonName">{name}</h1>
      </div>
      <div className="isoContactInfoWrapper">{extraInfos}</div>
    </ContactCardWrapper>
  );
}
