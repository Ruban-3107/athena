import './AddUsers.css';
import { Form, Row, Col, Button, ButtonGroup, ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormFieldRow, Bulkfileupload, Loader } from '@athena/web-shared/ui';
import { useRouter, useLocation, useAuth } from '@athena/web-shared/utils';
import { apiRequest } from '@athena/web-shared/utils';
import Select, { components } from 'react-select';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { json, useSearchParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import Spinner from 'react-bootstrap/Spinner';
import { Span } from '@athena/web-shared/ui';
import { add_user_validations } from '@athena/web-shared/utils'
import Reactdropzone from '../../../../ui/src/lib/Reactdropzone/Reactdropzone';
import { Box, CrossIcon, DownloadIcon, QuestionMarkIcon } from '../../../../ui/src';

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
  // prop assignment
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


const addUserSchema = yup.object().shape({
  users_type: yup
    .object()
    .shape({
      name: yup.string().required(add_user_validations?.user_type),
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required(add_user_validations?.user_type),
  roles: yup
    .object()
    .shape({
      name: yup.string().required(add_user_validations?.user_role),
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required(add_user_validations?.user_role),
  first_name: yup
    .string()
    .required(add_user_validations?.first_name)
    .min(3, add_user_validations?.first_name_min)
    .max(30, add_user_validations?.first_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{2,30}$/, add_user_validations?.first_name),
  client_id: yup
    .object()
    // .shape({
    //   corporate_group: yup.string().max(255),
    // })
    .when('users_type.name', {
      is: (value) => value === 'Corporate',
      then: yup.object().shape({
        corporate_group: yup
          .string()
          .nullable()
          .required(add_user_validations?.corporate_group),
      }),
      otherwise: yup.object().shape({
        corporate_group: yup.string().nullable().max(255),
      }),
    })
    .nullable(), // for handling null value when clearing options via clicking "x" //.required('Corporate Group is required'),
  last_name: yup
    .string()
    .required(add_user_validations?.last_name)
    .min(1, add_user_validations?.last_name_min)
    .max(50, add_user_validations?.last_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{0,30}$/, add_user_validations?.last_name),
  email: yup.string().email('Invalid email').max(255).required(add_user_validations?.primary_email_ID),
  personal_email: yup.string().email('Invalid email').max(255, add_user_validations?.primary_email_ID_max).optional().nullable(),
  phone_number: yup
    .string()
    .matches(/^[0-9\s]{3,15}$/, add_user_validations?.mobile_number)
    .required(add_user_validations?.mobile_number),
});

const addUserbyClientRepSchema = yup.object().shape({
  first_name: yup
    .string()
    .required(add_user_validations?.first_name)
    .min(3, add_user_validations?.first_name_min)
    .max(30, add_user_validations?.first_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{2,30}$/, add_user_validations?.first_name),
  client_id: yup
    .object()
    // .shape({
    //   corporate_group: yup.string().max(255),
    // })
    .nullable(), // for handling null value when clearing options via clicking "x"
  //.required('Corporate Group is required'),
  last_name: yup
    .string()
    .required(add_user_validations?.last_name)
    .min(1, add_user_validations?.last_name_min)
    .max(50, add_user_validations?.last_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{0,30}$/, add_user_validations?.last_name),
  email: yup.string().email('Invalid email').max(255).required(add_user_validations?.primary_email_ID),
  personal_email: yup.string().email('Invalid email').max(255, add_user_validations?.primary_email_ID_max).optional().nullable(),
  phone_number: yup
    .string()
    .matches(/^[0-9\s]{3,15}$/, add_user_validations?.mobile_number)
    .required(add_user_validations?.mobile_number),
});

const userType = [
  { id: '1', name: 'Corporate' },
  { id: '2', name: 'Individual' },
];
export function AddUsers(props) {
  const router = useRouter();
  const auth = useAuth();
  const location = useLocation();
  const [isClearable, setIsClearable] = useState(true);
  const [clientData, setClientData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [userData, setUserData] = useState();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBulkRoles, setSelectedBulkRoles] = useState([]);
  const [selectedUserType, setselectedUserType] = useState(null);
  const [selectedClients, setselectedClients] = useState([]);
  const [selectedBulkClients, setselectedBulkClients] = useState([]);
  const [bulkUploadData, setBulkUploadData] = useState([]);
  const [schema, setSchema] = useState(addUserSchema);
  const [existingRoles, setExistingRoles] = useState([]);
  const [existingBulkRoles, setExistingBulkRoles] = useState([]);
  const [existingfile, setExistingFile] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [creatErrorMsgs, setCreatErrorMsgs] = useState([]);
  const [isFileDeleted, setIsFileDeleted] = useState(false);
  const [identifiedRole, setIdentifiedRole] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [isCorporateGroupRequired, setIsCorporateGroupRequired] = useState(false);
  const [pending, setPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editUserByClientrep, setEditUserByClientrep] = useState(false);
  const [uploadfileurl, setUploadfileurl] = useState('');

  const handle = auth?.user?.handle;
  console.log('handlehandlehandle', handle);
  const id = searchParams.get('id');

  console.log('iddddddddddd', id);

  console.log('propsss::::', props);
  console.log('locationnnnn::::', location);
  console.log('Auth:::::::::::::::', auth);

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
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    console.log('errors in corporate', errors);
  }, [errors]);

  useEffect(() => {
    getClients();
    getRoles();
    // if (id) {
    //   getUserByHandle();
    // }
  }, [id]);

  useEffect(() => {
    if (auth?.user?.role?.[0]?.['name'] === 'Client Representative') {
      setIdentifiedRole(true);
    }
  }, [auth])

  useEffect(() => {
    if (
      auth?.user?.role?.[0]?.['name'] === 'Client Representative' &&
      clientData &&
      clientData.length &&
      !id
    ) {
      getClientrepDetail();
    }
  }, [auth, clientData, id]);

  useEffect(() => {
    if (id) {
      getUserByHandle();
    }
  }, [id]);

  useEffect(() => {
    if (bulkUploadData?.length > 0) {
      setSchema(yup.object().shape({}));
    } else if (identifiedRole) {
      setSchema(addUserbyClientRepSchema);
    } else {
      setSchema(addUserSchema);
    }
  }, [bulkUploadData, identifiedRole]);

  const getClients = async () => {
    const clientdetails = await apiRequest(`api/users/clients/getAllClients`);
    console.log('clientdetails', clientdetails);
    if (clientdetails?.status === 'success') {
      setClientData(clientdetails?.value);
      setIsLoading(false);
    }
    // setClientData(clientdetails);
  };

  useEffect(() => {
    console.log('rolesDatarolesData', rolesData);
    console.log('clientDataclientData', clientData);
  }, [rolesData, clientData]);

  const getRoles = async () => {
    const roledetails = await apiRequest(`api/users/roles/getRoles`);
    console.log('roledetails:', roledetails);
    if (roledetails?.status === 'success') {
      setIsLoading(false);
    }
    setRolesData(roledetails?.value?.filter((x) => x.name !== 'test'));
    setAllRoles(
      roledetails?.value
        ? JSON.parse(
          JSON.stringify(roledetails?.value?.filter((x) => x.name !== 'test'))
        )
        : []
    );
  };

  const getUserByHandle = async () => {
    const url = `api/users/getUser/${id}`;
    console.log('url', url);
    const userdetails = await apiRequest(url);
    console.log('userdetails:', userdetails);
    setUserData(userdetails);
    console.log('identifiedRole', identifiedRole, id);
    setIsLoading(false);
  };

  const getClientrepDetail = async () => {
    const url = `api/users/getUser/${handle}`;
    const clientrepdetails = await apiRequest(url);

    if (clientrepdetails?.status === 'success') {
      setValue(
        'client_id',
        clientData.find((e) => e.id == clientrepdetails?.value?.client_id)
      );
      setselectedClients(
        clientData.find((e) => e.id == clientrepdetails?.value?.client_id)
      );
      setIsLoading(false);
    }
  };

  console.log('userDataaaaaaa', userData);

  {
    id
      ? // console.log("iddd3:::",id)
      useEffect(() => {
        if (userData?.value) {
          for (const key in userData?.value) {
            if (key === 'users_type') {
              setselectedUserType(
                userType?.find((e) => e.name === userData?.value[key])
              );
              setValue(
                'users_type',
                userType?.find((e) => e.name === userData?.value[key])
              );
            }
            if (key === 'client_id') {
              console.log('client_id', userData?.value[key]);
              setselectedClients(
                clientData?.find((e) => e.id == userData?.value[key])
              );
              setValue(
                'client_id',
                clientData?.find((e) => e.id == userData?.value[key])
              );
            }
            if (key === 'userRoles') {
              console.log('userRoles', userData?.value[key]);

              setExistingRoles(userData?.value[key]);

              rolesData?.forEach((initialField) => {
                // console.log("initialField",initialField);
                const matchingField = userData?.value[key].find(
                  (field) => field?.id === initialField.id
                );
                if (matchingField) {
                  console.log('matchingFieldmatchingField', matchingField);
                  setValue('roles', matchingField);
                }
              });
            }
            if (key === 'first_name') {
              setValue(key, userData?.value[key] ? userData?.value[key] : '');
            }
            if (key === 'last_name') {
              setValue(key, userData?.value[key] ? userData?.value[key] : '');
            }
            if (key === 'personal_email') {
              setValue(key, userData?.value[key] ? userData?.value[key] : '');
            }
            if (key === 'email') {
              setValue(key, userData?.value[key] ? userData?.value[key] : '');
            }
            if (key === 'phone_number') {
              setPhoneNumber(userData?.value[key]);
              setValue(key, userData?.value[key] ? userData?.value[key] : '');
            }
          }
        }
      }, [userData?.value, clientData])
      : null;
  }

  // console.log('selectedUserType', selectedUserType);
  console.log('selectedClients', selectedClients);
  // console.log('roles', selectedRoles);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const onSubmitFiledata = async (data) => {
    console.log(data, 'data');
    setPending(true);
    if (!id) {
      console.log(
        '/////////printvakues',
        bulkUploadData,
        existingBulkRoles,
        selectedBulkClients
      );
      let roles = [];
      let defaultrole = [];
      roles.push(existingBulkRoles.id);
      defaultrole.push(4);
      console.log('defaultrole', defaultrole);
      if (bulkUploadData && bulkUploadData.length) {
        const formData = new FormData();
        formData.append('file', bulkUploadData[0]);
        formData.append(
          'roles',
          identifiedRole ? JSON.stringify(defaultrole) : JSON.stringify(roles)
        );
        formData.append(
          'client_id',
          identifiedRole ? selectedClients?.id : selectedBulkClients?.id
        );
        [...formData.entries()].forEach((e) => console.log('zzzzzzzzz', e));

        const uploadResponses = await apiRequest(
          'api/users/bulkUpload',
          'POST',
          formData,
          true
        );
        if (uploadResponses?.status === 'success') {
          setPending(false);
          toast.success('User uploaded successfully!');
          setSelectedBulkRoles([]);
          setExistingBulkRoles([]);
          setselectedBulkClients([]);
          setErrorMsgs([]);
          setBulkUploadData([]);
          setIsFileDeleted(true);
        } else {
          if (
            uploadResponses?.message &&
            typeof uploadResponses?.message === 'string'
          ) {
            toast.error(
              uploadResponses?.message.message
                ? uploadResponses?.message.message
                : uploadResponses?.message
            );
            setPending(false);
          } else if (
            uploadResponses?.message &&
            Array.isArray(uploadResponses?.message)
          ) {
            setErrorMsgs(uploadResponses?.message);
            setPending(false);
          }
        }
        window.scrollTo(0, 0);
      } else {
        setPending(true);
        identifiedRole
          ? (data['client_id'] = parseInt(selectedClients?.id))
          : (data['client_id'] = data['client_id']
            ? parseInt(data['client_id']['id'])
            : null);

        identifiedRole
          ? (data['users_type'] = 'Corporate')
          : (data['users_type'] = data['users_type']['name']);

        identifiedRole
          ? (data['roles'] = [])
          : (data['roles'] = [data['roles']['id']]);

        data['personal_email'] = data['personal_email']
          ? data['personal_email']
          : null;
        console.log('aftdataaaaa', data);
        const responses = await apiRequest(
          'api/users/createUser',
          'POST',
          data
        );
        console.log('responsesresponsesresponses::', responses);
        if (responses && responses?.status === 'success') {
          setPending(false);
          toast.success('User created successfully!');
          // router.navigate(`/app/manageuser`)

          reset();
          setPhoneNumber('+91');
          setSelectedRoles([]);
          setExistingRoles([]);
          setSelectedBulkRoles([]);
          setselectedUserType([]);
          setselectedBulkClients([]);
          !identifiedRole ? setselectedClients([]) : '';
          window.scrollTo(0, 0);
        } else {
          if (responses?.message && Array.isArray(responses?.message)) {
            console.log('@@@@@@@@@@');
            setCreatErrorMsgs(responses.message);
            setPending(false);
          } else {
            toast.error(
              responses?.message.message
                ? responses.message.message
                : responses.message
            );
            setPending(false);
            console.log('############');
          }
        }
      }
    } else {
      setPending(true);
      identifiedRole
        ? (data['client_id'] = selectedClients?.id)
        : (data['client_id'] = data['client_id']
          ? parseInt(data['client_id']['id'])
          : null);

      identifiedRole
        ? (data['users_type'] = 'Corporate')
        : (data['users_type'] = data['users_type']['name']);

      identifiedRole
        ? (data['roles'] = [])
        : (data['roles'] = [data['roles']['id']]);
      data['personal_email'] = data['personal_email']
        ? data['personal_email']
        : null;
      console.log('aftdataaaaa', data);
      console.log('idddddd22::::', id);
      const responses = await apiRequest(`api/users/update/${id}`, 'PUT', data);
      console.log('responsesresponsesresponses::', responses);
      if (responses && responses?.status === 'success') {
        setPending(false);
        toast.success('User details updated successfully!');
        router.navigate(`/app/manageuser/?id=${selectedUserType?.name}`);
        getUserByHandle();
        window.scrollTo(0, 0);
        // identifiedRole
        //   ? setselectedClients(
        //       clientData?.find((e) => e.id == auth?.user?.client_id)
        //     )
        //   : ' ';
      } else {
        if (responses?.message && typeof responses?.message === 'string') {
          toast.error(
            responses?.message.message
              ? responses.message.message
              : responses.message
          );
          setPending(false);
        } else if (responses?.message && Array.isArray(responses?.message)) {
          setErrorMsgs(responses?.message);
          setPending(false);
        }
      }
    }
  };

  const handleClick = () => {
    if (id) {
      router.navigate(`/app/manageuser/?id=${selectedUserType?.name}`);
    } else {
      reset();
      setSelectedRoles([]);
      setPhoneNumber('91');
      setSelectedBulkRoles([]);
      setselectedUserType([]);
      identifiedRole ? ' ' : setselectedClients([]);
      setselectedBulkClients([]);
      setExistingBulkRoles([]);
      setExistingRoles([]);
      setErrorMsgs([]);
      setBulkUploadData([]);
      removeFile();
    }
  };

  const removeFile = () => {
    setBulkUploadData([]);
    setIsFileDeleted(true);
  };

  // useEffect(()=>{
  // if(existingRoles?.name === "Client Representative"){
  //   setselectedUserType(
  //       userType.find((e) => e.name === 'Corporate')
  //   );
  //   setValue(
  //       'users_type',
  //       userType.find((e) => e.name === 'Corporate')
  //   );
  // }
  // },[existingRoles?.name])

  const handleRoleChange = (selected) => {
    setValue('roles', selected);
    console.log('objectttttttt', selected);
    // setSelectedRoles(selected);
    setExistingRoles([selected]);
    setSelectedRoles(Array.isArray(selected) ? selected.map((x) => x.id) : []);
    clearErrors('roles')
  };

  console.log('rolessetExistingRoles', existingRoles);

  const handleBulkRoleChange = (selected) => {
    setValue('bulkroles', selected);
    // setSelectedBulkRoles(selected);
    setExistingBulkRoles(selected);
    setSelectedBulkRoles(
      Array.isArray(selected) ? selected.map((x) => x.id) : []
    );
    console.log('type', selected);
    clearErrors('roles')
  };

  const handleUserTypeChange = (selected) => {
    console.log('typetypetype', selected);
    if (selected?.name === 'Individual' || selected?.name === 'Corporate') {
      console.log('@@@@@@@@@@@@', allRoles);
      setValue('roles', null);
      setExistingRoles([]);
      setSelectedRoles([]);
      // setRolesData(allRoles);
    }
    if (selected && selected.name === 'Individual') {
      setIsCorporateGroupRequired(false);
      console.log('selected.name:::::::::::', selected.name);
      setRolesData(
        allRoles &&
        allRoles?.filter(
          (allRoles) => !['Client Representative'].includes(allRoles?.name)
        )
      );
    } else if (selected && selected.name === 'Corporate') {
      setIsCorporateGroupRequired(true);
      setRolesData(
        allRoles &&
        allRoles?.filter((allRoles) => {
          return !['Job Architect', 'Training Facilitator'].includes(
            allRoles?.name
          );
        })
      );
    } else {
      setRolesData(allRoles);
    }
    setValue('users_type', selected);
    clearErrors('users_type')
    setselectedUserType(selected);
  };

  const handleCorporateGroup = (selected) => {
    console.log('logged', selected);
    setValue('client_id', selected);
    setselectedClients(selected);
    clearErrors('client_id')
  };
  const handleBulkCorporateGroup = (selected) => {
    setValue('client_id', selected);
    setselectedBulkClients(selected);
  };

  const userdropzone = {
    title: 'Click or drag your file to upload',
    size: 'Maximum size 10MB .',
    type: '.xls only .',
  };

  const gettinguserroles = auth?.user?.role?.[0]?.['name']

  const getTemplates = async () => {
    try {
      let template_name;
      if (gettinguserroles === 'Admin' || gettinguserroles === 'Super Admin') {
        template_name = 'Super_admin_bulk_upload_template'
      } else {
        template_name = 'Client_bulk_upload_template'
      }
      let templateResponse = await apiRequest(
        `api/users/uploadfile/${template_name}`,
        'GET'
      );
      console.log('ttttttttttttt', templateResponse);
      setUploadfileurl(templateResponse)
    } catch {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const fileData = (data) => {
    console.log('uplodedData:::::::::::', data[0]);
    setBulkUploadData(data);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Use template to bulk upload users
    </Tooltip>
  );

  return (
    <Form onSubmit={handleSubmit(onSubmitFiledata)}>
      {isLoading ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <Row className="space2">
          <Col lg={11} className="AddUer-column ">
            {identifiedRole ? (
              ''
            ) : (
              <Row className="adduser-in-column1">
                <Col lg={6}>
                  <Row>
                    <Col lg="4" md="4" className="labelName">
                      <label for="staticEmail" className="req space">
                        User Type *
                      </label>
                    </Col>
                    <Col lg="8" md="8">
                      <Controller
                        name="users_type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            // styles={ customStyles }
                            // {...register('users_type')}
                            placeholder="Please select"
                            {...field}
                            isClearable={isClearable}
                            hideSelectedOptions={false}
                            value={selectedUserType}
                            options={userType}
                            onChange={handleUserTypeChange}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            styles={{
                              menu: (styles) => ({ ...styles, zIndex: '100' }),
                            }}
                          />
                        )}
                      />
                      {errors.users_type && !(selectedUserType?.length > 0) && (
                        <p className="invalid-feedback">
                          {errors.users_type?.message ||
                            errors.users_type?.name.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <Row>
                    <Col lg="4" md="4">
                      <label for="staticEmail" className="req mb-3">
                        User Role *
                      </label>
                    </Col>
                    <Col lg="8" md="8">
                      <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="Please select"
                            // isMulti
                            isSearchable={true}
                            {...field}
                            isClearable={isClearable}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            value={existingRoles}
                            options={rolesData}
                            onChange={handleRoleChange}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            styles={{
                              menu: (styles) => ({ ...styles, zIndex: '100' }),
                            }}
                          // components={{
                          //   Option: InputOption,
                          // }}
                          />
                        )}
                      />{' '}
                      {!(selectedRoles.length > 0) && (
                        <p className="invalid-feedback">
                          {' '}
                          {errors.roles?.message || errors.roles?.name.message}
                        </p>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
            <Row className="adduser-in-column">
              <Col lg={6}>
                <Form.Group controlId="name" className="mb-3">
                  <FormFieldRow
                    size="md"
                    size1="4"
                    size2="8"
                    name="first_name"
                    type="input"
                    inputRef={register('first_name')}
                    error={errors.first_name}
                    label="First Name  *"
                    labelClassName="req"
                    // placeholder="Jhon"
                    className="requiredd"
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group controlId="name" className="mb-3 position-relative">
                  <FormFieldRow
                    size="md"
                    size1="4"
                    size2="8"
                    name="last_name"
                    type="input"
                    inputRef={register('last_name')}
                    error={errors.last_name}
                    label="Last Name  *"
                    // placeholder="Deo"
                    labelClassName="req"
                    className="requiredd"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="adduser-in-column2">
              <Col lg={6} md={12}>
                <Form.Group controlId="name" className="mb-3">
                  <FormFieldRow
                    size1="4"
                    size2="8"
                    size="md"
                    name="email"
                    type="email"
                    inputRef={register('email')}
                    error={errors.email}
                    label="Primary Email ID *"
                    labelClassName="req"
                    // placeholder="Jhondoe@hcl.com"
                    className="requiredd"
                  />
                </Form.Group>
              </Col>
              <Col lg={6} md={12}>
                <Form.Group controlId="name" className="mb-3 position-relative">
                  <FormFieldRow
                    size="md"
                    size1="4"
                    size2="8"
                    name="personal_email"
                    type="input"
                    label="Secondary Email ID "
                    inputRef={register('personal_email')}
                    error={errors.personal_email}
                  // labelClassName="req"
                  // placeHolder="jhonndeo@gmail.com"
                  // className="requiredd"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="adduser-in-column3">
              <Col lg={6} md={12}>
                <Row>
                  <Col lg="4" md="4">
                    <label for="staticEmail" className="notreq">
                      Corporate Group {isCorporateGroupRequired ? '*' : null}
                    </label>
                  </Col>
                  <Col lg="8" md="8">
                    {identifiedRole ? (
                      <Controller
                        name="client_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="Please select"
                            {...field}
                            // hideSelectedOptions={false}
                            // isClearable={isClearable}
                            value={selectedClients}
                            isDisabled={true}
                            // options={clientData}
                            // onChange={handleCorporateGroup}
                            getOptionLabel={(option) => option.corporate_group}
                            getOptionValue={(option) => option.id}
                            styles={{
                              menu: (styles) => ({ ...styles, zIndex: '100' }),
                            }}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        name="client_id"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="Please select"
                            {...field}
                            hideSelectedOptions={false}
                            isClearable={isClearable}
                            value={selectedClients}
                            options={clientData}
                            onChange={handleCorporateGroup}
                            getOptionLabel={(option) => option.corporate_group}
                            getOptionValue={(option) => option.id}
                          />
                        )}
                      />
                    )}
                    {errors.client_id && (
                      <p className="invalid-feedback">
                        {errors.client_id?.message ||
                          errors.client_id?.name?.message}{' '}
                        {console.log(
                          'errors.client_id?.name:::::',
                          errors.client_id?.name
                        )}
                      </p>
                    )}
                    {/* {errors.client_id && ( <p className='invalid-feedback'> {errors.client_id?.message || errors.client_id?.name.message } </p> )} */}
                  </Col>
                </Row>
              </Col>
              <Col lg={6}>
                <Row>
                  <Col lg="4" md="4">
                    <label for="staticEmail" className="req mb-3">
                      Mobile Number *
                    </label>
                  </Col>
                  <Col lg="8" md="8">
                    <Form.Group>
                      <Controller
                        control={control}
                        name="phone_number"
                        rules={{
                          required: 'Please enter mobile number',
                          minLength: {
                            value: 12,
                            message: 'invalid mobile number',
                          },
                        }}
                        render={() => (
                          <PhoneInput
                            buttonclassName={
                              errors?.phone_number?.message
                                ? 'phone-input-button-error is-invalid'
                                : ''
                            }
                            inputclassName={
                              errors?.phone_number?.message
                                ? 'error-field is-invalid'
                                : ''
                            }
                            inputProps={{
                              title: 'phonenumber',
                              id: 'phone_number',
                            }}
                            country={'in'}
                            onlyCountries={['in']}
                            placeholder=""
                            disableSearchIcon={true}
                            disableDropdown={true}
                            value={phoneNumber}
                            countryCodeEditable={false}
                            onChange={(phone, data, event, formattedValue) => {
                              setError('phone_number');
                              if (phone.length === 2) {
                                setError('phone_number', {
                                  type: 'required',
                                  message: 'Please enter a valid phone number',
                                });
                              } else if (
                                phone.length >= 2 &&
                                phone.length <= 11
                              ) {
                                setError('phone_number', {
                                  type: 'minLength',
                                  message: 'Please enter a valid phone number',
                                });
                              }
                              // else if (phone.length < 5) {
                              //   setValue('formEmail', formattedValue);
                              // }
                              console.log('ppppppppp', phone);
                              setValue('phone_number', phone);
                              setPhoneNumber(phone);
                            }}
                          // inputProps={{
                          //   title: 'phonenumber',
                          //   id: 'phone_number',
                          // }}
                          // country={"us"}
                          // enableAreaCodes={false}
                          // // enableLongNumbers={false}
                          // // countryCodeEditable={true}
                          // // onlyCountries={['in']}
                          // // enableSearch={false}
                          // enableSearch={true}
                          // disableSearchIcon={true}
                          // disableDropdown={true}
                          // value={phoneNumber}
                          // countryCodeEditable={true}
                          // onChange={(phone, data, event, formattedValue) => {
                          //   setError('phone_number');
                          //   if (phone.length === 2) {
                          //     setError('phone_number', {
                          //       type: 'required',
                          //       message: 'Please enter a valid phone number',
                          //     });
                          //   } else if (phone.length >= 2 && phone.length < 12) {
                          //     setError('phone_number', {
                          //       type: 'minLength',
                          //       message: 'invalid phone number',
                          //     });
                          //   }
                          // setValue('phone_number', formattedValue);
                          // setPhoneNumber(formattedValue);
                          // }}
                          />
                        )}
                      />{' '}
                      {errors?.phone_number ? (
                        <p className="mt-1 error-required">
                          {' '}
                          {errors.phone_number.message ===
                            'phone_number must be a valid phone number for region undefined'
                            ? 'Mobile Number is required'
                            : errors.phone_number.message}
                        </p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={10}
                className={
                  creatErrorMsgs && creatErrorMsgs.length ? 'is-error' : 'error'
                }
              >
                {creatErrorMsgs && creatErrorMsgs.length
                  ? creatErrorMsgs.map((msg, index) => (
                    <p key={index} style={{ color: 'red' }}>
                      {msg}
                    </p>
                  ))
                  : null}
              </Col>
            </Row>
          </Col>
          {id ? (
            ' '
          ) : (
            <>
              <Col lg={12} className="line-divider">
                <hr></hr>
                <h6 className="ms-xl-2 my-xl-1">
                  OR
                </h6>
                <hr></hr>
              </Col>

              <Row>
                <Col lg={11} className="AddUer-column1 mt-3">
                  <Row className="userRole-filed">
                    {identifiedRole ? (
                      ''
                    ) : (
                      <>
                        <Col lg={6}>
                          <Row>
                            <Col lg="4" md="4">
                              <label for="staticEmail" className="req mb-3">
                                User Role *
                              </label>
                            </Col>
                            <Col lg="8" md="8">
                              <Controller
                                name="roles"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    placeholder="Please select"
                                    isSearchable={true}
                                    {...field}
                                    isClearable={isClearable}
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    value={existingBulkRoles}
                                    options={rolesData}
                                    onChange={handleBulkRoleChange}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    styles={{
                                      menu: (styles) => ({ ...styles, zIndex: '100' }),
                                    }}
                                  />
                                )}
                              />
                              {!(selectedRoles.length > 0) && (
                                <p className="invalid-feedback">
                                  {' '}
                                  {errors.roles?.message ||
                                    errors.roles?.name.message}
                                </p>
                              )}
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Col lg="4" md="4">
                              <label for="staticEmail" className=" notreq">
                                Corporate Group
                              </label>
                            </Col>
                            <Col lg="8" md="8">
                              <Controller
                                name="client_id"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    placeholder="Please select"
                                    {...field}
                                    hideSelectedOptions={false}
                                    isClearable={isClearable}
                                    value={selectedBulkClients}
                                    options={clientData}
                                    onChange={handleBulkCorporateGroup}
                                    getOptionLabel={(option) =>
                                      option.corporate_group
                                    }
                                    getOptionValue={(option) => option.id}
                                  />
                                )}
                              />
                              {/* {errors.client_id && (
                    <p className='invalid-feedback'>
                                 {errors.client_id?.message ||
                        errors.client_id?.name.message
                      }
                    </p>
                        )} */}
                            </Col>
                          </Row>
                        </Col>
                      </>
                    )}
                    <Col lg={6} className="box-upload">
                      <Row>
                        <Box className="d-btn">
                          <a
                            href={uploadfileurl.value
                            }
                            className="bo"
                          >
                            <DownloadIcon /> &nbsp;Download Template&nbsp;
                          </a>

                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 550, hide: 400 }}
                            overlay={renderTooltip}
                          >
                            <button className="box-btn">
                              <QuestionMarkIcon />
                            </button>
                          </OverlayTrigger>
                        </Box>
                        <Col lg="4" md="4">
                          <label for="staticEmail" className=" notreq">
                            Bulk Upload:
                          </label>
                        </Col>
                        <Col lg="8" md="8">
                          <Reactdropzone
                            userdropzone={userdropzone}
                            fileData={fileData}
                            dropboxclass='dropzone-box dropzonewidth'
                            fileType={'xlsx'}
                          />
                          {bulkUploadData.length > 0 &&
                            <Box className="mt-2" style={{ backgroundColor: '', display: 'flex', alignItems: 'center',justifyContent:'end' }}>
                              <Box className="d-flex">
                                <img
                                  src={'assets/xlxs.png'}
                                  alt="xlxs"
                                  style={{ width: '25px', height: '25px' }}
                                />
                                <p className="aa ms-2 d-flex justify-content-center demo-2">
                                  {bulkUploadData[0].name?.split('?')[0]}
                                </p>{' '}
                              </Box>
                              <span
                                className="closes ms-2 aa"
                                title="Delete"
                                onClick={() => {
                                  setBulkUploadData([]);
                                  setValue('file', '')
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <CrossIcon />
                              </span>
                            </Box>
                          }
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8} className="error">
                      {errorMsgs && errorMsgs.length
                        ? errorMsgs.map((msg, index) => (
                          <p key={index} style={{ color: 'red' }}>
                            {msg}
                          </p>
                        ))
                        : null}
                    </Col>
                  </Row>
                </Col>

                <Col
                  lg={8}
                  className={errorMsgs && errorMsgs.length ? 'is-error' : 'error'}
                >
                  {errorMsgs && errorMsgs.length
                    ? errorMsgs.map((msg, index) => (
                      <p key={index} style={{ color: 'red' }}>
                        {msg}
                      </p>
                    ))
                    : null}
                </Col>
              </Row>
            </>
          )}
          <Col lg={10} className="btnxEditUser mt-5 mb-2">
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
                  ) : id ? (
                    'Update User'
                  ) : (
                    'Create User'
                  )}
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
            {/* <Row
                lg={8}
                className={errorMsgs && errorMsgs.length ? 'is-error' : 'error'}
              >
                {errorMsgs && errorMsgs.length
                  ? errorMsgs.map((msg, index) => (
                    <p key={index} style={{ color: 'red' }}>
                      {msg}
                    </p>
                  ))
                  : null}
              </Row> */}
          </Col>
        </Row>
      )}
    </Form>
  );
}
export default AddUsers;
