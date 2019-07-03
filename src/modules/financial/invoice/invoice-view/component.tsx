import React from "react";
import InvoicePageWrapper from "../invoice-editor/invoice-editor.style";
import { Invoice } from "../../../../shared-ui/models/invoice.model";
import { ViewTable } from "../../../../components/molecules/edit-table";

export interface IInvoiceViewComponent {
  invoice: Invoice;
}

export default function InvoiceViewComponent({
  invoice
}: IInvoiceViewComponent) {
  return (
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
  );
}
