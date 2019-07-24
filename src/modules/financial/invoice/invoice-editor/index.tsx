import React, { useState, useEffect } from "react";
import moment from "moment";
import { IModule } from "../../../../shared-ui/models/module";

import Scrollbar from "../../../../components/atoms/scrollbar";
import BladeTemplate from "../../../../components/templates/blade-template";
import Input, { InputArea } from "../../../../components/atoms/input";
import Button from "../../../../components/atoms/button";
import { EditTable } from "../../../../components/molecules/edit-table";
import DatePicker from "../../../../components/atoms/datepicker";
import InvoicePageWrapper from "./invoice-editor.style";

import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import {
  updateInvoiceAction,
  setInvoiceDetailsAction,
  editInvoiceDetailAction,
  bulkCreateAction,
  updateInvoiceServiceAction,
  getInvoiceByIdAction,
  resetInvoiceAction
} from "../../../../shared-ui/store/actions/invoice.actions";
import {
  changeHandler,
  stringToPositiveDecimal
} from "../../../../shared-ui/utils/input";
import OrderDetailInfo from "../../../../components/molecules/order-detail-info";
import BuildingTree from "../../../../components/organisisms/building-tree";
import { managerSelector } from "../../../../shared-ui/store/selectors/manager.selector";
import invoiceListBlade from "../invoice-list/module";
import { currencyFormat } from "../../../../shared-ui/utils/currency";

const invoiceEditorState = select(invoiceSelector);
const managerState = select(managerSelector);

export default function InvoiceEditor(props: IModule) {
  const { match, history } = props;
  const [apartments, setApartments] = useState<string[]>([]);
  const condominium = useReduxState(managerState("condominium"));
  const invoice = useReduxState(invoiceEditorState("invoice"));
  const { invoiceDetails } = invoice;

  const setInvoice = useReduxAction(updateInvoiceAction);
  const setInvoiceDetails = useReduxAction(setInvoiceDetailsAction);
  const bulkCreate = useReduxAction(bulkCreateAction(props.id));
  const resetInvoice = useReduxAction(resetInvoiceAction);
  const getInvoiceById = useReduxAction(getInvoiceByIdAction(props.id));
  const updateInvoice = useReduxAction(updateInvoiceServiceAction(props.id));
  const editInvoiceDetail = useReduxAction(
    editInvoiceDetailAction(invoiceDetails!)
  );

  const onUpdateInvoice = () => {
    updateInvoice(condominium.id!, invoice);
  };

  const clear = () => {
    setApartments([]);
    setInvoiceDetails([{ key: 1 }]);
  };

  const formatter = currencyFormat(condominium);

  useEffect(() => {
    resetInvoice();
    if (match && match.params && match.params.id) {
      getInvoiceById(match.params.id);
    }
    return () => {
      clear();
    };
  }, []);

  return (
    <Scrollbar>
      <BladeTemplate
        header={
          <>
            {invoice.id && invoice.subTotal! > 0 && invoice.total! >= 0 ? (
              <Button type="primary" onClick={onUpdateInvoice}>
                Actualizar Factura
              </Button>
            ) : null}

            {apartments.length && !invoice.id && invoice.subTotal! > 0 ? (
              <Button
                type="primary"
                onClick={() => {
                  bulkCreate(
                    { creatorKeys: apartments, invoice },
                    invoiceListBlade.id!,
                    condominium.id!,
                    () => props.history.push("invoice-list")
                  );
                }}
              >
                Crear Factura
              </Button>
            ) : null}
          </>
        }
      >
        <InvoicePageWrapper>
          <div className="PageContent">
            <>
              {invoice.id ? (
                <span>
                  {`${invoice.apartment!.name} [${
                    invoice.apartment!.building!.name
                  }]`}
                </span>
              ) : null}
              <div style={{ flex: 1 }} />
              <span>
                Fecha de Facturación:
                <strong>
                  {invoice.createdAt || moment().format("DD/MM/YYYY")}
                </strong>{" "}
              </span>
            </>

            <OrderDetailInfo invoice={invoice} setInvoice={setInvoice} />
            <div className="BillingInformation">
              <div className="LeftSideContent">
                {invoice.id ? null : (
                  <BuildingTree
                    condominiumId={condominium.id!}
                    setSelectedKeys={setApartments}
                    selectedKeys={apartments}
                  />
                )}
              </div>
              <div className="RightSideContent">
                <InputArea
                  placeholder="Descripción"
                  value={invoice.description}
                  onChange={event =>
                    setInvoice({ ...invoice, description: event.target.value })
                  }
                  rows={3}
                  className="BillFormAddress"
                />
              </div>
            </div>
            <div className="InvoiceTable editInvoiceTable">
              <EditTable
                invoices={invoiceDetails!}
                invoiceChange={editInvoiceDetail}
                formatter={formatter}
                removeInvoice={key =>
                  setInvoiceDetails(invoiceDetails!.filter(x => x.key !== key))
                }
              />
              <div className="InvoiceTableBtn">
                <Button
                  type="primary"
                  onClick={() =>
                    setInvoiceDetails([
                      ...invoiceDetails!,
                      { key: invoiceDetails!.length + 1 }
                    ])
                  }
                >
                  Agregar
                </Button>
              </div>
              <div className="TotalBill">
                <p>
                  <span className="TotalBillTitle">Subtotal : </span>
                  <span>{formatter(invoice.subTotal!)}</span>
                </p>
                <div className="vatRateCalc">
                  <span className="vatRateCalcSpan">Descuento: </span>
                  <div className="vatRateCalcWrap">
                    <Input
                      addonBefore={condominium.currencySymbol + "$"}
                      type="number"
                      value={invoice.discount!}
                      onChange={event =>
                        setInvoice({
                          ...invoice,
                          discount: stringToPositiveDecimal(event.target.value)
                        })
                      }
                    />
                  </div>
                </div>
                <div className="currencySignWithTotal">
                  <span className="grandTotalSpan">Total </span>
                  <div className="currencySignWrap">
                    <span className="currencySignSpan">
                      {formatter(invoice.total!)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ButtonWrapper" />
          </div>
        </InvoicePageWrapper>
      </BladeTemplate>
    </Scrollbar>
  );
}
