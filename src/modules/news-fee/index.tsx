import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";

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
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import { AdvanceQuery } from "../../shared-ui/models/keylist";
import { DateRangepicker } from "../../components/atoms/datepicker";

const managerState = select(managerSelector);
const newsFeeState = select(newsFeeSelector);

export default function NewsFeeView(props: IModule) {
  const [visible, setVisible] = useState<boolean>(false);
  const { onFilter, handleSearch, handleReset } = useSearch();
  const condominium = useReduxState(managerState("condominium"));
  const newsFees = useReduxState(newsFeeState("newsFees"));

  const [startDate, setStartDate] = useState<moment.Moment>(
    moment()
      .startOf("month")
      .startOf("hours")
      .startOf("minutes")
      .startOf("seconds")
  );

  const [endDate, setEndDate] = useState<moment.Moment>(
    moment()
      .endOf("month")
      .endOf("hours")
      .endOf("minutes")
      .endOf("seconds")
  );

  const payload: AdvanceQuery<NewsFee> = {
    condominiumId: condominium.id,
    deprecated: false,
    createdAt: {
      between: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  };

  const loadNewsFeeList = useReduxAction(loadNewsFeesAction(props.id));
  const createNewsFee = useReduxAction(createNewsFeeAction(props.id));

  useEffect(() => {
    if (!condominium.id) return;
    loadNewsFeeList(payload);
  }, [condominium.id]);

  const handleVisibility = (visible: boolean) => () => setVisible(visible);

  const onCreateNewsFee = (newsFee: NewsFee) => {
    createNewsFee(
      { ...newsFee, condominiumId: condominium.id },
      handleVisibility(false)
    );
  };

  const onChange = ([startDate, endDate]: moment.Moment[]) => {
    const start = startDate.startOf("days");

    const end = endDate.endOf("days");

    setStartDate(start);
    setEndDate(end);
    const payload: AdvanceQuery<NewsFee> = {
      condominiumId: condominium.id,
      deprecated: false,
      createdAt: {
        between: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    };
    loadNewsFeeList(payload);
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
            <DateRangepicker
              format="DD/MMM/YYYY"
              onChange={onChange as any}
              value={[startDate, endDate]}
            />
            <div style={{ flex: 1 }} />

            <Button type="primary" onClick={handleVisibility(true)}>
              Crear
            </Button>
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
                  onFilter={onFilter(record => record.title)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Contenido"
                  dataIndex="description"
                  onFilter={onFilter(record => record.description)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  width="55%"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Fecha de Expiración"
                  dataIndex="endDate"
                  width="25%"
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
                  onFilter={onFilter(
                    record =>
                      _.get(record, ["userCreatedBy", "name", ""]) +
                      " " +
                      _.get(record, ["userCreatedBy", "lastName"], "")
                  )}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
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
