import React, { Suspense, lazy } from "react";

import BladeWrapper from "../../molecules/blade-wrapper";
import BladeHeader from "../../molecules/blade-header";
import { IBlade } from "../../../shared-ui/models/blade";

export interface IBladeManager {
  blades: IBlade[];
  onBladeClose?(id: string): void;
}

function renderBlade(props: IBladeManager) {
  const { onBladeClose } = props;
  return (blade: IBlade) => {
    const Blade = lazy(() => import(`../../../modules/${blade.route}`));
    return (
      <BladeWrapper
        key={blade.id!}
        id={blade.id!}
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
