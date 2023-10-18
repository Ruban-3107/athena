import './BatchDetails.css';
import { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Form,
  InputGroup,
  Container,
  FormGroup,
} from 'react-bootstrap';
import {
  FormFieldRow,
  ButtonComponent,
  DatePickerIcon,
  Box,
  Span,
  ReactSelect,
} from '@athena/web-shared/ui';
import Select from 'react-select';
import {
  useFormContext,
  useForm,
  Controller,
  useFormState,
} from 'react-hook-form';
import { toast } from 'react-toastify';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { apiRequest, create_batch_validations } from '@athena/web-shared/utils';
import DatePicker from 'react-datepicker';
import { LoadingIndicator } from 'react-select';

export const BatchDetails = (props) => {
  console.log("props:::", props)
  const [corporateGroup, setCorporateGroup] = useState(null);
  const [clientRepList, setClientRepList] = useState([]);
  const [clientRep, setClientRep] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [trainFacilList, setTrainFacilList] = useState([]);
  const [trainFacilitator, setTrainFacilitator] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const methods = useFormContext();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { errors } = useFormState();

  const [Totalpage, setTotalpage] = useState('');
  const [isClearable, setIsClearable] = useState(true);

  useEffect(() => {
    getClients();
    getTrainingFacilitator();
  }, []);

  useEffect(() => {
    console.log('wwwwwwwwww', errors, methods);
  }, [errors]);

  useEffect(() => {
    if (props?.data) {
      setStartDate(props?.data?.start_date);
      setEndDate(props?.data?.end_date);
    } else {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }, [props.data]);

  useEffect(() => {
    setStartDate(methods.getValues('start_date'));
    setEndDate(methods.getValues('end_date'));
  }, [startDate, endDate]);

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getClients = async () => {
    const clientResponse = await apiRequest(
      'api/users/clients/getClients',
      'POST'
    );
    console.log('clientResponse', clientResponse);
    if (clientResponse?.status === 'success') {
      const clientData = clientResponse?.value?.clientData?.rows.map((x) => {
        return {
          id: x.id,
          name: x.corporate_group,
        };
      });
      console.log('uiuiuiiuuiiuiuiuiuiu', clientData);
      // console.log("kkkkkkkkkkkkkkkkk", JSON.stringify(data1));
      // setTotalItems(clientResponse.value?.clientData?.totalItems);
      setClientList(clientData);
      // setFilteredUserData(batchData);
    } else {
      toast.error(clientResponse?.message.message);
    }
  };

  const loadOptions = async (inputValue, callback) => {
    // console.log(inputValue, "ttttt")
    setIsLoading(true);
    let data = {};
    try {
      data['pageNo'] = page;
      data['size'] = pageSize;
      const clientResponse = await apiRequest(
        'api/users/clients/getClients',
        'POST',
        data
      );
      console.log('clientResponse', clientResponse);
      if (clientResponse?.status === 'success') {
        const clientData = clientResponse?.value?.clientData?.rows.map((x) => {
          return {
            id: x.id,
            name: x.corporate_group,
          };
        });
        {
          console.log(clientData, 'clientdata');
        }
        if (clientResponse) {
          setOptions([...options, ...clientData]);
          setTotalpage(clientResponse?.value?.clientData?.totalPages);
        } else {
          setOptions([...options]);
        }
        callback(clientResponse);
        setIsLoading(false);
      } else {
        toast.error(clientResponse?.message.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  // const handleInputChange = (newValue) => {
  //   if (newValue.length === 0) {
  //     setPage(1);

  //     setOptions([...options]);
  //   }
  // };

  const handleMenuScrollToBottom = () => {
    if (page < Totalpage) {
      setPage(page + 1);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page >= 1) {
      loadOptions('', () => { });
    }
  }, [page]);

  const getClientRep = async (id) => {
    console.log('sssssss', id);
    const repResponse = await apiRequest(
      `api/users/client/${id}/Client Representative`,
      'POST'
    );
    console.log('repResponse', repResponse);
    if (repResponse?.status === 'success') {
      const repData = repResponse?.value?.userData?.map((x) => {
        return {
          id: x.id,
          name: `${toTitleCase(x.first_name)} ${toTitleCase(
            x.last_name ?? ' '
          )}`,
        };
      });
      console.log('uiuiuiiuuiiuiuiuiuiu', repData);
      setClientRepList(repData);
    } else {
      toast.error(repResponse?.message.message);
    }
  };

  const getTrainingFacilitator = async () => {
    const repResponse = await apiRequest(
      `api/users/trainingfacilitator`,
      'GET'
    );
    console.log('trainresp', repResponse);
    if (repResponse?.status === 'success') {
      const repData = repResponse?.value?.userData?.map((x) => {
        return {
          id: x.id,
          name: `${toTitleCase(x.first_name)} ${toTitleCase(
            x.last_name ?? ' '
          )}`,
        };
      });
      console.log('uiuiuiiuuiiuiuiuiuiu', repData);
      setTrainFacilList(repData);
    } else {
      toast.error(repResponse?.message.message);
    }
  };

  const handleCorporateGroup = (selected) => {
    methods.setValue('corporate_group', selected);
    console.log('ssssssss', selected);
    // setCorporateId(selected.id)
    setCorporateGroup(selected);
    getClientRep(selected?.id);
  };
  const Spinner = () => (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading</span>
    </div>
  );
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '4px',
      border: state.isFocused ? '2px solid #0077c2' : '2px solid #ccc',
      boxShadow: 'none',
    }),
  };
  const formatOptionLabel = (option) => {
    if (isLoading) {
      return <Spinner />;
    } else {
      return option.name;
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col className="">
          <Form>
            <Form.Group controlId="name" className="mb-3">
              <FormFieldRow
                size="md"
                size1="2"
                size2="10"
                name="batch_name"
                type="input"
                inputRef={methods.register('batch_name')}
                onChange={(e) => {
                  methods.setValue('batch_name', e.target.value);

                  const batchName = e.target.value;
                  const regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

                  if (batchName.length >= 2 && batchName.length <= 20 && regex.test(batchName)) {
                    methods.clearErrors('batch_name');
                  } else {
                    if (batchName.length < 2) {
                      methods.setError('batch_name', {
                        type: 'manual',
                        message: create_batch_validations.batch_name_min,
                      });
                    } else if (batchName.length > 20) {
                      methods.setError('batch_name', {
                        type: 'manual',
                        message: create_batch_validations.batch_name_max,
                      });
                    } else {
                      methods.setError('batch_name', {
                        type: 'manual',
                        message: create_batch_validations.batch_name_valid,
                      });
                    }
                  }
                }}
                //  error={errors.batch_name && true}
                error={errors.batch_name}
                label="Batch Name *"
                labelClassName="batchclass"
                placeholder="Title here"
                className="requiredd"
              />
            </Form.Group>

            <Form.Group>
              <FormFieldRow
                size="md"
                size1="2"
                size2="10"
                type="textarea"
                rows="5"
                labelClassName="batchclass"
                label="Description *"
                name="description"
                inputRef={methods.register('description')}
                onChange={(e) => {
                  methods.setValue('description', e.target.value);
                  const description = e.target.value;
                  const regex = /^[A-Za-z,.]+(?: [A-Za-z,.]+)*$/;
                  if (description.length >= 10 && description.length <= 250 && regex.test(description)) {
                    methods.clearErrors('description');
                  } else {
                    if (description.length < 10) {
                      methods.setError('description', {
                        type: 'manual',
                        message: create_batch_validations?.description_min,
                      });
                    }
                    else if (description.length > 250) {
                      methods.setError('description', {
                        type: 'manual',
                        message: create_batch_validations?.description_max,
                      });
                    } else {
                      methods.setError('description', {
                        type: 'manual',
                        message: create_batch_validations.description_valid,
                      });
                    }
                  }

                }}
                error={errors.description}
                placeholder="Description here"
              />
            </Form.Group>
            <Row>
              <Col className="mt-3" lg={6}>
                <Row className="">
                  <Col lg="4">
                    <label for="TopicType" className="mt-1">
                      Corporate Group *
                    </label>
                  </Col>
                  <Col lg="8">
                    <Box>
                      <Controller
                        name="corporate_group"
                        control={methods.control}
                        //rules={{ required: true }}
                        // error={errors.corporate_gr}
                        render={({ field }) => (
                          <Select
                            // formatOptionLabel={formatOptionLabel}
                            placeholder="Please select"
                            {...field}
                            hideSelectedOptions={false}
                            isClearable={isClearable}
                            isLoading={isLoading}
                            styles={customStyles}
                            // onInputChange={handleInputChange}
                            onMenuScrollToBottom={handleMenuScrollToBottom}
                            value={corporateGroup}
                            options={options}
                            onChange={(selected) => {
                              if (selected === null) {
                                methods.setValue('client_representative', null);
                              }
                              props?.clearUser();
                              // console.log(methods.getValues(), 'ppppp');
                              // if (methods.getValues('initial_selected_users')?.length > 0) {
                              //   methods.setValue('initial_selected_users', '');
                              //   methods.setValue('initial_selected_userObjects', '');
                              //   methods.setValue('final_users', '');
                              // }
                              methods.setValue('corporate_group', selected);
                              methods.clearErrors('corporate_group');
                              console.log('gggggg', selected, methods.getValues());
                              setCorporateGroup(selected);
                              getClientRep(selected?.id);
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                          />
                        )}
                      />
                      {errors.corporate_group && (
                        <p className="invalid-feedback">
                          {errors.corporate_group?.message ||
                            errors.corporate_group?.name.message}
                        </p>
                      )}
                    </Box>
                  </Col>
                </Row>
              </Col>
              <Col className="mt-3" lg={6}>
                <Row className="">
                  <Col lg="4">
                    <label for="TopicType" className=" mt-1">
                      Client Representative
                    </label>
                  </Col>
                  <Col lg="8">
                    <Box>
                      <Controller
                        name="client_representative"
                        control={methods.control}
                        render={({ field }) => (
                          <Select
                            placeholder="Please select"
                            {...field}
                            hideSelectedOptions={false}
                            isClearable={isClearable}
                            isDisabled={corporateGroup == null}
                            // value={selectedClients}
                            options={clientRepList}
                            onChange={(selected) => {
                              methods.setValue(
                                'client_representative',
                                selected
                              );
                              console.log('gggggg', selected);
                              setClientRep(selected);
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                          />
                        )}
                      />
                      {errors.client_representative && (
                        <p className="invalid-feedback">
                          {errors.client_representative?.message ||
                            errors.client_representative?.name.message}
                        </p>
                      )}
                    </Box>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="mt-3" lg={6}>
                <Row className="">
                  <Col lg="4">
                    <label for="TopicType" className="mt-1">
                      Training Facilitator
                    </label>
                  </Col>
                  <Col lg="8">
                    <Box>
                      <Controller
                        name="training_facilitator"
                        control={methods.control}
                        render={({ field }) => (
                          <Select
                            placeholder="Please select"
                            {...field}
                            hideSelectedOptions={false}
                            isClearable={isClearable}
                            // value={selectedClients}
                            options={trainFacilList}
                            onChange={(selected) => {
                              methods.setValue(
                                'training_facilitator',
                                selected
                              );
                              console.log('eeeee', selected);
                              setTrainFacilitator(selected);
                            }}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                          />
                        )}
                      />
                      {errors.training_facilitator &&
                        trainFacilitator == null && (
                          <p className="invalid-feedback">
                            {errors.training_facilitator?.message ||
                              errors.training_facilitator?.name.message}
                          </p>
                        )}
                    </Box>
                  </Col>
                </Row>
              </Col>
              <Col className="mt-3" lg={6}>
                <FormGroup className="date-column" size="sm">
                  <Col className="first">
                    <Form.Label className="inputgroup mt-1">
                      {' '}
                      Start Date * - End Date
                    </Form.Label>
                  </Col>
                  <Col lg={8} className="second">
                    <div className="gap-3" style={{ display: 'inline-flex' }}>
                      <Box className="ms-xl-3">
                        <DatePicker
                          className="rounded-3 date-flied"
                          selected={startDate}
                          value={startDate}
                          minDate={new Date()}
                          onChange={(date) => {
                            setStartDate(date);
                            methods.setValue('start_date', date);
                            methods.clearErrors('start_date');
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="DD/MM/YYYY"
                          icon={DatePickerIcon}
                        />
                        {errors.start_date && (
                          <p className="invalid-feedback">
                            {errors.start_date?.message ||
                              errors.start_date?.name.message}
                          </p>
                        )}
                      </Box>
                      <Box>
                        <h4 className="dash m-0">-</h4>
                      </Box>
                      <Box>
                        <DatePicker
                          className="rounded-3 date-flied"
                          selected={endDate}
                          value={endDate}
                          minDate={new Date(startDate)}
                          onChange={(date) => {
                            setEndDate(date);
                            methods.setValue('end_date', date);
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="DD/MM/YYYY"
                        />
                      </Box>
                    </div>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end g-2 mt-5"></Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default BatchDetails;

