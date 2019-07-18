import React, { useEffect, useState } from "react";

import Table, { Column } from "../../components/atoms/table";
import Scrollbar from "../../components/atoms/scrollbar";
import Button from "../../components/atoms/button";
import BladeTemplate from "../../components/templates/blade-template";

import { Wrapper } from "../../components/atoms/body-wrapper";
import { newsFeeSelector } from "../../shared-ui/store/selectors/news-fee.selector";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { select } from "../../shared-ui/store/selectors";
import {
  loadNewsFeesAction,
  createNewsFeeAction
} from "../../shared-ui/store/actions/news-fee.action";
import { IModule } from "../../shared-ui/models/module";
import NewsFeeModal from "../../components/organisisms/news-fee-create-form";
import { NewsFee } from "../../shared-ui/models/news-fee.model";

const managerState = select(managerSelector);
const newsFeeState = select(newsFeeSelector);

export default function NewsFeeView(props: IModule) {
  const [visible, setVisible] = useState<boolean>(false);
  const condominium = useReduxState(managerState("condominium"));
  const newsFees = useReduxState(newsFeeState("newsFees"));

  const loadNewsFeeList = useReduxAction(loadNewsFeesAction(props.id));
  const createNewsFee = useReduxAction(createNewsFeeAction(props.id));

  useEffect(() => {
    if (!condominium.id) return;
    loadNewsFeeList({ condominiumId: condominium.id });
  }, [condominium.id]);

  const handleVisibility = (visible: boolean) => () => setVisible(visible);

  const onCreateNewsFee = (newsFee: NewsFee) => {
    createNewsFee(
      { ...newsFee, condominiumId: condominium.id },
      handleVisibility(false)
    );
  };

  return (
    <>
      <NewsFeeModal
        visible={visible}
        onAction={onCreateNewsFee}
        condominiumId={condominium.id}
        onClose={handleVisibility(false)}
      />
      <BladeTemplate
        header={
          <>
            {
              <Button type="primary" onClick={handleVisibility(true)}>
                Crear
              </Button>
            }
          </>
        }
      >
        <Wrapper>
          <div className="isoInvoiceTable">
            <Scrollbar style={{ width: "100%" }}>
              <Table
                dataSource={newsFees}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              >
                <Column
                  title="Titular"
                  dataIndex="title"
                  width="25%"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Descripción"
                  dataIndex="description"
                  width="55%"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Fecha de Creación"
                  dataIndex="createdAt"
                  width="10%"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Creado Por"
                  dataIndex="createdBy"
                  width="10%"
                  render={(_: string, newsFee: NewsFee) => (
                    <span>
                      {newsFee.userCreatedBy!.name +
                        " " +
                        newsFee.userCreatedBy!.lastName}
                    </span>
                  )}
                />
              </Table>
            </Scrollbar>
          </div>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
