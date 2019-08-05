import React, { useEffect, useState } from "react";
import { List, Skeleton, Avatar } from "antd";
import { IModule } from "../../../../shared-ui/models/module";
import BladeTemplate from "../../../../components/templates/blade-template";
import Table, { Column } from "../../../../components/atoms/table";
import Scrollbar from "../../../../components/atoms/scrollbar";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import { getInvoiceByIdAction } from "../../../../shared-ui/store/actions/invoice.actions";

import InvoiceComponent from "./component";
import Button from "../../../../components/atoms/button";
import { managerSelector } from "../../../../shared-ui/store/selectors/manager.selector";
import { currencyFormat } from "../../../../shared-ui/utils/currency";
import { InvoiceService } from "../../../../shared-ui/services/invoice.service";
import { PaymentService } from "../../../../shared-ui/services/payment.service";
import {
  Payment,
  Attachment
} from "../../../../shared-ui/models/payment.model";

const invoiceState = select(invoiceSelector);
const managerState = select(managerSelector);
const paymentService = new PaymentService();

export default function InvoiceView(props: IModule) {
  const { match } = props;
  const [payments, setPayments] = useState<Payment[]>([]);
  const invoice = useReduxState(invoiceState("invoice"));
  const getInvoiceById = useReduxAction(getInvoiceByIdAction(props.id));
  const condominium = useReduxState(managerState("condominium"));

  const onClickPayInvoice = () => {
    props.history.push(`/payment/${invoice.id}`);
  };

  useEffect(() => {
    if (match && match.params && match.params.id) {
      getInvoiceById(match.params.id);
    }
  }, []);

  useEffect(() => {
    if (!invoice.id) return;
    paymentService
      .query({
        invoiceId: invoice.id
      })
      .then(setPayments);
  }, [invoice.id]);

  const formatter = currencyFormat(condominium);

  const files: Attachment[] = payments
    .filter(x => ["PP", "PA"].includes(x.statusTypeId!))
    .map<Attachment[]>(payment => payment.attachments || [])
    .flat();

  return (
    <Scrollbar>
      <BladeTemplate
        header={
          <>
            {["MO", "PE"].includes(invoice.statusType!) && (
              <Button onClick={onClickPayInvoice}>Pagar</Button>
            )}
          </>
        }
      >
        {invoice.id && (
          <InvoiceComponent invoice={invoice} formatter={formatter} />
        )}
        {payments.length > 0 && (
          <>
            <h3>Pagos</h3>

            <Table
              dataSource={payments}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: true }}
              className="invoiceListTable"
            >
              <Column
                title="ID"
                dataIndex="id"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Método de Pago"
                dataIndex="methodTypeId"
                width="100px"
                render={(_: string, payment: Payment) => (
                  <span>{payment.methodType!.name}</span>
                )}
              />
              <Column
                title="Caja"
                dataIndex="bankAccountId"
                width="180px"
                render={(_: string, payment: Payment) =>
                  payment.bankAccount ? (
                    <span>
                      {payment.bankAccount!.bank!.name}-
                      {payment.bankAccount!.account}
                    </span>
                  ) : null
                }
              />
              <Column
                title="Estado"
                dataIndex="statusTypeId"
                width="100px"
                render={(_: string, payment: Payment) => (
                  <span>{payment.status!.name}</span>
                )}
              />
              <Column
                title="Apartamento"
                dataIndex="apartmentId"
                width="100px"
                render={(_: string, payment: Payment) => (
                  <span>{`${payment.invoice!.apartment!.name} (${
                    payment.invoice!.apartment!.building!.name
                  })`}</span>
                )}
              />
              <Column
                title="Monto"
                dataIndex="amount"
                width="80px"
                render={(text: number) => formatter(text)}
              />
              <Column
                title="Pagado Por"
                dataIndex="createdBy"
                width="80px"
                render={(_: string, payment: Payment) => (
                  <span>
                    {payment.userCreatedBy!.name +
                      " " +
                      payment.userCreatedBy!.lastName}
                  </span>
                )}
              />
              <Column
                title="Aprobado Por"
                dataIndex="updatedBy"
                width="80px"
                render={(_: string, payment: Payment) => (
                  <span>
                    {payment.approved
                      ? payment.approved!.name +
                        " " +
                        payment.approved!.lastName
                      : ""}
                  </span>
                )}
              />
              <Column
                title={"Fecha de Pago"}
                dataIndex={"createdAt"}
                width={"120px"}
                render={(text: string) => <strong>{text}</strong>}
              />
              <Column
                title={"Fecha de Autorización"}
                dataIndex={"approvedAt"}
                width={"120px"}
                render={(text: string) => <strong>{text}</strong>}
              />
            </Table>
            {files && files.length && (
              <List
                header={<h4>Archivos Adjuntos</h4>}
                dataSource={files}
                renderItem={(file: Attachment) => {
                  return (
                    <List.Item key={file.id}>
                      <a href={file.url}>{file.description}</a>
                    </List.Item>
                  );
                }}
              />
            )}
          </>
        )}
      </BladeTemplate>
    </Scrollbar>
  );
}
