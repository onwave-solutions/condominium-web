import React from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import { Company } from "../../../shared-ui/models/company.model";
import { changeHandler } from "../../../shared-ui/utils/input";
import { Keylist } from "../../../shared-ui/models/keylist";

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
        <Input name="phone" onChange={changer} value={company!.phone} />
      </FormItem>
      <FormItem label="Celular">
        <Input name="cellphone" onChange={changer} value={company!.cellphone} />
      </FormItem>
      <FormItem label="Dirección">
        <Input name="address" onChange={changer} value={company!.address} />
      </FormItem>
    </>
  );
}
