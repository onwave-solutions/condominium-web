import React, { useEffect, useState } from "react";
import Tree from "../../atoms/tree";
import { Building } from "../../../shared-ui/models/building";
import { BuildingService } from "../../../shared-ui/services/building";
import { AntTreeNode } from "antd/lib/tree/Tree";
import { ApartmentService } from "../../../shared-ui/services/apartment";
import { Apartment } from "../../../shared-ui/models/apartment";

export interface IBuildingTree {
  condominiumId: number;
  setSelectedKeys: (keys: string[]) => void;
}

const { TreeNode } = Tree;

const buildingService = new BuildingService();
const apartmentService = new ApartmentService();

export default function BuildingTree(props: IBuildingTree) {
  const { condominiumId, setSelectedKeys } = props;
  const [buildings, setBuildings] = useState<Building[]>([]);

  const loadData = async (data: AntTreeNode): Promise<void> => {
    const {
      props: { dataRef }
    } = data;
    try {
      const building: Building = dataRef;
      const data = await apartmentService.query({ buildingId: building.id });
      building.apartments = data;
      setBuildings([...buildings]);
    } catch (e) {}
  };

  useEffect(() => {
    buildingService.query({ condominiumId }).then(setBuildings);
  }, [condominiumId]);

  return (
    <Tree
      checkable
      loadData={loadData}
      onCheck={keys => setSelectedKeys(keys as string[])}
    >
      {buildings.map(renderBuildingTree({ isLeaf: false }))}
    </Tree>
  );
}

function renderApartmentTree(apartment: Apartment) {
  return (
    <TreeNode
      isLeaf={true}
      title={apartment.name}
      key={`${apartment.buildingId}-${apartment.id}`}
    />
  );
}

function renderBuildingTree({ isLeaf }: { isLeaf: boolean }) {
  return (building: Building) => {
    const apartments = Array.isArray(building.apartments)
      ? building.apartments
      : [];
    return (
      <TreeNode
        title={building.name}
        isLeaf={isLeaf}
        key={`${building.id}`}
        dataRef={building}
      >
        {apartments.map(renderApartmentTree)}
      </TreeNode>
    );
  };
}
