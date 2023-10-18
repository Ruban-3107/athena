import './CreateCorporate.css';
import {
  Form,
  Row,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Spinner,
} from 'react-bootstrap';
import {
  apiRequest,
  useRouter,
  useLocation,
  useParams,
  create_corporate_validations,
} from '@athena/web-shared/utils';
// import { apiRequest } from '@athena/admin-web-shared/utils';
// eslint-disable-next-line @nx/enforce-module-boundaries
import Select, { components } from 'react-select';
import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import {
  DeleteIcon,
  FormFieldRow,
  ButtonComponent,
  Span,
  Box,
} from '@athena/web-shared/ui';
import { json, useSearchParams, Link } from 'react-router-dom';

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);
  // styles
  let bg = 'transparent';
  if (isFocused) bg = '#eee';
  if (isActive) bg = '#B2D4FF';
  const style = {
    alignItems: 'center',
    backgroundColor: bg,
    color: 'inherit',
    gap: '10px',
    display: 'flex',
  };

  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
      className="choose"
    >
      {' '}
      <input type="checkbox" checked={isSelected} className="options" />{' '}
      {children}
    </components.Option>
  );
};

const CreateCorporateSchema = yup.object().shape({
  corporate_group: yup
    .string()
    .required(create_corporate_validations?.corporate_group)
    .min(3, create_corporate_validations?.corporate_group_min)
    .max(30, create_corporate_validations?.corporate_group_max)
    .matches(/^\s*\S.*[A-Za-z0-9]*$/, 'Invalid company name'),
  company_name: yup
    .string()
    .required(create_corporate_validations?.company_name),
    // .min(3, create_corporate_validations?.company_name_min)
    // .max(30, create_corporate_validations?.company_name_max)
    // .matches(/^\s*\S.*[A-Za-z0-9]*$/, 'Invalid company name'),
  address_line_1: yup.string(),
  // .required('Address Line is required'),
  // .min(3, 'Address Line should be min 3 characters')
  // .max(15, 'Address Line should be max 15 characters'),
  // .matches(/^[a-zA-Z0-9 !@#$%^&*()-]{3,20}$/, 'Invalid address line'),
  address_line_2: yup.string(),
  // .min(3, 'address_line_2 should be min 3 characters')
  // .max(15, 'address_line_2 should be max 15 characters'),
  // .matches(/^[a-zA-Z0-9 !@#$%^&*()-]{3,20}$/, 'Invalid address line'),
  state: yup.string().optional(),
  // .required()
  // .matches(
  //   /^\s*\S.*[a-zA-Z]{2,20}$/,
  //   'State is required and must contain alphabets'
  // )
  // .required('Please select any one state'),
  country: yup.string().optional(),
  // .required()
  // .matches(
  //   /^\s*\S.*[a-zA-Z]{2,20}$/,
  //   'Country is required and must contain alphabets'
  // )
  // .required('Please select any one Country'),
  contact_details: yup.array().of(
    yup.object().shape({
      first_name: yup
        .string()
        .required(create_corporate_validations?.first_name)
        .min(3, create_corporate_validations?.first_name_min)
        .max(30, create_corporate_validations?.first_name_max)
        .matches(/^\s*\S.*[a-zA-Z]{2,30}$/, 'Invalid First Name'),
      last_name: yup
        .string()
        .required(create_corporate_validations?.last_name)
        .min(3, create_corporate_validations?.last_name_min)
        .max(30, create_corporate_validations?.last_name_max)
        .matches(/^\s*\S.*[a-zA-Z]{0,30}$/, 'Invalid Last Name '),
      primary_email: yup
        .string()
        .required(create_corporate_validations?.primary_email_ID)
        .max(250, create_corporate_validations?.primary_email_ID_max)
        .matches(
          /^\s*\S.*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          'Invalid email address'
        ),
      secondary_email: yup
        .string()
        .max(250, create_corporate_validations?.primary_email_ID_max)
        .matches(
          /^(?:\s*\S.*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})?$/i,
          'Invalid email address'
        ),
      phone_number: yup
        .string()
        .required(create_corporate_validations?.mobile_number)
        .matches(
          /^(\+?\d{1,3}[- ]?)?\d{12}$/,
          create_corporate_validations?.mobile_number_max
        ),
      is_primary: yup.boolean(),
    })
  ),
});

const StateOptions = [
  { id: '1', name: 'TamilNadu' },
  { id: '2', name: 'Hyderabad' },
  { id: '3', name: 'Karnataka' },
  { id: '4', name: 'Kerala' },
  { id: '5', name: 'Andhra Pradesh' },
  { id: '6', name: 'Gujarat' },
];

const CountryOptions = [
  { id: '1', name: 'India' },
  { id: '2', name: 'United-States' },
];

export const CreateCorporate = (props) => {
  const router = useRouter();
  const params = useParams();
  const location = useLocation();
  const [schema, setSchema] = useState(CreateCorporateSchema);
  const [selectedStateType, setselectedStateType] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [selectedCountryType, setselectedCountryType] = useState(null);
  const [CorporateData, setCorporateData] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [key, setKey] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [pending, setPending] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  console.log('propsss::::', props);
  console.log('locationnnnn::::', location);
  console.log('&&&&phoneNumber&&&&', phoneNumber);

  const { id } = params;
  // console.log(clientId,"paramssssssssssss");

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    getValues,
    setError,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contact_details: [
        {
          first_name: '',
          last_name: '',
          primary_email: '',
          secondary_email: '',
          phone_number: '',
          is_primary: true,
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact_details',
  });

  useEffect(() => {
    console.log(errors, 'errorssssssss');
  }, [errors]);

  // To get the corporate list by ID
  const getCorporateById = async () => {
    setPending(true);
    const corporateIdDetails = await apiRequest(`api/users/clients/${id}`);
    console.log('$$$$corporateIdDetails;;;;;', corporateIdDetails);
    setCorporateData(corporateIdDetails?.value);
    setPending(false);
  };
  console.log('CorporateUserData', CorporateData?.value);

  useEffect(() => {
    if (CorporateData) {
      console.log('CorporateDataaaaaa', CorporateData);

      const filteredData = { ...CorporateData };
      delete filteredData.id;
      delete filteredData.primary_email;
      delete filteredData.primary_contact;
      delete filteredData.website_url;
      delete filteredData.city;
      delete filteredData.pincode;
      delete filteredData.created_by;
      delete filteredData.updated_by;
      delete filteredData.is_active;
      delete filteredData.createdAt;
      delete filteredData.updatedAt;
      delete filteredData.deletedAt;
      delete filteredData.clientUsers;
      console.log('CorporateDataaaaaa', filteredData, CorporateData);
      const hasState = 'state' in CorporateData;
      console.log('@@@@@@hasState:::::', hasState);
      for (const key in filteredData) {
        console.log('tttttttt', key, filteredData[key]);
        setValue(key, filteredData[key]);
        if (key === 'state') {
          console.log('logggggggggggggggggggg', CorporateData['state']);
          setselectedStateType(
            StateOptions.find((e) => e.name === CorporateData['state'])
          );
          setValue('state', CorporateData['state']);
        }
        if (key === 'country') {
          const countryValue = filteredData[key];
          setValue(key, countryValue);
          setselectedCountryType(
            CountryOptions.find((e) => e.name === CorporateData['country'])
          );
          setValue('country', CorporateData['country']);
        }
         if (key === 'company_name') {
           setSelectedCompany(
             companyData.find(
               (e) => e.name.toLowerCase() === CorporateData['company_name']
             )
           );
           setValue('company_name', CorporateData['company_name']);
         }
        if (key === 'contact_details') {
          filteredData.contact_details.forEach((contact, index) => {
            const contactFieldName = `contact_details.${index}`;
            for (const contactKey in contact) {
              setValue(
                `${contactFieldName}.${contactKey}`,
                contact[contactKey]
              );
            }
          });
        }
      }
    }
  }, [CorporateData, key]);

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
        // setIsLoading(false);
      } catch {
        console.log();
        // setIsLoading(false);
      }
  };
    useEffect(() => {
        getCompanies();
    }, []);

  // {
  //   id
  //   ? useEffect(() => {
  //       if(CorporateData?.value){
  //         for(const key in CorporateData?.value){
  //           if (key === 'corporate_group') {
  //             setValue(key, CorporateData?.value[key] ? CorporateData?.value[key] : '');
  //           }
  //           if (key === 'address_line_1') {
  //             setValue(key, CorporateData?.value[key] ? CorporateData?.value[key] : '');
  //           }
  //           if (key === 'state') {
  //             setselectedStateType(
  //               StateOptions.find((e) => e.name === CorporateData?.value[key])
  //             );
  //             setValue('state',StateOptions.find((e) => e.id === CorporateData?.value[key]));
  //           }
  //           if (key === 'country') {
  //             setselectedCountryType(
  //               CountryOptions.find((e) => e.name === CorporateData?.value[key])
  //             );
  //             setValue('country',CountryOptions.find((e) => e.id === CorporateData?.value[key]));
  //           }
  //           if (key === 'first_name') {
  //             setValue(key, CorporateData?.value[key] ? userData?.value[key] : '');
  //           }
  //           if (key === 'last_name') {
  //             setValue(key, CorporateData?.value[key] ? userData?.value[key] : '');
  //           }
  //           if (key === 'primary_email') {
  //             setValue(key, CorporateData?.value[key] ? userData?.value[key] : '');
  //           }
  //           if (key === 'secondary_email') {
  //             setValue(key, CorporateData?.value[key] ? userData?.value[key] : '');
  //           }
  //           if (key === 'phone_number') {
  //             setValue(key, CorporateData?.value[key] ? userData?.value[key] : '');
  //           }
  //         }
  //       }
  //   }, [CorporateData?.value])
  //   : ' ' ;
  // }
  useEffect (() => {
    console.log(getValues, 'PPPPPP');
  },[])

  const onSubmitData = async () => {
    const values = getValues();
    for (let key in values) {
      if (typeof values[key] === 'undefined') {
        values[key] = null;
      } else if (typeof values[key] === 'object' && values[key] !== null) {
        for (let nestedKey in values[key]) {
          if (typeof values[key][nestedKey] === 'undefined') {
            values[key][nestedKey] = null;
          }
        }
      }
    }
    setPending(true);
    console.log('llllllllll', values);
    let getError = await trigger();
    console.log('ggetErrrorr', getError);

    delete values['is_primary'];
    console.log('****************** getting Valuessssssss', values);

    if (getError === false) {
      console.log('uiuiuiuiiu', values);
    }

    if (!id && getError === true) {
      const addRowResponses = await apiRequest(
        'api/users/clients/createClient',
        'POST',
        values
      );
      console.log('@@@@@@addRowResponses@@@@@@@@@', addRowResponses);
      if (addRowResponses && addRowResponses?.status === 'success') {
        setPending(false);
        setPhoneNumber('+91');
        toast.success('Corporate created successfully!');
        reset();
        setErrorMsg([]);
        setselectedStateType(null);
        setselectedCountryType(null);
        setSelectedCompany(null);
      } else{
        setPending(false);
      }
      // console.log('error:::::::');
      // toast.error(`${addRowResponses?.message} Please check All Fields`);
      if (
        addRowResponses?.message &&
        typeof addRowResponses?.message === 'string'
      ) {
        toast.error(
          addRowResponses.message
            ? addRowResponses.message
            : addRowResponses.message
        );
      } else if (
        addRowResponses?.message &&
        Array.isArray(addRowResponses?.message)
      ) {
        setErrorMsg(addRowResponses.message);
      }
    } else if (id && getError === true) {
      const Updateresponses = await apiRequest(
        `api/users/clients/updateClient/${id}`,
        'PUT',
        values
      );
      console.log('updateresponses@@@', Updateresponses);
      if (Updateresponses && Updateresponses?.status === 'success') {
        setPending(false);
        toast.success('Corporate updated successfully!');
      } else {
        if (
          Updateresponses?.message &&
          typeof Updateresponses?.message === 'string'
        ) {
          toast.error(
            Updateresponses.message.message
              ? Updateresponses.message.message
              : Updateresponses.message
          );
          setPending(false);
        } else if (
          Updateresponses?.message &&
          Array.isArray(Updateresponses?.message)
        ) {
          setErrorMsg(Updateresponses.message);
          setPending(false);
        }
      }
    }

    // else {
    //   toast.warning('please fill all the details');
    // }
  };

  const handleClick = () => {
    if (id) {
      router.navigate(`/app/managecorporate`);
    }
    reset();
    setPending(false);
    setErrorMsg([]);
    setselectedStateType(null);
    setselectedCountryType(null);
    setValue('corporate_group', '');
    setValue('company_name', '');
    setSelectedCompany(null);
    setValue('address_line_1', '');
    setValue('address_line_2', '');
    setValue('state', '');
    setValue('country', '');
    setValue('contact_details[0].first_name', '');
    setValue('contact_details[0].last_name', '');
    setValue('contact_details[0].primary_email', '');
    setValue('contact_details[0].secondary_email', '');
    setValue('contact_details[0].phone_number', '');
  };

  useEffect(() => {
    if (id) {
      getCorporateById();
    }else{
      handleClick();
    }
  }, [id]);

  const handleStateChange = (selected) => {
    setValue('state', selected?.name);
    setselectedStateType(selected);
  };

  const handleCountryChange = (selected) => {
    setValue('country', selected?.name);
    setselectedCountryType(selected);
  };

  const handleCheck = (value, index) => {
    if (value === true) {
      setValue(`contact_details.${index}.is_primary`, value);
      fields.map((field, i) => {
        if (index != i) {
          setValue(`contact_details.${i}.is_primary`, false);
        }
      });
    } else {
      setValue(`contact_details.${index}.is_primary`, true);
      toast.warning('Atleast one should be a primary contact!');
    }
  };
 const handleCompanyChange = (selected) => {
   setValue('company_name', selected?.name);
   setSelectedCompany(selected);
 };
  

  const handlePhoneNumberChangetwo = async (index, fieldname, phone) => { 
    console.log("tttttttttt", index, fieldname, phone);
    const phoneValue = phone?.replace(/-/g, '');
    console.log('phoneNUMBERrrrrrrrrrrrrrrrrrr', phoneValue);
    const currentValues = getValues();
    console.log("tttttttttttt",`contact_details[${index}][${fieldname}]`, currentValues);
    currentValues.contact_details[index][fieldname] = phoneValue;
    const a = JSON.parse(JSON.stringify(currentValues.contact_details))
    setValue('contact_details', a);
    console.log("ggggggggggg", currentValues.contact_details, getValues('contact_details'));
  }

  const handlePhoneNumberChange = async (index, fieldname, phone) => {
    const phoneValue = phone?.replace(/-/g, '');
    // console.log('phoneNUMBERrrrrrrrrrrrrrrrrrr', phoneValue,getValues());
    // const currentValues = JSON.parse(JSON.stringify(getValues()));
    // currentValues.contact_details[index][fieldname] = phoneValue;
    // console.log("rrrrrrrrrrrrr",getValues(),currentValues);
    // const a = JSON.parse(JSON.stringify(currentValues.contact_details));
    // console.log("aaaaaaaaaaaaaaaa",a)
    // setValue('contact_details', a);
    // console.log(
    //   'ssfdsfdsfs',
    //   phoneValue.length,
    //   typeof phoneValue,
    //   getValues('contact_details')
    // );
    setValue(`contact_details.${index}.phone_number`, phoneValue);
    if (phoneValue.length === 2) {
      await setError(`contact_details[${index}].phone_number`, {
        type: 'required',
        message: 'Please enter a valid phone number',
      });
    } else if (phoneValue.length >= 2 && phoneValue.length <= 11) {
      await setError(`contact_details[${index}].phone_number`, {
        type: 'validation',
        message: 'Please enter a valid phone number',
      });
    } else {
      clearErrors(`contact_details[${index}].phone_number`);
    }
    console.log('rrrrrrrrrr', errors);
  };

  useEffect(() => {
    console.log('getValuesgetValues:::', getValues());
  }, [getValues()]);

  return (
    <Form onSubmit={handleSubmit(onSubmitData)}>
      <Box className="corporate-line">
        <div>
          <hr className="linecorp-1"></hr>
        </div>
        <Span className="px-3 ms-2 primarycorp-txt">
          CORPORATE GROUP DETAILS
        </Span>
        <hr className="secondcorp-line"></hr>
      </Box>

      {/* </Col> */}

      <Row>
        <Col lg={11} className="p-3 ms-4">
          <Row className="AddUser-row">
            <Col lg={6}>
              <Form.Group controlId="name" className="mb-3">
                <FormFieldRow
                  size="md"
                  size1="4"
                  size2="8"
                  name="corporate_group"
                  type="input"
                  inputRef={register('corporate_group')}
                  error={errors.corporate_group}
                  label="Corporate Group *"
                  labelClassName="req"
                  className="requiredd"
                />
              </Form.Group>
            </Col>
            <Col>
              <Row>
                <Col lg="4" md="4">
                  <label for="company_name" className="req mb-3">
                    Company Name *
                  </label>
                </Col>
                <Col lg="8" md="8">
                  <Controller
                    // size1="4"
                    // size2="8"
                    // size="md"
                    control={control}
                    name="company_name"
                    render={({ field: { onChange, value } }) => (
                      <Select
                        placeholder="Please select"
                        // {...field}
                        // isSearchable={true}
                        isClearable={isClearable}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        value={selectedCompany}
                        inputRef={register('company_name')}
                        options={companyData}
                        onChange={(selected) => {
                          //  setValue('company_name', selected?.name);
                          setSelectedCompany(selected);
                          onChange(selected?.name);
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        error={errors.company_name}
                        styles={{
                          menu: (styles) => ({ ...styles, zIndex: '100' }),
                        }}
                      />
                    )}
                  />
                  {errors.company_name?.message && selectedCompany == null && (
                    <p className="invalid-feedback">
                      {errors.company_name?.message ||
                        errors.company_name?.name.message}{' '}
                    </p>
                  )}
                </Col>
              </Row>
            </Col>
            {/* <Col lg={6}>
              <Form.Group controlId="name" className="mb-3 position-relative">
                <FormFieldRow
                  size="md"
                  size1="4"
                  size2="8"
                  name="company_name"
                  type="input"
                  inputRef={register('company_name')}
                  error={errors.company_name}
                  label="Company Name *"
                  labelClassName="req"
                  className="requiredd"
                />
              </Form.Group>
            </Col> */}
          </Row>
          <Row className="AddUser-row mb-4">
            <Col lg={6}>
              <Form.Group controlId="name" className="space">
                <FormFieldRow
                  size1="4"
                  size2="8"
                  size="md"
                  name="address_line_1"
                  type="input"
                  inputRef={register('address_line_1')}
                  error={errors.address_line_1}
                  label="Address line 1"
                  labelClassName="req"
                  className="requiredd"
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group controlId="name" className="space">
                <FormFieldRow
                  size1="4"
                  size2="8"
                  size="md"
                  name="address_line_2"
                  type="input"
                  inputRef={register('address_line_2')}
                  //error={errors.address_line_2}
                  label="Address line 2"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="AddUser-row mt-3">
            <Col lg={6}>
              <Row>
                <Col lg="4" md="4">
                  <label for="staticEmail" className="req mb-3">
                    State
                  </label>
                </Col>
                <Col lg="8" md="8">
                  <Controller
                    // size1="4"
                    // size2="8"
                    // size="md"
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <Select
                        placeholder="Please select"
                        {...field}
                        // isSearchable={true}
                        isClearable={isClearable}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        value={selectedStateType}
                        inputRef={register('state')}
                        options={StateOptions}
                        onChange={handleStateChange}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        error={errors.state}
                        styles={{
                          menu: (styles) => ({ ...styles, zIndex: '100' }),
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Col>
            {/* </Row>
            </Col> */}
            <Col lg={6}>
              <Row>
                <Col lg="4" md="4">
                  <label for="staticEmail" className="req mb-3">
                    Country
                  </label>
                </Col>
                <Col lg="8" md="8">
                  <Controller
                    size1="4"
                    size2="8"
                    size="md"
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <Select
                        placeholder="Please select"
                        isSearchable={true}
                        {...field}
                        isClearable={isClearable}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={true}
                        value={selectedCountryType}
                        inputRef={register('country')}
                        options={CountryOptions}
                        onChange={handleCountryChange}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        error={errors.country}
                        styles={{
                          menu: (styles) => ({ ...styles, zIndex: '100' }),
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* PERSONAL CONTACT DETAILS */}

      {fields.map((item, index) => (
        <>
          <div className="contact-line">
            <hr className=""></hr>

            <div>
              <Span className="primary-txt">PRIMARY CONTACT DETAILS</Span>
            </div>
            <div>
              <hr className=""></hr>
            </div>
            <div className="d-flex px-4 ms-0">
              <Form.Check
                type="switch"
                id="custom-switch"
                // label="Check this switch"
                {...register(`contact_details.${index}.is_primary`)}
                // checked={getValues(`contact_details.${index}.is_primary`)}
                className=""
                // disabled={true}
                onChange={(e) => {
                  // setValue(`contact_details.${index}.is_primary`, item.is_primary);
                  handleCheck(e.target.checked, index);
                }}
              />
              <Form.Label className="FormLabe">Primary Contact</Form.Label>
            </div>
            <div>
              <hr className=""></hr>
            </div>
          </div>

          <Row>
            <Col lg={11} className="p-3 ms-4">
              <Row className="AddUser-row">
                <Col lg={6}>
                  <Form.Group controlId="name" className="mb-3">
                    {console.log('index::::::::::::::::::::1', index)}
                    <FormFieldRow
                      size="md"
                      size1="4"
                      size2="8"
                      type="input"
                      inputRef={register(
                        `contact_details[${index}].first_name`
                      )}
                      // error={
                      //   errors?.contact_details?.[0]?.first_name
                      //     ? 'FistName should not be empty'
                      //     : null
                      // }
                      error={
                        errors?.contact_details?.length > 0 &&
                        errors?.contact_details[index]?.first_name
                      }
                      label="First Name *"
                      labelClassName="req"
                      className="requiredd"
                      // name='first_name'
                      name={`contact_details[${index}].first_name`}
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group
                    controlId="name"
                    className="mb-3 position-relative"
                  >
                    <FormFieldRow
                      size="md"
                      size1="4"
                      size2="8"
                      type="input"
                      inputRef={register(`contact_details[${index}].last_name`)}
                      // error={
                      //   errors?.contact_details?.[index]?.last_name
                      //     ? 'LastName should not be empty'
                      //     : null
                      // }
                      error={
                        errors?.contact_details?.length > 0 &&
                        errors?.contact_details[index]?.last_name
                      }
                      label="Last Name *"
                      labelClassName="req"
                      // name='last-name'
                      name={`contact_details[${index}].last_name`}
                      //className="requiredd"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="AddUser-row">
                <Col lg={6}>
                  <Form.Group controlId="name" className="mb-3">
                    <FormFieldRow
                      size="md"
                      size1="4"
                      size2="8"
                      type="input"
                      inputRef={register(
                        `contact_details[${index}].primary_email`
                      )}
                      // error={
                      //   errors?.contact_details?.[index]?.primary_email
                      //     ? 'Email should not be empty'
                      //     : null
                      // }
                      label="Primary Email ID *"
                      labelClassName="req"
                      className="requiredd"
                      name={`contact_details[${index}].primary_email`}
                      // name='primary_email'
                      error={
                        errors?.contact_details?.length > 0 &&
                        errors?.contact_details[index]?.primary_email
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group
                    controlId="name"
                    className="mb-3 position-relative"
                  >
                    <FormFieldRow
                      size="md"
                      size1="4"
                      size2="8"
                      type="input"
                      inputRef={register(
                        `contact_details[${index}].secondary_email`
                      )}
                      // error={
                      //   errors?.contact_details?.[index]?.secondary_email
                      //     ? 'SecondaryEmail should not be empty'
                      //     : null
                      // }
                      label="Secondary Email ID"
                      labelClassName="req"
                      className="requiredd"
                      name={`contact_details[${index}].secondary_email`}
                      error={
                        errors?.contact_details?.length > 0 &&
                        errors?.contact_details[index]?.secondary_email
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="AddUser-row mt-0 row">
                <Col lg={6}>
                  <Row>
                    <Col lg="4" md="4">
                      <label for="phone_number" className="req mb-3">
                        {' '}
                        Mobile Number *{' '}
                      </label>
                    </Col>{' '}
                    <Col lg="8" md="8">
                      <Controller
                        name={`contact_details.${index}.phone_number`}
                        control={control}
                        // rules={{ validate: validatePhoneNumber }}
                        defaultValue={null}
                        render={({ field }) => (
                          <PhoneInput
                            // {...field(`contact_details.${index}.phone_number`, { required: true })}
                            country={'in'}
                            onlyCountries={['in']}
                            placeholder=""
                            disableSearchIcon={true}
                            countryCodeEditable={false}
                            value={
                              getValues(`contact_details.${index}.phone_number`)
                                ? getValues(
                                    `contact_details.${index}.phone_number`
                                  )
                                : null
                                // setValue(
                                //   'contact_details.0.phone_number',
                                //   '+91' + getValues('contact_details.0.phone_number')
                                // )
                                
                            }
                            inputProps={{
                              name: `contact_details.${index}.phone_number`,
                              required: true,
                            }}
                            onChange={(phone) => {
                              console.log('qqqqqqqqqqq', phone, phone.length);
                              handlePhoneNumberChange(
                                index,
                                'phone_number',
                                phone
                              );
                            }}
                          />
                        )}
                      />
                      {/* <Form.Control.Feedback
                        type="invalid"
                        className="text-left"
                      > */}
                      {errors?.contact_details ? (
                        errors?.contact_details[index]?.phone_number ? (
                          <p className="mt-1 error-required">
                            {errors?.contact_details?.phone_number?.message ==
                            'phone_number must be a valid phone number for region undefined'
                              ? 'Mobile Number is required'
                              : errors?.contact_details[index]?.phone_number
                                  ?.message}
                          </p>
                        ) : null
                      ) : null}
                      {/* </Form.Control.Feedback> */}
                    </Col>
                  </Row>
                  {/* <Form.Group controlId="name" className="mb-3">
                    <FormFieldRow
                      size="md"
                      size1="4"
                      size2="8"
                      inputRef={register(`contact_details.${index}.phone_number`)}
                       // error={ // errors?.contact_details?.[index]?.phone_number
                       // ? 'PhoneNumber should not be empty'
                       // : null
                      // }
                      error={errors?.contact_details?.length > 0 && errors?.contact_details[index]?.phone_number}
                      type="input"
                      label="Mobile Number *"
                      labelClassName="req"
                      className="requiredd"
                      name={`contact_details[${index}].phone_number`}
                    />
                  </Form.Group> */}
                </Col>
              </Row>
              {fields && fields.length > 1 ? (
                <Row>
                  <Col
                    lg={12}
                    className="d-flex justify-content-end removeButton"
                  >
                    <Span className="mt-1 me-0">
                      <DeleteIcon />
                    </Span>{' '}
                    &nbsp;
                    <ButtonComponent
                      type="button"
                      className="removeButton text-dark"
                      variant="link"
                      size="md"
                      name="Remove Contact"
                      onClick={() => {
                        remove(index);
                        const remainingFields = getValues('contact_details');
                        const primaryIndex = remainingFields.findIndex(
                          (field) => field.is_primary === true
                        );
                        if (primaryIndex === -1 && remainingFields.length > 0) {
                          setValue('contact_details.0.is_primary', true);
                          setValue(
                            'contact_details.0.phone_number',
                            '+91' + getValues('contact_details.0.phone_number')
                          );
                        }
                      }}
                    ></ButtonComponent>
                  </Col>
                </Row>
              ) : null}
            </Col>
          </Row>
        </>
      ))}

      {/* </Row> */}
      <Row className="mt-2 mb-3">
        <Col lg={11} className="d-flex justify-content-end">
          <button
            className="buttonAdjustment"
            type="button"
            variant="link"
            onClick={() =>
              append({
                first_name: '',
                last_name: '',
                primary_email: '',
                secondary_email: '',
                phone_number: '',
                is_primary: false,
              })
            }
          >
            + Add More
          </button>
        </Col>
        &nbsp;&nbsp;&nbsp;
      </Row>

      <Col
        lg={8}
        className={errorMsg && errorMsg.length ? 'is-error' : 'error'}
      >
        {' '}
        {errorMsg && errorMsg.length
          ? errorMsg.map((msg, index) => (
              <p key={index} style={{ color: 'red' }}>
                {msg}
              </p>
            ))
          : null}{' '}
      </Col>
      <Col lg={11} className="btnxEditCorporate mt-1">
        <ButtonToolbar aria-label="Toolbar with button groups">
          <ButtonGroup className="me-3" aria-label="First group">
            <Button
              className="can-btn space1 rounded-4"
              type="button"
              onClick={handleClick}
              variant="outline-primary"
            >
              Cancel
            </Button>
          </ButtonGroup>
          <ButtonGroup className="me-0" aria-label="Second group">
            <Button
              className="create-btn rounded-4"
              type="submit"
              disabled={pending}
            >
              {pending ? (
                <Span className="d-flex align-items-center justify-content-center">
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden={true}
                    className="align-baseline"
                  >
                    <span className="sr-only"></span>
                  </Spinner>
                  &nbsp; Loading...
                </Span>
              ) : (
                <>Save</>
              )}
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </Col>
    </Form>
  );
};

export default CreateCorporate;
