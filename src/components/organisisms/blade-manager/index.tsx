import React, { Suspense, lazy } from "react";

import BladeWrapper from "../../molecules/blade-wrapper";
import BladeHeader from "../../molecules/blade-header";
import { IModule } from "../../../shared-ui/models/module";

export interface IBladeManager {
  blades: IModule[];
  onBladeClose?(id: string): void;
}

function renderBlade(props: IBladeManager) {
  const { onBladeClose } = props;
  return (blade: IModule) => {
    const Blade = lazy(() => import(`../../../modules/${blade.route}`));
    return (
      <BladeWrapper
        key={blade.id!}
        id={blade.id!}
        size={blade.size}
        header={
          <BladeHeader
            title={blade.title}
            onClose={() => onBladeClose && onBladeClose(blade.id!)}
          />
        }
      >
        <Suspense fallback={() => <span>loading</span>}>
          <Blade {...blade} />
        </Suspense>
      </BladeWrapper>
    );
  };
}

export default function BladeManager(props: IBladeManager) {
  const { blades } = props;
  return <>{blades.map(renderBlade(props))}</>;
}
