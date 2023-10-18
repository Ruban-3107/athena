import { Box, FormField, Span,ButtonComponent,
  FormFieldRow,
  Loader, } from '@athena/web-shared/ui';
import { Form, Col, Row, Accordion, Card, Button,ButtonGroup,ButtonToolbar,Spinner } from 'react-bootstrap';
import './CreateRole.css';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { apiRequest,useRouter, create_role_validations } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import _ from 'lodash';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams } from 'react-router-dom';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

const createRoleSchema = yup.object().shape({
  role_name: yup
    .string()
    .required(create_role_validations?.role_name)
    .min(3, create_role_validations?.role_name_min)
    .max(30, create_role_validations?.role_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{2,30}$/, create_role_validations?.role_name),
  description: yup
  .string()
  .nullable()
  .matches(/^(?:\s*\S.*)?$/,'Invalid Description')
  
});

export function CreateRole(props) {
  const [isClearable, setIsClearable] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModules, setselectedModules] = useState([]);
  const [isCheckAll, setisCheckAll] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [pending, setPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { type } = props;

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createRoleSchema) });

  useEffect(() => {
    console.log('popoppop', type);
    getModules();
    getRoles();
  }, []);

  useEffect(()=>{
    if(type === "create"){
      setValue('role_name',null);
    }
  },[type])
  useEffect(() => {
    console.log('eeeeeeeeeee_____________', errors);
    if (type !== 'create' && errors.role_name) {
      toast.warn('Please select a role to update');
    }
  }, [errors]);

  useEffect(() => {
    console.log('wqwqwwq',type, selectedOption);
    getRoleData(selectedOption?.value);
    getModules();
    if(type === "update"){
      setValue('role_name', selectedOption?.label);
    }
    if (selectedOption === null) {
      reset();
      setselectedModules([]);
      setisCheckAll({});
    }
  }, [selectedOption]);

  const getRoleData = async (id) => {
    if (id) {
      const getRoleData = await apiRequest(`api/users/roles/${id}`, 'GET');
      console.log('getRoleData', getRoleData);
      if (getRoleData?.status === 'success') {
        const a = JSON.parse(getRoleData?.value?.permissions);
        console.log('ruyuyuyu', a);
        let permissionsAvailable = [];
        let finalPermissions = [];
        if (a && a.length > 0) {
          a.forEach((x) => {
            if (x.name) {
              for (const item of x.name) {
                permissionsAvailable.push(item);
              }
            }
          });
          permissionsAvailable.forEach((x) => {
            permissions.find((item) => {
              if (item.name && item.name === x) {
                finalPermissions.push(item);
              }
            });
          });
          console.log('rrrrrrr', finalPermissions);
          setselectedModules(finalPermissions);
          setValue('description', getRoleData?.value?.description);

          console.log('kkkkkkkkkk', modules);
          const modNames = modules.map((x) => x.title);
          for (const name of modNames) {
            let moduleFound = modules.find((a) => a['title'] === name);
            console.log('_____________', moduleFound);
            let modulesSelected = moduleFound['permissions'];
            if (allelementsExists(finalPermissions, modulesSelected)) {
              isCheckAll[name] = true;
            } else {
              delete isCheckAll[name];
            }
            console.log('rrrrrrrrrrrrr', isCheckAll, finalPermissions);
            setisCheckAll({ ...isCheckAll });
          }
          setIsLoading(false);
        } else {
          setselectedModules([]);
        }
      }
    }
  };

  const getRoles = async () => {
    const getRoleresponse = await apiRequest('api/users/roles/getRoles', 'GET');
    console.log('getRoleresponse', getRoleresponse);
    if (getRoleresponse?.status === 'success') {
      setIsLoading(false);
      setRoleOptions(
        getRoleresponse?.value?.map((x) => {
          return { value: x.id, label: x.name };
        })
      );
    }
  };

  const getModules = async () => {
    const getresponse = await apiRequest('api/users/modules/get', 'GET');
    console.log('getResponse', getresponse);

    if (getresponse?.status === 'success') {
      const groupedModules = _.groupBy(
        getresponse.value,
        (module) => module.menu
      );
      let moduless = [];
      let modulesToHide = ['Assessment Management', 'Feedback'];
      let permissionsToHide = {
        'Batch Management': ['Duplicate Batch'],
        'Schedule Management': [
          'View Schedule',
          'Create Schedule',
          'Edit Schedule',
          'Delete Schedule',
          'Enable/Disable Batch Schedule',
        ],
        'Content Management': [
          'Delete Learning Paths',
          'Approve Content',
          'Publish Content',
        ],
      };
      let allPermissions = [];
console.log(groupedModules,"groupmodules");
      for (const moduleName in groupedModules) {
        let arrayOfPermissions = [];
        if (!modulesToHide.includes(moduleName)) {
          if (Object.keys(permissionsToHide).includes(moduleName)) {
            for (const element of groupedModules[moduleName]) {
              if (!permissionsToHide[moduleName].includes(element.name)) {
                arrayOfPermissions.push(element);
              }
            }
          } else {
            for (const element of groupedModules[moduleName]) {
              arrayOfPermissions.push(element);
            }
          }
          moduless.push({
            title: moduleName,
            permissions: _.orderBy(arrayOfPermissions, ['mod_order'], ['asc']),
          });
        }
        for (const item of arrayOfPermissions) {
          allPermissions.push(item);
        }
      }
      console.log('ssss3', moduless, allPermissions);
      setModules(moduless);
      setPermissions(allPermissions);
      setIsLoading(false);
    } else {
      toast.error(getresponse?.message);
    }
  };

  const allelementsExists = (a1, a2) => {
    console.log('ffffffffff', a1, a2);
    return a2.filter((e) => a1.indexOf(e) !== -1).length === a2.length;
  };

  const handleSelectAll = (e) => {
    const { checked, name } = e.target;
    let moduleFound = modules.find((a) => a['title'] === name);
    let newArray = [];
    if (moduleFound && Object.keys(moduleFound)?.length > 0) {
      let modulesSelected = moduleFound['permissions'];
      let modulesSelectedtwo = moduleFound['permissions'].map((x) => x.id);
      if (checked) {
        newArray = selectedModules.concat(modulesSelected);
      } else {
        newArray = selectedModules.filter(
          (x) => modulesSelectedtwo.indexOf(x.id) < 0
        );
      }
      if (allelementsExists(newArray, modulesSelected)) {
        isCheckAll[name] = true;
      } else {
        delete isCheckAll[name];
      }
    }
    console.log('eeeeeeee', isCheckAll, newArray);
    setisCheckAll({ ...isCheckAll });
    setselectedModules([...newArray]);
  };

  const handleClick = (e) => {
    const { id, checked, name } = e.target;
    console.log('gggggggggg', id, checked, name);
    let moduleFound = modules.find((a) => a['title'] === name);
    let modulesSelected = moduleFound['permissions'];
    let newArray = selectedModules;
    if (checked) {
      newArray.push(modulesSelected.find((x) => x.id === id));
    } else {
      newArray = selectedModules.filter((x) => x.id != id);
    }
    // .map((x) => x.id)
    if (allelementsExists(newArray, modulesSelected)) {
      isCheckAll[name] = true;
    } else {
      delete isCheckAll[name];
    }
    console.log('rrrrrrrrrrrrr', isCheckAll, newArray);
    setisCheckAll({ ...isCheckAll });
    setselectedModules([...newArray]);
  };

  const onSubmitData = async (e) => {
    console.log('ssssssssssss', e, selectedModules);
    let data = {};
    data['description'] = e.description;
    data['permissions'] = selectedModules;
    // if (type !== "create" && selectedOption === null) {
    //   toast.warn('please select a role to update');
    // }
    if (data?.permissions?.length !== 0) {
      setPending(true);
      let rolecreateResponse;
      if (selectedOption) {
        rolecreateResponse = await apiRequest(
          `api/users/roles/${selectedOption.value}`,
          'PUT',
          data
        );
      } else {
        data['name'] = e.role_name;
        rolecreateResponse = await apiRequest(
          'api/users/roles/createRoles',
          'POST',
          data
        );
      }
      console.log('rolecreateResponse', rolecreateResponse);

      if (rolecreateResponse?.status === 'success') {
        setPending(false);
        if (selectedOption) {
          toast.success(rolecreateResponse?.message);
        } else {
          reset();
          setselectedModules([]);
          setisCheckAll({});
          toast.success(rolecreateResponse?.message);
        }
      } else {
        setPending(false);
        console.log('uiuiiuiu');
        toast.error(
          rolecreateResponse?.message ??
            (selectedOption
              ? 'Error in updating role'
              : 'Error in creating role')
        );
      }
    } else {
      toast.warn('please select permission(s)');
    }
  };

  return (
      <Form onSubmit={handleSubmit(onSubmitData)}>
          {isLoading ? (
            <Span className="d-flex align-items-center justify-content-center loader-text">
              <Loader />
            </Span>
          ) : (
            <>
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: '8% 9% 83%',
                  alignItems: 'center',
                }}
              >
                <hr />
                <h6 className="ms-2 me-1 my-1 role-txt">ROLE DETAILS</h6>
                <hr />
              </Box>

              <Row className="d-flex justify-content-center mt-4 mb-3 m-0 pl-xl-5">
                <Col lg={11}>
                  <Row className="d-flex justify-content-between">
                    <Col lg={5}>
                      <Form.Group controlId="name" className="mb-3">
                        {type === 'create' ? (
                          <FormFieldRow
                            size="md"
                            size1="4"
                            size2="8"
                            name="role_name"
                            type="input"
                            inputRef={register('role_name')}
                            // onSelect={}
                            //  error={errors.batch_name && true}
                            error={errors.role_name}
                            label="Role Name *"
                            labelClassName="selectallcheck"
                            placeholder="Role name"
                            className="requiredd"
                          />
                        ) : (
                          <Row>
                            <Col xl={4}>
                              <Form.Label>Role Name</Form.Label>
                            </Col>
                            <Col xl={8}>
                              <Controller
                                name="role_id"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    className='cssselect'
                                    placeholder="Select role"
                                    {...field}
                                    hideSelectedOptions={false}
                                    isClearable={isClearable}
                                    value={selectedOption}
                                    options={roleOptions}
                                    onChange={setSelectedOption}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    styles={{
                                      indicatorSeparator: (styles) => ({
                                        display: 'none',
                                      }),
                                      // dropdownIndicator: (styles) => ({
                                      //   display: 'none',
                                      // }),
                                    }}
                                  />
                                )}
                              />
                              {/* <p>uio</p> */}
                              {selectedOption === null && errors?.role_name && (
                                <p className="invalid-feedback">
                                  {errors?.role_name?.message
                                    ? 'Please select a role to update'
                                    : null}
                                </p>
                              )}
                            </Col>
                          </Row>
                        )}
                      </Form.Group>
                      {/* </Col>
              </Row> */}
                    </Col>
                    <Col lg={5}>
                      <Form.Group>
                        <FormField
                          size="sm"
                          // size1="12"
                          // size2="9"
                          type="textarea"
                          labelClassName="batchclass"
                          // label="Description *"
                          name="description"
                          inputRef={register('description')}
                          error={errors.description}
                          placeholder="Description about the role"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Box
                className="mb-5"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '8% 9% 83%',
                  alignItems: 'center',
                }}
              >
                <hr />
                <h6 className="ms-2 me-1 my-1  role-txt">PERMISSIONS</h6>
                <hr />
              </Box>
              <Row className="px-0 ">
                {modules.map((item, index) => (
                  <Col lg={6} className="">
                    <Card className="border-0">
                      <Card.Header
                        className=""
                        style={{
                          backgroundColor: '#E8F5FF',
                          paddingLeft: '6.0rem',
                          paddingRight: '6.2rem',
                        }}
                      >
                        <Box className="d-flex justify-content-between selectallcheck align-items-center">
                          <span className="title-role">
                            {' '}
                            {item.title + ':'}
                          </span>
                          <Form.Check
                            label={'Select All'}
                            name={item.title}
                            onChange={handleSelectAll}
                            checked={isCheckAll[item.title]}
                            type="checkbox"
                            id={item.title}
                            className=""
                            style={{ color: '#000' }}
                          />
                        </Box>
                      </Card.Header>
                      <Card.Body className="" style={{ paddingLeft: '7rem' }}>
                        {item?.permissions?.map((permission, index) => (
                          <li className="mb-3 check-list">
                            <Form.Check
                              label={permission.name}
                              name={item.title}
                              type="checkbox"
                              id={permission.id}
                              onChange={handleClick}
                              key={permission.id}
                              checked={selectedModules
                                ?.map((x) => x.id)
                                .includes(permission.id)}
                            />
                          </li>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* <Box className="d-flex justify-content-end mt-5 mb-5 gap-3">
        <ButtonComponent name="Cancel" variant="outline-primary" className="rounded-4 px-5" onClick={() => {
          reset();
          setselectedModules([]);
          setisCheckAll({});
          setSelectedOption(null);
        }} />
        <ButtonComponent name={type === "create"?"Create Role":"Update Role"} variant="primary" type="submit" className="rounded-4 px-4" />
      </Box> */}
              <Row className="d-flex justify-content-end mt-5 mb-5 gap-3 buttonalign">
                <Col lg={5}>
                  <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup
                      className="me-3 align-items-end"
                      aria-label="First group"
                    >
                      <Button
                        className="chapter-save-btn"
                        variant="outline-primary"
                        type="button"
                        onClick={() => {
                          reset();
                          setselectedModules([]);
                          setisCheckAll({});
                          setSelectedOption(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="chapter-save-btn"
                        variant="primary"
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
                          <>
                            {type === 'create' ? 'Create Role' : 'Update Role'}
                          </>
                        )}
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
              </Row>
            </>
          )}
      </Form>
  );
}

export default CreateRole;
