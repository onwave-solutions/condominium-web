import React, { useEffect } from "react";
import { IModule } from "../../../../shared-ui/models/module";
import BladeTemplate from "../../../../components/templates/blade-template";
import { ViewTable } from "../../../../components/molecules/edit-table";
import InvoicePageWrapper from "../invoice-editor/invoice-editor.style";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import { getInvoiceByIdAction } from "../../../../shared-ui/store/actions/invoice.actions";

const invoiceState = select(invoiceSelector);

export default function InvoiceView(props: IModule) {
  const { match } = props;
  const invoice = useReduxState(invoiceState("invoice"));
  const getInvoiceById = useReduxAction(getInvoiceByIdAction(props.id));

  useEffect(() => {
    if (match && match.params && match.params.id) {
      getInvoiceById(match.params.id);
    }
  }, []);

  return (
    <BladeTemplate header={<></>}>
      {invoice.id && (
        <InvoicePageWrapper className="InvoicePageWrapper">
          <div className="PageContent">
            <div className="OrderInfo">
              <div className="LeftSideContent">
                <h3 className="Title">
                  {`Información de Factura: #${invoice.id}`}
                </h3>
                <span className="InvoiceNumber">
                  <strong>{`${invoice.apartment!.name} [${
                    invoice.apartment!.building!.name
                  }]`}</strong>
                </span>
              </div>
              <div className="RightSideContent">
                <p>
                  <span className="orderStatusSpan">Estado: </span>
                  <span className="orderStatus">{invoice.status!.name}</span>
                </p>
                <p>
                  <span className="orderDateSpan">Fecha de Facturación: </span>
                  <span className="orderDate">{invoice.createdAt}</span>
                </p>
                <p>
                  <span className="orderDateSpan">Fecha Límite: </span>
                  <span className="orderDate">{invoice.dueDate}</span>
                </p>
              </div>
            </div>

            <div className="BillingInformation">
              <div className="LeftSideContent">{invoice.description}</div>
            </div>

            <div className="InvoiceTable">
              <ViewTable invoices={invoice.invoiceDetails!} />
              <div className="TotalBill">
                <p>
                  Sub-total : <span>{`${invoice.subTotal}`}</span>
                </p>
                <p>
                  Descuento : <span>{`${invoice.discount}`}</span>
                </p>
                <h3>
                  Total : <span>{`${invoice.total}`}</span>
                </h3>
              </div>
            </div>
          </div>
        </InvoicePageWrapper>
      )}
    </BladeTemplate>
  );
}
