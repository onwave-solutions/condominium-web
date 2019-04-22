import React, { useState, useEffect } from "react";

import Topbar from "../../organisisms/topbar";
import Sidebar from "../../organisisms/sidebar";
import ShellTemplate from "../../templates/shell-template";
import BladeManager from "../../organisisms/blade-manager";
import { IBlade } from "../../../shared-ui/models/blade";
import { IModule } from "../../../shared-ui/models/module";

import modules from "../../../modules/module";

export default function Shell() {
  const [blades, setBlades] = useState<IBlade[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const addBlade = (mod: IModule) => {
    if (blades.some(blade => mod.id === blade.id)) {
      return;
    }
    setBlades([
      ...blades,
      { blade: mod.id, id: mod.id, route: mod.route, title: mod.title }
    ]);
  };
  const collapse = () => {
    if (window.innerWidth > 800) {
      setCollapsed(false);
      return;
    }
    setCollapsed(true);
  };
  useEffect(() => {
    window.addEventListener("resize", collapse);
    collapse();
  }, []);
  return (
    <ShellTemplate
      topBar={<Topbar collapsed={collapsed} onCollapsedChange={setCollapsed} />}
      sideBar={
        <Sidebar
          modules={modules}
          onBladePress={addBlade}
          collapsed={collapsed}
        />
      }
    >
      <BladeManager
        blades={blades}
        onBladeClose={(id: string) =>
          setBlades(blades.filter(blade => blade.id !== id))
        }
      />
    </ShellTemplate>
  );
}
