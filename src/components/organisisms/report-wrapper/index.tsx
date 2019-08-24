import React, { useState, useEffect } from "react";

import _ from "lodash";
import moment from "moment";

import ScrollbarWrapper from "../../atoms/scrollbar";
import Row from "../../atoms/row";
import Button from "../../atoms/button";
import Col from "../../atoms/col";
import BladeTemplate from "../../templates/blade-template";
import { DateRangepicker } from "../../atoms/datepicker";
import Table, { Column } from "../../atoms/table";
import { ColumnProps } from "antd/lib/table/interface";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { KeyOf, Query } from "../../../shared-ui/utils/objects";

export type ReportWrapperChildrenType<T> = {
  state: AdvanceQuery<T>;
  setState: (override: AdvanceQuery<T>) => void;
};

export interface IReportWrapper<T> {
  data: T[];
  children?: (params: ReportWrapperChildrenType<T>) => React.ReactNode;
  resetKey?: string | number;
  columns: ColumnProps<T>[];
  dateKey?: KeyOf<T>;
  initialState?: AdvanceQuery<T>;
  onPrintClicked?: (query: AdvanceQuery<T>) => void;
  refetch?: (query: AdvanceQuery<T>) => () => void;
}

function getInitialState<T>(dateKey?: KeyOf<T>): AdvanceQuery<T> {
  const initialState: AdvanceQuery<T> = {};

  if (dateKey) {
    initialState[dateKey] = {
      between: {
        end: moment().endOf("month"),
        start: moment().startOf("month")
      }
    } as any;
  }

  return initialState;
}

let timeout: any;

export default function ReportWrapper<T extends object>({
  data = [],
  resetKey,
  columns = [],
  dateKey,
  refetch,
  children,
  onPrintClicked
}: IReportWrapper<T>) {
  const [query, setQuery] = useState<AdvanceQuery<T>>(getInitialState(dateKey));

  const onChange = ([startDate, endDate]: moment.Moment[]) => {
    const start = startDate.startOf("days");

    const end = endDate.endOf("days");

    const newState = {
      ...query,
      [dateKey! as any]: {
        between: {
          start,
          end
        }
      }
    };

    setQuery(newState);

    if (refetch) {
      clearTimeout(timeout);
      timeout = setTimeout(() => refetch(newState)(), 500);
    }
  };

  useEffect(() => {
    if (!resetKey || !refetch) return;
    refetch(query)();
  }, [resetKey]);

  const handleState = (newQuery: AdvanceQuery<T>) => {
    const newState = {
      ...query,
      ...newQuery
    };

    setQuery(newState);
    if (!refetch) return;
    clearTimeout(timeout);
    timeout = setTimeout(() => refetch(newState)(), 500);
  };

  return (
    <ScrollbarWrapper>
      <BladeTemplate
        header={
          <Row gutter={12} style={{ width: "100%" }}>
            {dateKey && (
              <Col md={8} sm={24}>
                <DateRangepicker
                  format="DD/MMM/YYYY"
                  onChange={onChange as any}
                  value={[
                    _.get(query, [dateKey, "between", "start"]),
                    _.get(query, [dateKey, "between", "end"])
                  ]}
                />
              </Col>
            )}
            {children && children({ state: query, setState: handleState })}
            <div style={{ flex: 1 }} />
          </Row>
        }
      >
        <Row
          type="flex"
          style={{ justifyContent: "flex-end", marginBottom: 5 }}
        >
          <Col>
            <Button
              icon="printer"
              type="primary"
              onClick={() => onPrintClicked && onPrintClicked(query)}
            />
          </Col>
        </Row>
        <Table
          rowKey="id"
          className="invoiceListTable"
          size="small"
          pagination={false}
          columns={columns as any}
          bordered={true}
          dataSource={data}
        />
      </BladeTemplate>
    </ScrollbarWrapper>
  );
}
