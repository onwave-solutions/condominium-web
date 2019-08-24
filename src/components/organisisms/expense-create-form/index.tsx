import React, { useState, useEffect } from "react";

import moment from "moment";

import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Col from "../../atoms/col";
import Icon from "../../atoms/icon";
import Button from "../../atoms/button";
import Upload from "../../atoms/upload";
import Select from "../../atoms/select";
import DatePicker from "../../atoms/datepicker";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import Modals from "../../hoc/with-modal-style";
import AntdModal, { confirm } from "../../atoms/modal";
import withDirection from "../../hoc/with-direction";
import { Expense } from "../../../shared-ui/models/expense.model";
import { Supplier } from "../../../shared-ui/models/supplier.model";
import { changeHandler } from "../../../shared-ui/utils/input";
import { BankAccount } from "../../../shared-ui/models/bank-account";
import { validateModel } from "../../../shared-ui/utils/objects";
import { uploadToS3 } from "../../../shared-ui/utils/s3";
import { UploadFile } from "antd/lib/upload/interface";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IExpenseCreateForm {
  visible?: boolean;
  onClose?(): void;
  onAction?(expense: Expense): void;
  suppliers: Supplier[];
  accounts?: BankAccount[];
}

export default function ExpenseCreateForm({
  visible,
  onClose,
  accounts,
  onAction,
  suppliers
}: IExpenseCreateForm) {
  const [expense, setExpense] = useState<Expense>({ attachments: [] });

  const onItemSelect = (name: string, value: any) => {
    setExpense({ ...expense, [name]: value });
  };

  const changer = changeHandler(expense, setExpense);

  useEffect(() => {
    if (!visible) return;
    setExpense({ attachments: [] });
  }, [visible]);

  const handleOnAction = () => {
    const { bankAccountId, amount } = expense;
    const account = accounts!.find(x => `${x.id}` === `${bankAccountId}`);
    if (!account) return;

    if (parseFloat(`${account.balance!}`) < parseFloat(`${amount!}`)) {
      confirm({
        title:
          "Monto del gasto excede el limite de la cuenta. Desea Continuar?",
        onOk: () => onAction!(expense)
      });
      return;
    }

    onAction!(expense);
  };

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={handleOnAction}
      okButtonProps={{
        disabled: Boolean(
          validateModel(expense, [
            "amount",
            "bankAccountId",
            "date",
            "supplierId"
          ]).length
        )
      }}
      cancelText="Cancelar"
      okText="Agregar Gasto"
      title="Gastos"
    >
      <Row>
        <Form className="isoCardInfoForm">
          <FormItem label="Caja" md={24} sm={24}>
            <Select
              name="bankAccountId"
              typeName="id"
              renderNode={(account: BankAccount) => {
                return `${account.account} [${account.bank!.name}] (${
                  account.balance
                } RD$)`;
              }}
              onChangeItem={onItemSelect}
              value={expense.bankAccountId}
              data={accounts}
            />
          </FormItem>
          <FormItem label="Suplidor" md={24} sm={24}>
            <Select
              name="supplierId"
              typeName="id"
              labelName="description"
              onChangeItem={onItemSelect}
              value={expense.supplierId || ""}
              data={suppliers}
            />
          </FormItem>
          <FormItem label="Monto">
            <Input
              name="amount"
              type="number"
              onChange={changer}
              value={expense.amount}
            />
          </FormItem>
          <FormItem label="Fecha Efectiva">
            <DatePicker
              allowClear={false}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={(_: moment.Moment, dateStr: string) =>
                onItemSelect("date", dateStr)
              }
              disabledDate={(current?: moment.Moment) =>
                current ? current.isAfter(moment()) : false
              }
              value={
                expense.date ? moment(expense.date, "DD/MM/YYYY") : undefined
              }
            />
          </FormItem>
          <FormItem label="Descripción del Gasto" md={24} sm={24}>
            <Input
              name="description"
              onChange={changer}
              value={expense.description}
            />
          </FormItem>
          <FormItem label="Archivos" md={24} sm={24}>
            <Col span={24}>
              <Upload
                accept="image/*,application/pdf"
                fileList={(expense.attachments || []).map<UploadFile>(file => ({
                  url: file.url!,
                  uid: file.url!,
                  size: 0,
                  type: "",
                  status: "success",
                  name: file.description!
                }))}
                onRemove={file => {
                  setExpense({
                    ...expense,
                    attachments: (expense.attachments || []).filter(
                      e => e.url !== file.url
                    )
                  });
                }}
                beforeUpload={async file => {
                  try {
                    const data = await uploadToS3({
                      file,
                      is3File: {
                        name: file.name
                      }
                    });
                    setExpense({
                      ...expense,
                      attachments: [
                        ...(expense.attachments || []),
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
            </Col>
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
