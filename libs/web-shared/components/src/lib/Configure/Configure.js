import './Configure.css';
import {
  ButtonComponent,
  DataTableComponent,
  Box,
  DeleteIcon,
  EditIcon,
  FormFieldRow,
  Modals,
  Span,
} from '@athena/web-shared/ui';
import { Tab, Tabs, Row, Col, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiRequest, useAuth } from '@athena/web-shared/utils';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import * as yup from 'yup';
import { Loader } from '../../../../ui/src';

export const technologySchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .matches(/^(?!^\s+$)[\w\s]{3,32}$/, 'Name should be min 3 characters'),
});

export function Configure(props) {
  const [techData, setTechData] = useState([]);
  const [domainData, setDomainData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [userrole, setuserrole] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState([]);
  const [deleteRow, setDeleteRow] = useState([]);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [tabKey, setTabkey] = useState('technology');
  const [pending, setPending] = useState(false);
  const[isLoading, setIsLoading] = useState(true);

  const auth = useAuth();
  useEffect(() => {
    if (auth && auth.user) {
      setuserrole(auth?.user?.role[0]?.name);
    }
  }, [auth]);

  const technologyColumns = [
    {
      name: 'Technology Name',
      selector: (row) => row.name,
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            className="mt-2 config-button"
            onClick={() => {
              setSelectedRow(row); // Set the selected row data
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setModalShow(true);
              console.log('modal', modalShow);
              setName([row]);
              console.log('NAMEe', name);
            }}
            className="config-button mt-2 ms-5"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '13rem',
    },
  ];

  const domainColumns = [
    {
      name: 'Domain Name',
      selector: (row) => row.name,
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            className="mt-2 config-button"
            onClick={() => {
              setSelectedRow(row); // Set the selected row data
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setModalShow(true);
              console.log('modal', modalShow);
              setName([row]);
              console.log('NAMEe', name); // Set the selected row data
            }}
            className="config-button mt-2 ms-5"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '13rem',
    },
  ];
  const companyColumns = [
    {
      name: 'Company Name',
      selector: (row) => row.name,
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            className="mt-2 config-button"
            onClick={() => {
              setSelectedRow(row); // Set the selected row data
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setModalShow(true);
              console.log('modal', modalShow);
              setName([row]);
              console.log('NAMEe', name); // Set the selected row data
            }}
            className="config-button mt-2 ms-5"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '13rem',
    },
  ];

  const getTechnologies = async () => {
    try {
      let technologyResponse = await apiRequest(
        'api/courses/domainTechnology/getDomainTechnology/technology',
        'GET'
      );
      console.log('ffffffffffff', technologyResponse);
      let technologyData = technologyResponse?.value?.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      console.log('HHH', technologyData);
      setTechData(technologyData);
      console.log('KKK', techData);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      console.log();

    }
  };
  // }
  useEffect(() => {
    if (tabKey === 'technology') {
      getTechnologies();
      console.log('TTTTT', getTechnologies);
    }
  }, [tabKey]);

  const getDomains = async () => {
    try {
      let domainResponse = await apiRequest(
        'api/courses/domainTechnology/getDomainTechnology/domain',
        'GET'
      );
      console.log('ffffffffffff', domainResponse);
      let domainData = domainResponse?.value?.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      console.log('HHH', domainData);
      setDomainData(domainData);
      setIsLoading(false);
      console.log('KKK', techData);
    } catch {
      console.log();
      setIsLoading(false);
    }
  };
  // }
  useEffect(() => {
    if (tabKey === 'domain') {
      getDomains();
      console.log('TTTTT', getDomains);
    }
  }, [tabKey]);
  const getCompanies = async () => {
    try {
      let clientResponse = await apiRequest(
        'api/users/company/getCompanies',
        'GET'
      );
      let clientData = clientResponse?.value?.map((x) => {
        return {
          id: x.id,
          name: x.name,
        };
      });
      setCompanyData(clientData);
      console.log('MMM', clientData);
      setIsLoading(false);
    } catch {
      console.log();
      setIsLoading(false);
    }
  };
  useEffect(() => {
        if (tabKey === 'companies') {
    getCompanies();
        }
  }, [tabKey]);

  useEffect(() => {
    if (modalShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [modalShow]);

  // const handleRowSelected = React.useCallback((state) => {
  //   if (state.slectedCount) {
  //     setIsRowSelected(true);
  //   } else {
  //     setIsRowSelected(false);
  //   }
  //   setSelectedRow(state?.selectedRow?.map((e) => e));
  // }, []);

  const TechnologyForm = (props) => {
    const {
      onSubmit,
      selectedRow,
      deleteRow,
      eventKey,
      buttonName,
      placeholder,
    } = props;
    const [fieldName, setFieldName] = useState(''); // State to hold the input field value

    const {
      handleSubmit,
      register,
      reset,
      setValue,
      getValues,
      control,
      setError,
      clearErrors,
      formState: { errors },
    } = useForm({
      defaultValues: {
        config_details: [
          {
            name: '',
            blob_category: '',
          },
        ],
      },
      resolver: yupResolver(technologySchema),
    });
    console.log(fieldName, 'fldfff');
    const onSubmitData = async () => {
      const techDomainValues = getValues();
      const data = {
        name: techDomainValues.name,
        blob_category:
          props?.buttonName === 'Add Technolgy' ? 'technology' : 'domain',
      };
      const Data = {
        name: techDomainValues.name,
      };
      try {
        console.log(
          !selectedRow && props?.buttonName !== 'Add Company',
          'BBBBBBBBBB'
        );
        if (!selectedRow && props?.buttonName !== 'Add Company') {
          setPending(true);
          let response = await apiRequest(
            'api/courses/domainTechnology/createDomainTechnology',
            'POST',
            data
          );
          // Handle the response
          if (response && response.status === 'success') {
            if (props?.buttonName === 'Add Technolgy') {
              toast.success('Technolgy created successfully!');
              getTechnologies();
            }
            if (props?.buttonName === 'Add Domain') {
              toast.success('Domain created successfully!');
              getDomains();
            }
            setPending(false);
          }
        } else if (eventKey !== 'companies') {
          let response = await apiRequest(
            `api/courses/domainTechnology/editDomainTechnology/${selectedRow.id}`,
            'PUT',
            data
          );
          console.log('DMN', response);
          if (response && response.status === 'success') {
            if (props?.buttonName === 'Add Technolgy') {
              toast.success('Technolgy updated successfully!');
              setName([]);
              setSelectedRow(null);
              getTechnologies();
            } else {
              toast.success('Domain updated successfully!');
              setName([]);
              setSelectedRow(null);
              getDomains();
            }
          }
        }
      } catch (error) {
        console.error(error);
      }

      try {
        console.log(!selectedRow && eventKey === 'companies', 'sad');
        if (!selectedRow && eventKey === 'companies') {
          let companyResponse = await apiRequest(
            'api/users/company/createCompany',
            'POST',
            Data
          );
          if (companyResponse && companyResponse.status === 'success') {
            toast.success('Company created successfully!');
            getCompanies();
          }
        } else {
          let companyResponse = await apiRequest(
            `api/users/company/updatecompany/${selectedRow.id}`,
            'PUT',
            Data
          );
          if (companyResponse && companyResponse.status === 'success') {
            toast.success('Company updated successfully!');
            setName([]);
            setSelectedRow(null);
            getCompanies();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Form onSubmit={handleSubmit(onSubmitData)}>
        <Row className="mt-5 mb-5 d-flex align-items-center justify-content-between">
          <Col lg="8" sm="12">
            <Form.Group controlId="name" style={{ height: '40px' }}>
              <FormFieldRow
                size="md"
                size1="4"
                size2="8"
                name="name"
                type="input"
                inputRef={register('name')}
                error={errors.name}
                label={props.label}
                labelClassName="mt-1"
                className="requiredd"
                placeholder={placeholder}
                style={{ width: '35vh' }}
                defaultValue={selectedRow ? selectedRow.name : ''} // Populate the value of the input field
              />
            </Form.Group>
          </Col>
          <Col lg="4" sm="12" className="d-flex justify-content-end">
            {selectedRow && (
              <ButtonComponent
                variant="outline-primary"
                className="rounded-4 me-3"
                style={{ minWidth: '10vh' }}
                type="cancel"
                name="Clear"
                onClick={() => {
                  reset();
                  setSelectedRow(null);
                }}
              ></ButtonComponent>
            )}
            <ButtonComponent
              className="rounded-5"
              type="submit"
              name={selectedRow ? 'Update' : buttonName}
            ></ButtonComponent>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <>
      {isLoading ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <>
          {' '}
          {deleteRow ? (
            <Box>
              <Modals
                delete={name === null ? [] : name}
                multidelete={deleteRow}
                show={modalShow}
                type={tabKey}
                onHide={() => {
                  setModalShow(false);
                  getTechnologies();
                  getDomains();
                  getCompanies();
                  setSelectedRow();
                  setIsRowSelected(false);
                }}
              />
            </Box>
          ) : null}
          <Tabs
            className="users-tab mt-3"
            defaultActiveKey="technology"
            onSelect={(eventKey) => {
              setTabkey(eventKey);
              setSelectedRow(null);
            }}
          >
            <Tab title="Technology/Skill" eventKey="technology">
              <Row>
                <Col lg={3}></Col>
                <Col lg={6}>
                  <TechnologyForm
                    label="Technology/Skill"
                    buttonName="Add Technolgy"
                    placeholder="Technology Name"
                    selectedRow={selectedRow} // Pass the selectedRow prop
                    type="technology"
                    eventKey="technology"
                    size1="5"
                    size2="7"
                  />
                  <DataTableComponent
                    columns={technologyColumns}
                    data={techData}
                    selectableRows={true}
                    className="Header-color config-table"
                    fixedHeader={true}
                    // onSelectedRowsChange={handleRowSelected}
                    noDataComponent={
                      <CustomNoData
                        title="No technologies to show"
                        subtitle=" Technologies added will be listed here."
                      />
                    }
                  />
                </Col>
                <Col lg={3}></Col>
              </Row>
            </Tab>
            <Tab title="Domain" eventKey="domain">
              <Row>
                <Col lg={3}></Col>
                <Col lg={6}>
                  <TechnologyForm
                    label="Domain"
                    buttonName="Add Domain"
                    placeholder="Domain Name"
                    selectedRow={selectedRow} // Pass the selectedRow prop
                    deleteRow={deleteRow}
                    type="technology"
                    eventKey="technology"
                  />
                  <DataTableComponent
                    columns={domainColumns}
                    data={domainData}
                    selectableRows={true}
                    // onSelectedRowsChange={handleRowSelected}
                    fixedHeader={true}
                    className="config-table "
                    noDataComponent={
                      <CustomNoData
                        title="No domains to show"
                        subtitle=" Domains added will be listed here."
                      />
                    }
                  />
                </Col>
                <Col lg={3}></Col>
              </Row>
            </Tab>
            <Tab title="Companies" eventKey="companies">
              <Row>
                <Col lg={3}></Col>
                <Col lg={6}>
                  <TechnologyForm
                    label="Company"
                    buttonName="Add Company"
                    placeholder="Company Name"
                    selectedRow={selectedRow} // Pass the selectedRow prop
                    deleteRow={deleteRow}
                    eventKey="companies"
                    type="company"
                  />
                  <DataTableComponent
                    columns={companyColumns}
                    data={companyData}
                    selectableRows={true}
                    fixedHeader={true}
                    className="config-table "
                    noDataComponent={
                      <CustomNoData
                        title="No companies to show"
                        subtitle=" Companies added will be listed here."
                      />
                    }
                  />
                </Col>
                <Col lg={3}></Col>
              </Row>
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
}

export default Configure;

const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">{props?.title}</h5>
      <p className="fs-6 mb-3 text-secondary">{props?.subtitle}</p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};