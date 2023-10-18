import './CreateTopic.css';
import {
  Form, Row,
  Col,
  Button,
  Tooltip,
  InputGroup,
  FormText,
  Spinner,
  ButtonGroup,
  ButtonToolbar,
  Modal
} from 'react-bootstrap';
import {
  FormFieldRow,
  Reactdropzone,
  CrossIcon,
  HeaderComponent,
  Modals,
  Box, Span, data
} from '@athena/web-shared/ui';
import Select, { components } from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  apiRequest,
  useAuth,
  useParams,
  useRouter,
  topicTypeData,
  deliveryTypeData,
  create_topic_validations,
  checkStatus,
  checkTrainerStatus,
  editPageSaveButtonStatus,
  editPageCancelButtonStatus,
  editpageApproveButtonStatus,
  editpageCancelButtonStatus,
  editPageRejectButtonStatus,
  editPageRejectHideStatus,
  editPageApproveButtonRoles,
  createTopicSchema
} from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { DocModal } from '../../../../ui/src';
import { getImagePath } from '../../../../utils/src';



export function CreateTopic(props) {
  console.log(props, 'props');
  const [isClearable, setIsClearable] = useState(true);
  // const [schema, setSchema] = useState(createTopicSchema);
  const [uploadFileData, setUploadFileData] = useState(null);
  const [selectedTopicType, setSelectedTopicType] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [saveType, setSaveType] = useState(null);
  const [topicData, setTopicData] = useState();
  const [key, setKey] = useState(false);
  const [pending, setPending] = useState(false);
  const [userrole, setuserrole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedJobArchitect, setSelectedJobArchitect] = useState(null);
  const [technology, setTechnology] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [jobArchitectsData, setJobArchitectsData] = useState([]);
  const [type, setType] = useState('');
  const [btnValue, setBtnValue] = useState('');
  const [docState, setdocState] = useState({
    open: false,
    url: "",
    header: false,
  })
  const [fileName, setfileName] = useState('')
  const [extension, setExtension] = useState('');
  const [btnloading, setBtnLoading] = useState(false);

  const handleOpenDoc = () => {
    setdocState({
      open: true,
      url: uploadFileData,
      header: false
    })
  }
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(selectedSkills, "selectedSkillseeeeeeeeee");
  const auth = useAuth();
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(true);
  const handleEdit = (value) => {
    setIsEdit(value)
  }

  const getTopicById = async () => {
    setPending(true);
    const getTopicByIdResponse = await apiRequest(`api/courses/topics/${id}`);
    if (getTopicByIdResponse) {
      setTopicData(getTopicByIdResponse?.value?.userData);
      setStatus(getTopicByIdResponse?.value?.userData?.status)
      setPending(false);
    }

  };
  useEffect(() => {
    if (auth && auth?.user) {
      console.log('auth.user?.role[0].name', auth?.user?.role[0].name);
      setuserrole(auth?.user?.role[0].name);
    }
  }, [auth?.user]);

  useEffect(() => {
    if (topicData) {
      console.log(topicData, 'topicDatar');
      for (const key in topicData) {
        if (key == 'title') {
          setValue('title', topicData['title']);
        }
        if (key == 'description') {
          setValue('description', topicData['description']);
        }

        if (key === 'topic_type') {
          console.log('keyyy', key);
          console.log(topicData, 'topicdatttttttttttt');

          console.log(topicTypeData, 'topictypedata');
          setSelectedTopicType(
            topicTypeData.find((e) => e.name === topicData['topic_type'])
          );
          setValue(
            'topic_type',
            topicTypeData.find((e) => e.name === topicData['topic_type'])
          );
        }
        if (key == 'level') {
          setValue('level', topicData['level']);
          console.log(selectedDifficulty, 'difficulty');
          setSelectedDifficulty(topicData['level']);
        }
        if (key == 'technology_skills') {
          setSelectedSkills(
            technology.find(
              (e) => Number(e.id) === Number(topicData.technology_skills)
            ))
          setValue('technology_skills', topicData['technology_skills']);
        }
        if (key === 'delivery_type') {
          //console.log("keyyy",key);
          setSelectedDeliveryType(
            deliveryTypeData.find((e) => e.name === topicData['delivery_type'])
          );
          setValue(
            'delivery_type',
            deliveryTypeData.find((e) => e.name === topicData['delivery_type'])
          );
        }
        // if (key === 'approver') {
        //   //console.log("keyyy",key);
        //   setJobArchitectsData(
        //     jobArchitectsData.find((e) => e.name === topicData['created_by'])
        //   );
        //   setValue(
        //     'approver',
        //     jobArchitectsData.find((e) => e.name === topicData['created_by'])          );
        // }
        if (key == 'duration') {
          let total = topicData['duration'];
          let hours = total / 60;
          let rhours = Math.floor(hours);
          setHours(Number(rhours));
          let minutes = (hours - rhours) * 60;
          let rminutes = Math.round(minutes);
          setMinutes(Number(rminutes));
          setSeconds(0);
          setValue('duration', topicData['duration']);
        }
        if (key == 'topic_link') {
          setValue('topic_link', topicData['topic_link']);
        }
        if (key == 'attachment_url') {
          let editFileUrl = topicData?.s3_bucket_filekey;
          console.log(editFileUrl, 'editfileurl');
          let exte = editFileUrl?.split('.').pop();
          console.log(exte, 'exte');
          let fileName = editFileUrl?.split('/').pop();
          console.log(fileName, 'name');
          setUploadFileData(fileName);
          setValue('file', fileName);
        }
        if (topicData?.status == "Pending Approval" && userrole == "Job Architect") {
          setIsModalOpen(true)
          setType('statusReview');

        }
      }
    }
  }, [topicData, key]);


  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createTopicSchema) });
  // { resolver: yupResolver(createTopicSchema) }

  const fileData = (data) => {
    setValue('file', data);
    setfileName(data[0]?.name)
    setUploadFileData(data[0]?.preview)
    const ccc = data.map((file) => {
      const extension = file.name;
      const extensionName = extension.split('.');
      setExtension(extensionName[1]);
    });
  }

  useEffect(() => {
    if (selectedJobArchitect) {
      console.log("approverrrrrrrrr", selectedJobArchitect);
    }
  },[selectedJobArchitect])

  useEffect(() => {
    if (id) {
      getTopicById();
    }
    else {
      handleClear();
    }
  }, [id]);

  const userdropzone = {
    title: 'Click or drag your file to upload',
    size: 'Maximum size 10MB .',
    type: 'Accepted File Type: DOC, PPT, PDF, MP4 only',
  };


  const updateTopicStatus = async (event) => {
    const value = event.target.value;
    console.log(value, "eeeeeeeeeeeeeeeeeeeeeeeeeee");
    //  setStatus(value);
    //console.log(status,"fffffffffffffffffffff");
    let data = {};
    if (value === "Approved") {
      data['status'] = value;
    } else {
      data['status'] = value;
      data['reason'] = "reason for reject"
    }
    let statusUpdateResponse = await apiRequest(
      `api/courses/topics/${id}`,
      'POST',
      data
    );
    if (statusUpdateResponse) {
      toast.success('Topic Approved successfully');
      router.navigate(`/app/managetopics`)
    }
  }
  const onSubmitHandler = async (data) => {
    setBtnLoading(true);
    setKey(false);
    console.log('datadata::', data);
    try {
      data['to_be_reviewed_by'] = Number(data['approver']);
      delete data['approver'];
      console.log('cccccccccccccccccccc', data, data['title']);
      const formData = new FormData();
      for (const property in data) {

        if (property == 'file' && typeof data[property] === 'object') {
          data[property] = data[property][0];
        }
        if (property == 'topic_type') {
          data[property] = data[property].name;
        }
        if (property == 'delivery_type') {
          data[property] = data[property].name;
        }
        // if (property == 'approver') {
        //   data['to_be_reviewed_by'] = Number(data[property]);
        //   delete data[property];
        // }

        formData.append(property, data[property]);
        //[...formData.entries()].forEach((e) => console.log('zzzzzzzzz', e));
        if (id) {
          if (property == 'topic_link' && data['topic_type'] === 'Topic Link') {
            formData.set('file', undefined);
          } else if (
            property == 'file' &&
            data['topic_type'] !== 'Topic Link'
          ) {
            formData.set('topic_link', null);
          }
        }
      }

      // if (selectedJobArchitect) {
      //   formData.append('to_be_reviewed_by', selectedJobArchitect?.id);
      // }

      if (saveType == 'In Draft') {
        formData.append('status', 'In Draft');
      } else if (saveType == 'Pending Approval') {
        console.log(saveType, "savetype");
        formData.append('status', 'Pending Approval');
      }
      [...formData.entries()].forEach((e) => console.log('zzzzzzzzz', e, typeof e));
      let response;

      try {
        response = await apiRequest(
          id ? `api/courses/topics/${id}` : `api/courses/topics/create/topic`,
          'POST',
          formData,
          true
        );
        console.log(saveType, "savetyyyyyyyyy");
        if (response.status === 'success') {
          // console.log(response?.value?.userData?.status,"statuseeeeeeeeeeee");
          setBtnLoading(false);
          // setExistingFile(false);
          if (saveType == 'In Draft') {
            toast.success('Topic drafted successfully!');
            setTechnology([])
          } else if (id) {
            toast.success('Topic updated successfully!');
            router.navigate(`/app/managetopics`)
          } else {
            toast.success('Topic saved successfully!');
            // router.navigate(`/app/managetopics`)
          }
          reset();
          setSelectedTopicType(null);
          setSelectedDeliveryType(null);
          setUploadFileData(null);
          setTechnology([])
          setJobArchitectsData([])
          setSelectedSkills(null)
          setHours([]);
          setMinutes([]);
          setSeconds([]);
          setSelectedDifficulty(null);
          setValue('file', null);
          setSelectedJobArchitect(null);
          setValue('approver', null);
          // setValue('duration', null)

        } else {
          setKey(true);
          if (
            response.message ==
            'SequelizeValidationError: notNull Violation: topics.duration cannot be null'
          ) {
            toast.error('Duration is required');
          } else {
            toast.error(
              response.message ? response.message : 'Topic Already Edited'
            );
          }
        }
      } catch (error) {
        console.log('//////////////', error);
      }

      console.log('++++++++++', response);
    } catch (e) {
      console.error('#########', e);
    }
    setPending(false);
    setBtnLoading(false);
  };

  const handleClear = () => {
    setPending(false);
    setSelectedTopicType(null);
    setSelectedDeliveryType(null);
    setUploadFileData(null);
    setValue('duration', null);
    setValue('file', null);
    setSelectedDifficulty(null);
    setSelectedSkills(null);
    console.log('zzzzzzz', getValues('file'));
    reset();
    setHours(null);
    setMinutes(null);
    setSeconds(null);
    setTopicData([]);
    setSelectedJobArchitect(null);
    setValue('approver', null);
    // if (id) {
    //   router.navigate(`/app/managetopics`);
    //   setUploadFileData(null);
    //   setTopicData([]);
    // }
  };

   // Curried handleChange function for select fields
   const handleSelectChange = (fieldName) => (selected) => {
    setValue(fieldName, selected);
    if (fieldName === 'topic_type') {
      setSelectedTopicType(selected);
    } else if (fieldName === 'delivery_type') {
      setSelectedDeliveryType(selected);
    }
  };
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setValue('level', e.target.value);
  };

  const handleJobArchitectChange = (selected) => {
    console.log('////////selected job arch', selected.id);
    setValue('approver', selected?.name);
    setSelectedJobArchitect(selected);
  };

  const handleDurationChange = (totalMinutes) => {
    console.log('///////////?????????', hours);
    let hm, sm;
    hm = hours ? Number(hours) * 60 : 0;
    sm = seconds ? Number(seconds) / 60 : 0;
    totalMinutes = Number(hm) + Number(minutes) + Number(sm);
    console.log('>>>>>>>>>>>>>>>>', totalMinutes, typeof totalMinutes);

    setValue('duration', totalMinutes);
  };

  const getTechnology = async () => {
    const getTechnologyResponse = await apiRequest(`api/courses/domainTechnology/getDomainTechnology/technology`);
    setTechnology(getTechnologyResponse?.value?.map((e) => {
      return { name: e.name, id: e.id };
    }));
    console.log('technology', getTechnologyResponse?.value);
  };

  const getJobArchitect = async () => {
    const getJobArchitectResponse = await apiRequest(`api/users/jobArchitects`)
    setJobArchitectsData(getJobArchitectResponse?.value?.userData?.map((e) => {
      console.log("name:e.first_name,id:e.id:::::::::", e.first_name, e.id)
      return { name: e.first_name, id: e.id }
    }))

    console.log("getJobArchitectResponse:::::::::", getJobArchitectResponse?.value?.userData)

  };

  useEffect(() => {
    getTechnology();
    getJobArchitect();
  }, []);
  
  return (
    <>
      <DocModal docState={docState} setdocState={setdocState} isModal={true} />
      {userrole == 'Trainer' ? (
        <>
          {id && (!checkTrainerStatus.includes(status)) ? (
            <div className="d-flex  justify-content-end mt-5">
              <Button
                variant="none"
                className="f-16 d-flex align-items-center gap-3 text-info"
                onClick={() => {
                  handleEdit(isEdit ? false : true);
                }}
              >
                <Span className="text-info">
                  {isEdit ? 'Edit Topic' : 'View Topic'}
                </Span>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {id && (!checkStatus.includes(status)) ? (
            <div className="d-flex  justify-content-end mt-5">
              <Button
                variant="none"
                className="f-16 d-flex align-items-center gap-3 text-info"
                onClick={() => {
                  handleEdit(isEdit ? false : true);
                }}
              >
                <Span className="text-info">
                  {isEdit ? 'Edit Topic' : 'View Topic'}
                </Span>
              </Button>
            </div>
          ) : null}
        </>

      )}

      <HeaderComponent
        title={
          id && isEdit
            ? 'View Topic'
            : id && !isEdit
              ? 'Edit Topic'
              : 'Create Topic'
        }
        hidebreadcumb
      />
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          {/* <Spinner
         animation="border"
         size="sm"
         role="status"
         aria-hidden={true}
         className="align-baseline"
       >
         <span className="sr-only"></span>
       </Spinner> */}
          &nbsp; <Span className="loader-txt">Loading...</Span>
        </Span>
      ) : (
        <>
          <h2 className="linetext mt-3 mb-5 text-muted">TOPIC DETAILS</h2>
          <Row>
            <Col lg={11}>
              <Form onSubmit={handleSubmit(onSubmitHandler)} className="mx-5">
                <Row>
                  <Col lg={12}>
                    <Form.Group controlId="name">
                      <FormFieldRow
                        name="title"
                        size="md"
                        size1="2"
                        size2="10"
                        type="input"
                        inputRef={register('title')}
                        error={errors.title}
                        label="Topic Title *"
                        placeHolder="Topic here"
                        disabled={id ? isEdit : false}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3 ">
                    <Form.Group controlId="name">
                      <FormFieldRow
                        name="description"
                        size1="2"
                        size2="10"
                        type="textarea"
                        inputRef={register('description')}
                         error={errors.description}
                        rows="5"
                        label="Description"
                        placeHolder="Description here"
                        formtext="Describe the topic shortly"
                        formtextclassName="create-form-text"
                        disabled={id ? isEdit : false}
                      />
                      {/* <p className="describetxt text-muted mt-1">
                         Describe the topic shortly
                       </p> */}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3">
                    <Form.Group className="mb-4">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="">Level *</Form.Label>
                        </Col>
                        <Col lg={9} className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="radio"
                            label="Beginner"
                            name="difficultyRadio"
                            value="Beginner"
                            checked={selectedDifficulty === 'Beginner'}
                            onChange={handleDifficultyChange}
                            className="text-muted d-flex"
                            style={{ fontSize: 'smaller' }}
                            disabled={id ? isEdit : false}
                          />{' '}
                          <Form.Check
                            inline
                            type="radio"
                            label="Intermediate"
                            name="difficultyRadio"
                            value="Intermediate"
                            checked={selectedDifficulty === 'Intermediate'}
                            onChange={handleDifficultyChange}
                            className="text-muted d-flex"
                            style={{ fontSize: 'smaller' }}
                            disabled={id ? isEdit : false}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Advanced"
                            name="difficultyRadio"
                            value="Advanced"
                            checked={selectedDifficulty === 'Advanced'}
                            onChange={handleDifficultyChange}
                            className="text-muted d-flex"
                            style={{ fontSize: 'smaller' }}
                            disabled={id ? isEdit : false}
                          />
                          
                        </Col>
                        {errors.selectedDifficulty && selectedDifficulty == null && (
                            <p className="invalid-feedbackkk">
                              {errors.selectedDifficulty?.message ||
                                errors.selectedDifficulty?.name.message}
                            </p>
                          )}
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    {/* <Form.Group controlId="name" className="mb-3"> */}
                    <Row className="">
                      <Col lg="2">
                        <label for="Technologyskills" className="">
                          {' '}
                          Technology/Skills *{' '}
                        </label>
                      </Col>
                      <Col lg="10">
                        <Controller
                          name="technology_skills"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              placeholder="Please select"
                              hideSelectedOptions={false}
                              isClearable={true}
                              value={selectedSkills}
                              options={technology}
                              onChange={(selectedOption) => {
                                setSelectedSkills(selectedOption);
                                onChange(selectedOption?.id);
                              }}
                              styles={{
                                menu: (styles) => ({
                                  ...styles,
                                  zIndex: '999',
                                }),
                              }}

                              getOptionLabel={(option) => option?.name}
                              getOptionValue={(option) => option?.id}
                              isDisabled={id ? isEdit : false}
                            />

                          )}
                        />
                        {console.log(selectedSkills, 'selected')}
                        {(errors.technology_skills && selectedSkills == null) && (
                          <p className="invalid-feedback">
                            {errors.technology_skills?.message ||
                              errors.technology_skills?.name.message}{' '}
                          </p>
                        )}
                      </Col>
                    </Row>
                    {/* </Form.Group> */}
                  </Col>
                </Row>

                <Row>
                  <Col className="mt-4" lg={6}>
                    <Row className="">
                      <Col lg="4">
                        <label for="TopicType" className="">
                          Topic Type *
                        </label>
                      </Col>
                      <Col lg="8">
                        <Box>
                          <Controller
                            name="topic_type"
                            control={control}
                            render={({ field }) => (
                              <Select
                                placeholder="Please select"
                                {...field}
                                hideSelectedOptions={false}
                                isClearable={true}
                                value={selectedTopicType}
                                options={topicTypeData}
                                onChange={handleSelectChange('topic_type')} // Curried function           
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isDisabled={id ? isEdit : false}
                              />
                            )}
                          />
                          {errors.topic_type && selectedTopicType == null && (
                            <p className="invalid-feedback">
                              {errors.topic_type?.message ||
                                errors.topic_type?.name.message}
                            </p>
                          )}
                        </Box>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="mt-4">
                    <Row className="">
                      <Col lg="4">
                        <label for="staticEmail" className="">
                          Delivery Type *
                        </label>
                      </Col>
                      <Col lg="8">
                        <Box>
                          <Controller
                            name="delivery_type"
                            control={control}
                            isDisabled={id ? isEdit : false}
                            render={({ field }) => (
                              <Select
                                placeholder="Please select"
                                {...field}
                                hideSelectedOptions={false}
                                isClearable={true}
                                value={selectedDeliveryType}
                                options={deliveryTypeData}
                                onChange={handleSelectChange('delivery_type')} // Curried function
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isDisabled={id ? isEdit : false}
                              />
                            )}
                          />
                          {errors.delivery_type &&
                            selectedDeliveryType == null && (
                              <p className="invalid-feedback">
                                {errors.delivery_type?.message ||
                                  errors.delivery_type?.name.message}
                              </p>
                            )}
                        </Box>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3">
                    {selectedTopicType?.name !== 'Topic Link' && (
                      <Row>
                        <Col lg="4">
                          <label for="staticEmail" className="mt-3">
                            Topic Upload *
                          </label>
                        </Col>

                        <Col lg="8" className="mt-3">

                          <Reactdropzone
                            name="file"
                            fileData={fileData}
                            userdropzone={userdropzone}
                            dropboxclass="dropzone-boxsmall dropzonewidth"
                            fileType={userrole === "Admin" || userrole === "Super Admin" ? "topicfiles" : "topicfilesNoPdf"}
                            maxSize={'10240000'}
                            setError={setError}
                          />
                          {uploadFileData !== null &&
                            <Box style={{ backgroundColor: '', display: 'flex', alignItems: 'center' }}>
                              <div className="d-flex" onClick={handleOpenDoc}>
                                <img
                                  src={getImagePath(extension)}
                                  alt="xlxs"
                                  style={{ width: '25px', height: '25px' }}
                                />
                                <p className="aa ms-2 d-flex justify-content-center demo-2">
                                  {fileName?.split('?')[0]}
                                </p>{' '}
                              </div>
                              <span
                                className="closes ms-2 aa"
                                title="Delete"
                                onClick={() => {
                                  setUploadFileData(null);
                                  setValue('file',null)
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <CrossIcon />
                              </span>
                            </Box>
                          }
                          
                            
                          {errors.file && uploadFileData == null&&(
                            <p className="invalid-feedback">
                              {errors.file?.message ||
                                errors.file?.name?.message}
                            </p>
                          )}
                        </Col>
                      
                      </Row>
                    )}
                    {console.log(uploadFileData,"fileeeeeeeeeeeeeeeeeeeeeeeeeee")}
                    <Row>
                      <Col className="mt-3">
                        {selectedTopicType?.name == 'Topic Link' && (
                          <Form.Group controlId="name">
                            <FormFieldRow
                              name="topic_link"
                              size="md"
                              size1="4"
                              size2="8"
                              type="input"
                              label="Topic Link *"
                              inputRef={register('topic_link')}
                              error={errors.topic_link}
                              disabled={id ? isEdit : false}
                              placeHolder="topic link"
                            />
                          </Form.Group>
                        )}
                      </Col>
                    </Row>
                  </Col>

                  <Col className="mt-3">
                    {/* <Row>
                       <Col>
                         {
                           selectedTopicType?.name == "Topic Link" &&
                           <Form.Group>
                             <FormFieldRow
                               name="topic_link"
                               size="md"
                               size1='4'
                               size2='8'
                               type="input"
                               label="Topic Link *"
                               placeHolder="Classes and structures"
                             />
                           </Form.Group>
                         }
                       </Col>
                     </Row> */}
                    <InputGroup
                      size="md"
                      name="duration"
                      onChange={handleDurationChange}
                    >
                      <Row className="mt-3">
                        <Col lg={4}>
                          <InputGroup.Text
                            name="duration"
                            className="inptgroup p-0 "
                          >
                            Duration *
                          </InputGroup.Text>
                        </Col>
                        <Col lg={8}>
                          <Box className="d-flex duration-group durationinpt">
                            <Form.Control
                              aria-label="hr"
                              name="hr"
                              type="number"
                              placeholder="00"
                              className="rounded-3 duration-box"
                              maxLength={2}
                              onInputCapture={(e) => {
                                console.log(')))))))))))', e);
                                setHours(e.target.value);
                              }}
                              value={hours}
                              onKeyDown={(e) => {
                                if (e.key === '-' || e.key === '+') {
                                  e.preventDefault();
                                }
                              }}
                              // onInput={(e) => {
                              //   e.target.value = e.target.value
                              //     .replace(/[^\d]/, '')
                              //     .slice(0, 2);
                              //   setHours(e.target.value);
                              // }}

                              onInput={(e) => {
                                let inputValue = e.target.value;
                                if (
                                  inputValue.length === 1 &&
                                  inputValue[0] === '0'
                                ) {
                                  inputValue = '';
                                } else {
                                  inputValue = inputValue
                                    .replace(/^[0]+/g, '')
                                    .replace(/[^\d]/, '')
                                    .slice(0, 2);
                                }
                                setHours(inputValue);
                                e.target.value = inputValue;
                              }}
                              style={{ MozAppearance: 'textfield' }}
                              disabled={id ? isEdit : false}
                            />
                            &nbsp;&nbsp;<p>hr</p>
                            <Form.Control
                              aria-label="min"
                              name="min"
                              type="number"
                              placeholder="00"
                              className="mx-3 rounded-3 duration-box"
                              onInputCapture={(e) => setMinutes(e.target.value)}
                              value={minutes}
                              maxLength={2}
                              onKeyDown={(e) => {
                                if (e.key === '-' || e.key === '+') {
                                  e.preventDefault();
                                }
                              }}
                              onInput={(e) => {
                                let inputValue = e.target.value;
                                if (
                                  inputValue.length === 1 &&
                                  inputValue[0] === '0'
                                ) {
                                  inputValue = '';
                                } else {
                                  inputValue = inputValue
                                    .replace(/^[0]+/g, '')
                                    .replace(/[^\d]/g, '')
                                    .slice(0, 2);
                                }
                                setMinutes(inputValue);
                                e.target.value = inputValue;
                              }}
                              style={{ MozAppearance: 'textfield' }}
                              disabled={id ? isEdit : false}
                            />
                            <p>min</p>
                            <Form.Control
                              aria-label="se c"
                              name="sec"
                              type="number"
                              placeholder="00"
                              className="mx-3 rounded-3 duration-box"
                              onInputCapture={(e) => setSeconds(e.target.value)}
                              value={seconds}
                              maxLength={2}
                              onKeyDown={(e) => {
                                if (e.key === '-' || e.key === '+') {
                                  e.preventDefault();
                                }
                              }}
                              onInput={(e) => {
                                let inputValue = e.target.value;
                                if (
                                  inputValue.length === 1 &&
                                  inputValue[0] === '0'
                                ) {
                                  inputValue = '';
                                } else {
                                  inputValue = inputValue
                                    .replace(/^[0]+/g, '')
                                    .replace(/[^\d]/g, '')
                                    .slice(0, 2);
                                }
                                setSeconds(inputValue);
                                e.target.value = inputValue;
                              }}
                              style={{ MozAppearance: 'textfield' }}
                              disabled={id ? isEdit : false}
                            />
                            <p>sec</p>
                          </Box>
                          {(hours === null || !hours) &&
                            (minutes === null || !minutes) &&
                            (seconds === null || !seconds) && (
                              <p className="invalid-feedback">
                                {errors.duration?.message ||
                                  errors.duration?.name.message}
                              </p>
                            )}
                        </Col>
                      </Row>
                    </InputGroup>
                  </Col>
                </Row>
                {/* {userrole == 'Trainer' && currentPath.includes(`${id}`) ? ( */}
                {userrole == 'Trainer' ? (
                  <Row>
                    <Col className="mt-3 mb-3">
                      <Row>
                        <Col lg="2">
                          <label for="staticEmail" className="mt-3">
                            Approver
                          </label>
                        </Col>
                        <Col lg="10" className="mt-3">
                          <Box>
                            <Controller
                              name="approver"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  placeholder="Please select"
                                  {...field}
                                  hideSelectedOptions={false}
                                  isClearable={true}
                                  value={selectedJobArchitect}
                                  options={jobArchitectsData}
                                  onChange={handleJobArchitectChange}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.id}
                                  isDisabled={id ? isEdit : false}
                                />
                              )}
                            />
                            {errors.approver &&
                              selectedJobArchitect == null && (
                                <p className="invalid-feedback">
                                  {errors.approver?.message ||
                                    errors.approver?.name.message}
                                </p>
                              )}
                          </Box>
                        </Col>
                      </Row>
                      {/* 
                       <Row>
                         <Col className="mt-3">
                           {selectedTopicType?.name == 'Topic Link' && (
                             <Form.Group controlId="name">
                               <FormFieldRow
                                 name="topic_link"
                                 size="md"
                                 size1="4"
                                 size2="8"
                                 type="input"
                                 label="Topic Link *"
                                 inputRef={register('topic_link')}
                                 // error={errors.topic_link}
     
                                 disabled={id ? isEdit : false}
                                 placeHolder="topic link"
                               />
                             </Form.Group>
                           )}
                         </Col>
                       </Row> */}
                    </Col>
                  </Row>
                ) : null}
                <Row>
                  <Col className="mb-5 mt-5">
                    <Row>
                      <ButtonToolbar
                        aria-label="Toolbar with button groups"
                        style={{ display: 'flex', justifyContent: 'end' }}
                      >
                        {/* view page */}
                        {id && isEdit ? (
                          <>
                            {editPageApproveButtonRoles.includes(userrole) &&
                              editPageRejectButtonStatus.includes(
                                topicData?.status
                              ) && (
                                <ButtonGroup
                                  className=""
                                  aria-label="Second group"
                                >
                                  <Button
                                    className="topic-cancel-btn space1 rounded-5"
                                    variant="outline-primary"
                                    type="button"
                                    value="Reject"
                                    onClick={() => {
                                      props.handleEdit,
                                        setIsModalOpen(true),
                                        setType('RejectView'),
                                        setBtnValue('Reject'),
                                        updateTopicStatus;
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </ButtonGroup>
                              )}
                            <Modals
                              btn="Reject"
                              type={type}
                              value={btnValue}
                              valuetype="topic"
                              id={id}
                              show={isModalOpen}
                              onHide={() => {
                                setIsModalOpen(false);
                              }}
                            />
                            {editPageApproveButtonRoles.includes(userrole) &&
                              editpageApproveButtonStatus.includes(
                                topicData?.status
                              ) && (
                                <ButtonGroup
                                  className="me-0"
                                  aria-label="Third group"
                                >
                                  <Button
                                    className=" topicc-savee-btnn rounded-5 px-5"
                                    type="button"
                                    value="Approved"
                                    onClick={updateTopicStatus}
                                  >
                                    Approve
                                  </Button>
                                </ButtonGroup>
                              )}
                          </>
                        ) : id && !isEdit ? (
                          <ButtonGroup
                            className="me-0"
                            aria-label="Second group"
                          >
                            {editPageSaveButtonStatus.includes(
                              topicData?.status
                            ) && (
                                <Button
                                  className="topicc-savee-btnn rounded-5 px-2"
                                  type="submit"
                                  disabled={btnloading}
                                  onClick={() => {
                                    if (editPageApproveButtonRoles.includes(userrole)) {
                                      setSaveType('Approved');
                                    } else {
                                      setSaveType('Pending Approval');
                                    }
                                  }}
                                >
                                  {btnloading && saveType !== 'In Draft' ? (
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
                                      {console.log(saveType, 'savetype')}
                                      {userrole === 'Trainer' &&
                                        topicData?.status != 'In Draft'
                                        ? 'Send for approval'
                                        : 'Save'}
                                    </>
                                  )}
                                </Button>
                              )}
                            {userrole == 'Trainer' &&
                              editPageCancelButtonStatus.includes(
                                topicData?.status
                              ) ? (
                              <Button
                                className="topic-cancel-btn  space1 rounded-5"
                                variant="outline-primary"
                                type="button"
                                onClick={handleClear}
                              >
                                Cancel
                                {/* Cancel */}
                              </Button>
                            ) : (
                              topicData?.status == 'In Draft' && (
                                <Button
                                  className="topic-cancel-btn  space1 rounded-5"
                                  variant="outline-primary"
                                  type="button"
                                  onClick={handleClear}
                                >
                                  Cancel
                                  {/* Cancel */}
                                </Button>
                              )
                            )}
                            <>
                              {editpageCancelButtonStatus.includes(
                                topicData?.status
                              ) &&
                                editPageApproveButtonRoles.includes(
                                  userrole
                                ) && (
                                  <Button
                                    className="topic-cancel-btn  space1 rounded-5"
                                    variant="outline-primary"
                                    type="button"
                                    onClick={handleClear}
                                  >
                                    Cancel
                                    {/* Cancel */}
                                  </Button>
                                )}
                              {editPageApproveButtonRoles.includes(userrole) &&
                                editPageRejectHideStatus.includes(
                                  topicData?.status
                                ) && (
                                  <Button
                                    className=" topic-cancel-btn space1 rounded-5"
                                    variant="outline-primary"
                                    type="button"
                                    value="Reject"
                                    onClick={() => {
                                      props.handleEdit,
                                        setIsModalOpen(true),
                                        setType('RejectView'),
                                        setBtnValue('Reject'),
                                        updateTopicStatus;
                                    }}
                                  >
                                    Reject
                                  </Button>
                                )}
                              <Modals
                                btn="Reject"
                                type={type}
                                value={btnValue}
                                valuetype="topic"
                                id={id}
                                show={isModalOpen}
                                onHide={() => {
                                  setIsModalOpen(false);
                                }}
                              />
                            </>
                          </ButtonGroup>
                        ) : (
                          <>
                            <ButtonGroup
                              className="mt-1 mx-4 "
                              aria-label="first group"
                            >
                              <Button
                                style={{ color: 'blue' }}
                                variant=""
                                type="submit"
                                onClick={() => setSaveType('In Draft')}
                              >
                                Save as Draft
                              </Button>
                            </ButtonGroup>
                            <ButtonGroup className="" aria-label="Second group">
                              <Button
                                className="topic-cancel-btn  space1 rounded-5"
                                variant="outline-primary"
                                type="button"
                                onClick={handleClear}
                              >
                                Cancel
                                {/* Cancel */}
                              </Button>
                            </ButtonGroup>
                            <ButtonGroup
                              className="me-0 "
                              aria-label="Third group"
                            >
                              <Button
                                className="topicc-savee-btnn rounded-5 px-2"
                                type="submit"
                                disabled={btnloading}
                                onClick={() => {
                                  if (
                                    auth?.user?.role?.[0]?.['name'] == 'Admin'
                                  ) {
                                    setSaveType('Approved');
                                  } else {
                                    setSaveType('Pending Approval');
                                  }
                                }}
                              >
                                {btnloading && saveType !== 'In Draft' ? (
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
                                    {userrole === 'Trainer'
                                      ? 'Send for approval'
                                      : 'Save'}
                                  </>
                                )}
                              </Button>
                            </ButtonGroup>
                          </>
                        )}
                      </ButtonToolbar>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
export default React.memo(CreateTopic);