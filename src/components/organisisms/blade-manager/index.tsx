import React, { Suspense, lazy } from "react";
import { Spin, Icon } from "antd";
import { Route, Switch } from "react-router-dom";

import BladeWrapper from "../../molecules/blade-wrapper";
import { IModule } from "../../../shared-ui/models/module";

export interface IBladeManager {
  url: string;
  isTenant?: boolean;
  modules: IModule[];
}

function renderBlade(props: IBladeManager & { fromParent?: boolean }) {
  return (blade: IModule): any => {
    let Blade: any;

    const fromParent = blade.id.includes(":");

    if (blade.children && blade.children.length) {
      return blade.children.map(renderBlade({ ...props }));
    }

    Blade = lazy(() => import(`../../../modules/${blade.route}`));
    const component = (newProps: any) => {
      return (
        <Suspense fallback={<Spin />}>
          <>
            {fromParent && (
              <Icon
                type="arrow-left"
                style={{
                  textAlign: "left",
                  marginLeft: 15,
                  marginTop: 15,
                  fontSize: 20
                }}
                onClick={() => newProps.history.goBack()}
              />
            )}
            <Blade
              {...blade}
              {...newProps}
              isTenant={props.isTenant}
              fromParent={fromParent}
            />
          </>
        </Suspense>
      );
    };

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
