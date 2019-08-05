import React from "react";

import { Rifm } from "rifm";
import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import { Company } from "../../../shared-ui/models/company.model";
import { changeHandler, phoneFormat } from "../../../shared-ui/utils/input";
import { Keylist } from "../../../shared-ui/models/keylist";
import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";

export interface ICompanyForm {
  company: Partial<Company>;
  keylist?: Keylist;
  companyChange?(company: Company): void;
}

export default function CompanyForm(props: ICompanyForm) {
  const { company, companyChange, keylist } = props;
  const changer = changeHandler(company, companyChange!);
  const onItemSelect = (name: string, value: any) => {
    companyChange!({ ...company, [name]: value });
  };

  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input name="name" value={company.name} onChange={changer} />
      </FormItem>
      <FormItem label="Tipo de documento">
        <Select
          name="documentId"
          onChangeItem={onItemSelect}
          value={company!.documentId}
          data={keylist!.documentTypes}
        />
      </FormItem>
      <FormItem label="Documento">
        <Input name="document" onChange={changer} value={company!.document} />
      </FormItem>
      <FormItem label="Teléfono">
        <Rifm
          value={company!.phone!}
          format={phoneFormat}
          accept={/\d+/g}
          onChange={str => companyChange!({ ...company, phone: str })}
        >
          {({ value, onChange }) => (
            <Input name="phone" onChange={onChange} value={value} />
          )}
        </Rifm>
      </FormItem>
      <FormItem label="Celular">
        <Rifm
          value={company!.cellphone!}
          format={phoneFormat}
          accept={/\d+/g}
          onChange={str => companyChange!({ ...company, cellphone: str })}
        >
          {({ value, onChange }) => (
            <Input name="cellphone" onChange={onChange} value={value} />
          )}
        </Rifm>
      </FormItem>
      <FormItem label="Dirección">
        <Input name="address" onChange={changer} value={company!.address} />
      </FormItem>
    </>
  );
}
