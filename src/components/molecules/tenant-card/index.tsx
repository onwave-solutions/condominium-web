import React from "react";
import { Avatar } from "antd";
import { ContactCardWrapper } from "./style";
import { KeyOf } from "../../../shared-ui/utils/objects";
import { User } from "../../../shared-ui/models/user";

export interface ITenantCard {
  tenant: User;
  children?: React.ReactChild;
  otherAttributes?: {
    title: string;
    value: KeyOf<User> | ((tenant: User) => string | number | undefined);
  }[];
}

export default function TenantCard({
  tenant = {},
  otherAttributes = [],
  children
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
        <div className="isoPersonImage">
          <Avatar shape="square" size={100} icon="user" />
        </div>
        <h1 className="isoPersonName">{name}</h1>
      </div>
      <div className="isoContactInfoWrapper">
        {extraInfos}

        {children}
      </div>
    </ContactCardWrapper>
  );
}
