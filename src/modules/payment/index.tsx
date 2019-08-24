import React, { useEffect, useState } from "react";

import { Radio, Divider } from "antd";
import Col from "../../components/atoms/col";
import Upload from "../../components/atoms/upload";
import Icon from "../../components/atoms/icon";
import Row from "../../components/atoms/col";
import Card from "../../components/atoms/card";
import Button from "../../components/atoms/button";
import Select from "../../components/atoms/select";
import Input from "../../components/atoms/input";
import FormItem from "../../components/molecules/form-item";
import Scrollbar from "../../components/atoms/scrollbar";

import BladeTemplate from "../../components/templates/blade-template";
import { Wrapper } from "../../components/atoms/body-wrapper";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";

import { IModule } from "../../shared-ui/models/module";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import {
  getPaymentInvoiceAction,
  proceedPaymentAction
} from "../../shared-ui/store/actions/payment.action";
import { paymentSelector } from "../../shared-ui/store/selectors/payment.selector";
import BankAccountSelector from "../../components/organisisms/bank-account-selector-form";
import InvoiceComponent from "../financial/invoice/invoice-view/component";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { Payment } from "../../shared-ui/models/payment.model";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";
import { currencyFormat } from "../../shared-ui/utils/currency";
import { uploadToS3 } from "../../shared-ui/utils/s3";
import { UploadFile } from "antd/lib/upload/interface";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";

const bankAccountState = select(bankAccountSelector);
const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const paymentState = select(paymentSelector);
const appState = select(appSelector);

const PaymentView: React.FC<IModule> = props => {
  const { match, isTenant } = props;
  const [paymentType, setType] = useState<string>("1");
  const [visible, setVisible] = useState(false);
  const apartment = useReduxState(tenantState("apartment"));
  const [payment, setPayment] = useState<Payment>({ attachments: [] });
  const keylist = useReduxState(appState("keylist"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));
  const condominium = useReduxState(managerState("condominium"));
  const invoice = useReduxState(paymentState("invoice"));

  const loadPayment = useReduxAction(getPaymentInvoiceAction);
  const proceedPayment = useReduxAction(proceedPaymentAction);
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());

  const condominiumId = isTenant
    ? apartment && apartment.building!.condominiumId
    : condominium.id;

  let formatter = (amount: number) => `${amount}`;
  if (apartment && apartment.building && apartment.building.condominium) {
    formatter = currencyFormat(apartment.building!.condominium!);
  }

  useEffect(() => {
    if (match && match.params && match.params.id) {
      loadPayment(match.params.id);
      if (condominiumId) {
        loadBankAccounts({ condominiumId, disabled: false });
      }
    }
  }, []);

  const onPayClicked = async () => {
    if (isTenant) {
      await proceedPayment({ ...payment, invoiceId: invoice.id }, () => {
        props.history.push(`/invoice-list`);
      });
      return;
    }
    setVisible(true);
  };

  const onManagerPay = async (bankId: number) => {
    await proceedPayment(
      {
        ...payment,
        bankAccountId: bankId,
        invoiceId: invoice.id
      },
      () => {
        setVisible(false);
        props.history.push(`/invoice-list`);
      }
    );
  };

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  useEffect(() => {
    if (paymentType === "1") {
      setPayment({ ...payment, amount: invoice.total });
    } else if (paymentType === "2") {
      setPayment({ ...payment, amount: undefined });
    }
  }, [paymentType]);

  return (
    <Scrollbar>
      <BankAccountSelector
        accounts={bankAccounts}
        formatter={formatter}
        visible={visible}
        onClose={() => setVisible(false)}
        onAction={onManagerPay}
      />
      <BladeTemplate header={<></>}>
        <Wrapper>
          <Row>
            <Col md={6} sm={24}>
              <Card>
                <FormItem label="Método de Pago" sm={24} md={24}>
                  <Select
                    data={(keylist.paymentMethods || []).map(x => {
                      if (!isTenant) return x;

                      if (["TC"].includes(x.type!)) {
                        return x;
                      }

                      return {
                        ...x,
                        disabled: true
                      };
                    })}
                    name="paymentMethod"
                    disabled={!["PE", "MO"].includes(invoice.statusType!)}
                    value={payment.methodTypeId}
                    onSelect={(value: any) => {
                      setPayment({ ...payment, methodTypeId: value });
                    }}
                  />
                </FormItem>
                <FormItem label="Pago" sm={24} md={24}>
                  <br />
                  <Radio.Group>
                    <Radio
                      style={radioStyle}
                      value="1"
                      checked={paymentType === "1"}
                      disabled={!["PE", "MO"].includes(invoice.statusType!)}
                      onChange={() => setType("1")}
                    >
                      {`Pago Total: ${invoice.total || 0}`}
                    </Radio>
                    <Radio
                      style={radioStyle}
                      checked={paymentType === "2"}
                      value="2"
                      disabled={!["PE", "MO"].includes(invoice.statusType!)}
                      onChange={() => setType("2")}
                    >
                      OTRO
                    </Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem label="Monto" sm={24} md={24}>
                  <Input
                    name="amount"
                    type="number"
                    disabled={paymentType !== "2"}
                    value={payment.amount}
                    onChange={({ target: { name, value } }) =>
                      setPayment({ ...payment, [name]: value })
                    }
                  />
                </FormItem>
                <FormItem label="Referencia" sm={24} md={24}>
                  <Input
                    name="reference"
                    value={payment.reference}
                    onChange={({ target: { name, value } }) =>
                      setPayment({ ...payment, [name]: value })
                    }
                  />
                </FormItem>
                <FormItem label="Descripción" sm={24} md={24}>
                  <Input
                    name="description"
                    value={payment.description}
                    multiple={true}
                    onChange={({ target: { name, value } }) =>
                      setPayment({ ...payment, [name]: value })
                    }
                  />
                </FormItem>
                <Upload
                  accept="image/*,application/pdf"
                  fileList={(payment.attachments || []).map<UploadFile>(
                    file => ({
                      url: file.url!,
                      uid: file.url!,
                      size: 0,
                      type: "",
                      status: "success",
                      name: file.description!
                    })
                  )}
                  beforeUpload={async file => {
                    try {
                      const data = await uploadToS3({
                        file,
                        is3File: {
                          name: file.name
                        }
                      });
                      setPayment({
                        ...payment,
                        attachments: [
                          ...(payment.attachments || []),
                          {
                            description: data.name,
                            url: data.url
                          }
                        ]
                      });
                    } catch (e) {
                      console.log(e);
                    }
                    return false;
                  }}
                >
                  <Button>
                    <Icon type="upload" /> Agregar Documento
                  </Button>
                </Upload>
                <Divider />
                <Button
                  style={{ width: "100%" }}
                  onClick={onPayClicked}
                  type="primary"
                  disabled={
                    !Boolean(payment.methodTypeId) || (payment.amount || 0) <= 0
                  }
                >
                  PAGAR
                </Button>
              </Card>
            </Col>
            <Col md={1} sm={0} />
            <Col md={17} sm={24}>
              {invoice.id && (
                <InvoiceComponent invoice={invoice} formatter={formatter} />
              )}
            </Col>
          </Row>
        </Wrapper>
      </BladeTemplate>
    </Scrollbar>
  );
};

export default PaymentView;
