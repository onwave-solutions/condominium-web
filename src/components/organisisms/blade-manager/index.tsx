import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
import { Route, Switch } from "react-router-dom";

import BladeWrapper from "../../molecules/blade-wrapper";
import { IModule } from "../../../shared-ui/models/module";

export interface IBladeManager {
  url: string;
  modules: IModule[];
}

//const blades: any = {};

function renderBlade(props: IBladeManager) {
  return (blade: IModule): any => {
    let Blade: any;

    if (blade.children && blade.children.length) {
      return blade.children.map(renderBlade(props));
    }

    Blade = lazy(() => import(`../../../modules/${blade.route}`));
    const component = (props: any) => (
      <Suspense fallback={<Spin />}>
        <Blade {...blade} {...props} />
      </Suspense>
    );

    return (
      <Route
        key={blade.id}
        path={`${props.url}${blade.id}`}
        component={component}
      />
    );
  };
}

export default function BladeManager(props: IBladeManager) {
  return (
    <BladeWrapper>
      <Switch>{props.modules.map(renderBlade(props))}</Switch>
    </BladeWrapper>
  );
}
