import React from "react";

import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";

export interface IAdmin {}

export default function Admin(props: IAdmin) {
  return (
    <BladeTemplate>
      <UserForm />
    </BladeTemplate>
  );
}
