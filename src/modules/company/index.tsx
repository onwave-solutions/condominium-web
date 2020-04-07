import React, { useEffect, useState } from "react";
import Modal from "../../components/atoms/modal";
import Row from "../../components/atoms/row";

import get from "lodash/get";

import Scrollbar from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
import Button, { ButtonGroup } from "../../components/atoms/button";
import PopConfirm from "../../components/atoms/pop-confirm";
import BladeTemplate from "../../components/templates/blade-template";
import CompanyForm from "../../components/organisisms/company-form";
import { Wrapper } from "../../components/atoms/body-wrapper";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { select } from "../../shared-ui/store/selectors";
import { companySelector } from "../../shared-ui/store/selectors/company.selector";
import { IModule } from "../../shared-ui/models/module";
import {
  loadCompaniesAction,
  setCompanyAction,
  createCompanyAction,
  updateCompanyAction
} from "../../shared-ui/store/actions/company.action";
import { Company } from "../../shared-ui/models/company.model";
import { phoneFormat } from "../../shared-ui/utils/input";
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";

const companyState = select(companySelector);
const appState = select(appSelector);

export default function CompanyView(props: IModule) {
  const { onFilter, handleSearch, handleReset } = useSearch();
  const [visible, setVisibility] = useState<boolean>(false);
  const company = useReduxState(companyState("company"));
  const companies = useReduxState(companyState("companies"));
  const keylist = useReduxState(appState("keylist"));

  const loadCompanies = useReduxAction(loadCompaniesAction(props.id));
  const setCompany = useReduxAction(setCompanyAction);
  const create = useReduxAction(createCompanyAction(props.id));
  const update = useReduxAction(updateCompanyAction(props.id));
  const clear = () => setCompany({});

  useEffect(() => {
    loadCompanies();
    return () => {
      clear();
    };
  }, []);

  const handleOpenModal = (company: Company) => () => {
    setCompany(company);
    setVisibility(true);
  };

  const handleAction = async () => {
    const cb = () => setVisibility(false);
    if (company.id) {
      await update(company, cb);
    } else {
      await create(company, cb);
    }
  };

  const deleteCompany =  (company:Company) => update(company)

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={handleAction}
        closable={false}
        title={`${company.id ? "Actualizar" : "Crear"} Compañia`}
      >
        <Row>
          <CompanyForm
            company={company}
            keylist={keylist}
            companyChange={setCompany}
          />
        </Row>
      </Modal>

      <BladeTemplate
        header={
          <>
            <Button type="primary" onClick={handleOpenModal({})}>
              Crear
            </Button>
          </>
        }
      >
        <Wrapper>
          <Scrollbar style={{ width: "100%" }}>
            <Table
              dataSource={companies}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            >
              <Column
                title="Compañia"
                dataIndex="name"
                width="80px"
                onFilter={onFilter(record => record.name)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Tipo de Documento"
                dataIndex="documentId"
                width="80px"
                filterDropdown={(filterProps: any) => (
                  <ColumnSelectFilter
                    {...filterProps}
                    data={keylist.documentTypes}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                onFilter={onFilter(record => get(record, "documentType.type"))}
                render={(_: string, company: Company) => (
                  <span>{get(company, "documentType.name")}</span>
                )}
              />
              <Column
                title="Documento"
                dataIndex="document"
                width="80px"
                onFilter={onFilter(record => record.document)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Teléfono"
                dataIndex="phone"
                width="80px"
                onFilter={onFilter(record => record.phone)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{phoneFormat(text)}</span>}
              />
              <Column
                title="Celular"
                dataIndex="cellphone"
                width="80px"
                onFilter={onFilter(record => record.cellphone)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{phoneFormat(text)}</span>}
              />
              <Column
                title="Dirección"
                dataIndex="address"
                width="100px"
                onFilter={onFilter(record => record.address)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Acciones"
                dataIndex={"edit"}
                width={"5%"}
                render={(_: string, company: Company) => (
                  <>
                    <ButtonGroup>
                      <Button onClick={handleOpenModal(company)} icon="edit" />
                      <PopConfirm
                        title="Esta seguro de eliminar esta compañia?"
                        onConfirm={() => deleteCompany({...company, deprecated: true})}
                      >
                        <Button type="danger" size="default" icon="close" />
                      </PopConfirm>
                    </ButtonGroup>
                  </>
                )}
              />
            </Table>
          </Scrollbar>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
