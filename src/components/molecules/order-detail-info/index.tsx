import React from "react";
import moment from "moment";
import Input from "../../atoms/input";
import DatePicker from "../../atoms/datepicker";
import { Invoice } from "../../../shared-ui/models/invoice.model";

export interface IOrderDetailInfo {
  invoice: Partial<Invoice>;
  setInvoice(invoice: Invoice): void;
}

export default function OrderDetailInfo(props: IOrderDetailInfo) {
  const { invoice, setInvoice } = props;
  return (
    <div className="OrderInfo">
      <div className="LeftSideContent">
        Factura No.
        <Input
          value={invoice.sequence}
          placeholder="Factura No."
          disabled={true}
          className="LeftSideContentInput"
        />
      </div>
      <div className="RightSideContent">
        Fecha Limite de Pago:
        <div className="RightSideDate">
          <DatePicker
            allowClear={false}
            format="DD/MM/YYYY"
            onChange={(_: moment.Moment, dateStr: string) =>
              setInvoice({ ...invoice, dueDate: dateStr })
            }
            value={moment(invoice.dueDate, "DD/MM/YYYY")}
          />
        </div>
      </div>
    </div>
  );
}
