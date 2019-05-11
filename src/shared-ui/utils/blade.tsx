import { v4 } from "uuid";
import { values } from "lodash";

import { IBlade, BladeSize } from "../models/blade";
import { Normalize } from "./objects";

const defaultBlade: Readonly<IBlade> = {
  id: v4(),
  blade: "",
  title: "Blade",
  route: "",
  window: { size: "normal" }
};

export function createBlade(blade: Partial<IBlade>): IBlade {
  return {
    ...defaultBlade,
    ...blade
  };
}

export function scrollIntoBlade(id: string) {
  setTimeout(() => {
    const bladeWrapper = document.getElementsByClassName(
      "blade-scroll-container"
    );
    if (!bladeWrapper.length) {
      return;
    }
    const wrapper = bladeWrapper.item(0);
    const blade = document.getElementById(id);
    if (!blade) return;
    const offset = blade.offsetLeft;
    wrapper!.scroll({ behavior: "smooth", left: offset });
  }, 300);
}

export function isFullSize(size: BladeSize): boolean {
  return size === "full";
}

export function sortByParentId(blades: Normalize<IBlade>): IBlade[] {
  const bladeList = values(blades);
  return bladeList.reduce((acc: IBlade[], blade: IBlade) => {
    if (blade.parent && bladeList.some(x => x.id === blade.parent)) return acc;
    return [...acc, blade, ...bladeList.filter(x => x.parent === blade.id)];
  }, []);
}
