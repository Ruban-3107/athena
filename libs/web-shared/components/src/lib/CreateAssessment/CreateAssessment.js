import './CreateAssessment.css';
import {
  Form,
  ListGroup,
  Row,
  Col,
  Table,
  Button,
  Container,
  FormGroup,
  Offcanvas,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Accordion,
  Card,
  ButtonGroup,
  ButtonToolbar,
} from 'react-bootstrap';
import {
  Bulkfileupload,
  UploadFile,
  ButtonComponent,
  FormFieldRow,
  DeleteIcon,
  DocumentIcon,
  VideoIcon,
  NextIcon,
  DragDropList,
  CanvasWithSearch,
  SearchBar,
  RoundPlus,
  TopicAccordian,
  Moveaccord,
  FormContext,
  DraggableComponent,
  Modals,
  HeaderComponent,
  Box,
  FormField,
  MenuIcon,
  Span,
  DroppableComponent,
} from '@athena/web-shared/ui';
import {
  useForm,
  Controller,
  useFieldArray,
  FormProvider,
} from 'react-hook-form';
import Select, { components } from 'react-select';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { toast } from 'react-toastify';
import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import {
  apiRequest,
  Router,
  skills,
  useAuth,
  useParams,
  useRouter,
  isFoundTopic,
  create_chapter_validations,
  create_topic_validations,
  create_assessment_validation
} from '@athena/web-shared/utils';

import * as yup from 'yup';
import NumberDropDown from '../number-drop-down/number-drop-down';
import { yupResolver } from '@hookform/resolvers/yup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { apiRequestHandler } from '../../../../utils/src';

const addAssessmentSchema = yup.object().shape({
  title: yup
    .string()
    .required(create_assessment_validation?.assessment_title),
  question: yup
    .string()
    .required(create_assessment_validation?.assessment_question),
  technology_skills: yup
    .string()
    .required(create_assessment_validation?.tech_skill),
  options: yup.array().of(
    yup.object().shape({
      option: yup.string().required(create_assessment_validation?.option),
      answer: yup.string()
    })
  )

});
export const CreateAssessment = (props) => {
  console.log(props);
  /**State Variables*/
  const [file, setFile] = useState([]);
  const [userrole, setuserrole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Number');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [schema, setSchema] = useState(addAssessmentSchema);
  const [saveType, setSaveType] = useState(null);
  const [level, setLevel] = useState('');
  /**Topics Canvas */
  const [topics, setTopics] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  //Filter//
  const [topicType, setTopicType] = useState('All');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('All');
  //Filter//
  const [chapterData, setChapterData] = useState('');
  const params = useParams();
  const router = useRouter();
  const tableRef = useRef(null);
  console.log(params, 'params');
  const { id } = params;
  const auth = useAuth();
  console.log('YAA', auth?.user?.role?.[0]?.['name']);
  ///Topics Drag Drop List ///
  const [topicsList, setTopicsList] = useState([]);
  const [selectedTopics, setselectedTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicType, setSelectedTopicType] = useState([]);
  /**________________________________ */
  const [filterText, setFilterText] = useState('');
  const [pageN, setPageN] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [accordiontiles, setaccordiontiles] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [selectedJobArchitect, setSelectedJobArchitect] = useState(null);
  const [technology, setTechnology] = useState([]);
  const [pending, setPending] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topicfields, settopicfields] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(true);
  const [JobArchitectsData, setJobArchitectsData] = useState([]);
  const [type, setType] = useState('');
  const [btnValue, setBtnValue] = useState('');

  const handleEdit = (value) => {
    setIsEdit(value);
  };


  useEffect(() => {
    if (auth && auth.user) {
      console.log('auth.user?.role[0].name', auth.user?.role[0].name);
      setuserrole(auth.user?.role[0].name);
    }
  }, [auth.user]);
  /**_______________
   *
   * _________________ */
  const filterDropdowns = [];
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };


  const getTop = async (pageNo, size) => {
    try {
      let requestParams = {
        pageNo,
        size,
      };
      if (selectedSkills) {
        requestParams.technology_skills = selectedSkills.id;
      }

      if (filterText) {
        requestParams.searchkey = filterText;
      }
      requestParams['status'] = 'Approved';
      const {
        value: {
          topicData: { rows },
        },
      } = await apiRequest(
        'api/courses/topics/searchAndFilterTopic',
        'POST',
        requestParams
      );

      console.log('topicres');
      setTopics(rows);

      // if (dragdropListItems.length !== 0) {
      //   setFilteredItems(
      //     rows.filter((x) => dragdropListItems.some((y) => y.title === x.title))
      //   );
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTop(pageN, pageSize);
    setIsLoading(false);
  }, [pageN, pageSize, filterText, selectedSkills]);

  const onset = (list) => {
    console.log('ss', list);
    setTopicsList(list);
  };
  /**Topics Canvas */

  /**Form */

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      options: [
        { 'option': '', 'answer': false }, { 'option': '', 'answer': false }
      ]

    },


    resolver: yupResolver(addAssessmentSchema)
  });

  const {
    fields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'options',
  });
  useEffect(() => {
    console.log(fields, 'fields');
  }, [fields]);
  /**Select all */
  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = (event) => {
    // AddBulkid(topics)
    setSelectAll(event.target.checked);
    setFilteredItems(event.target.checked ? topics : []);
    setTopicsList(event.target.checked ? topics : []);
  };
  /**Select all */


  /**SelectOneTopic */

  /**HandleDelete */

  /**HandleDelete*/
  useEffect(() => {
    console.log('dd', filteredItems);
  }, [filteredItems]);
  /**Select all */


  useEffect(() => {
    console.log('errorserrorserrorserrors:::', errors);
  }, [errors]);

  /**Submit form function */

  const handleReset = () => {
    reset({
      title: '',
      question: '',
      options: [],
      technology_skills: '',

    });
    setValue('level', '');
    setSelectedDifficulty('');
    setValue('technology_skills', '');
    setSelectedSkills(null);
  };



  const onSubmit = async (data) => {

    // Convert technology_skills to a number
    data.technology_skills = parseInt(data.technology_skills)
    console.log("data::::::::123", data)

    try {
      const createAssessmentresponse = await apiRequest(
        `api/courses/assessments/createAssessment`,
        'POST',
        data
      );

      if (createAssessmentresponse.status ==
        'success') {
        toast.success("Assessmemt Created Successfully!!")
      } else {
        toast.error("Assessmemt Failed!!", createAssessmentresponse.message)
      }


    } catch (error) {
      console.log("error in assessment", error);
    }


  }



  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );




  const fetchMoreData = () => {
    console.log('enter');
    setIsLoading(true);

    // Simulating an API call delay
    setTimeout(() => {
      // Simulated response data
      const newData = [
        // New data for the next page
      ];

      // Append the new data to the existing data
      // and update the page state
      setTopicsList((prevTopics) => [...prevTopics, ...newData]);
      setPageSize((pageSize) => pageSize + 10);
      setIsLoading(false);
    }, 1000);
  };
  const handleScroll = (event) => {
    console.log('hiiiiiii');
    const target = event.target;
    fetchMoreData();
    // if (
    //   target.scrollHeight - target.scrollTop === target.clientHeight &&
    //   !isLoading
    // ) {
    //   fetchMoreData();
    // }
  };




  // const { isEdit } = props;
  const trackId = id;

  const Providervalue = useMemo(
    () => ({
      register,
      control,
      setValue,
      getValues,
      selectedSkills,
      errors,
      isEdit,
      trackId,
      reset,
    }),
    [
      register,
      control,
      setValue,
      getValues,
      selectedSkills,
      errors,
      isEdit,
      trackId,
    ]
  );

  const [selectedValue, setSelectedValue] = useState(1);
  const [inputValues, setInputValues] = useState(
    Array.from({ length: 2 }, () => '')
  );

  const handleDropdownChange = (event) => {
    const selectedOption = parseInt(event.target.value);
    console.log("event.target.value:", event.target.value)
    setSelectedValue(selectedOption);
    setInputValues(Array.from({ length: selectedOption }, () => ''));
    console.log("selectedOption::", selectedOption)
    if (selectedOption == 2) {
      console.log("here::::::3");
      remove();
      for (let i = 0; i < 2; i++) {
        append({ option: '' })
      }
    }
    else if (selectedOption == 3) {
      console.log("here::::::3");
      remove();
      for (let i = 0; i < 3; i++) {
        append({ option: '' })
      }
    } else if (selectedOption == 4) {
      remove();
      for (let i = 0; i < 4; i++) {
        append({ option: '' })
      }
    }

  };


  // console.log(totalmins, 'totalminstotalmins');

  const getTechnology = async () => {
    const getTechnologyResponse = await apiRequest(
      `api/courses/domainTechnology/getDomainTechnology/technology`
    );
    setTechnology(
      getTechnologyResponse?.value?.map((e) => {
        return { name: e.name, id: e.id };
      })
    );
    console.log(
      'technology',
      getTechnologyResponse?.value?.map((e) => e.name)
    );
  };

  const getJobArchitect = async () => {
    const getJobArchitectResponse = await apiRequest(`api/users/jobArchitects`);
    setJobArchitectsData(
      getJobArchitectResponse?.value?.userData?.map((e) => {
        return { name: e.first_name, id: e.id };
      })
    );
  };

  const answerdData = (index) => {

    console.log("inedx::::::::::::", index)
    setValue(`options.${index}.answer`, true)

  }

  useEffect(() => {
    getTechnology();
    getJobArchitect();
  }, []);
  const checkStatus = ['Published', 'Approved'];
  const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];
  const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress'];
  const editpageApproveButtonStatus = [
    'Rejected',
    'Pending Approval',
    'Review In Progress',
  ];
  const editPageSaveButtonStatus = [
    'Rejected',
    'In Draft',
    'Pending Approval',
    'Review In Progress',
  ];
  const editPageCancelButtonStatus = [
    'In Draft',
    'Pending Approval',
    'Rejected',
  ];

  return (
    <>
      {id && !checkStatus.includes(status) ? (
        <div className="d-flex  justify-content-end mt-5">
          <Button
            variant="none"
            className="f-16 d-flex align-items-center gap-3 text-info"
            onClick={() => {
              handleEdit(isEdit ? false : true);
            }}
          >
            <Span className="text-info">
              {isEdit ? 'Edit Assessment' : 'Manage Assessment'}
            </Span>
          </Button>
        </div>
      ) : null}
      <HeaderComponent
        title={
          id && isEdit
            ? 'View Chapter'
            : id && !isEdit
              ? 'Edit Chapter'
              : 'Create Assessment'
        }
        hidebreadcumb
      />
      <DndProvider backend={HTML5Backend}>
        {/* <h2 className="linetext mt-3 mb-5 text-muted">CHAPTER DETAILS</h2> */}
        <Row>
          <FormContext.Provider value={Providervalue}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Course Details */}{' '}
              <Row className="d-flex justify-content-center">
                <Col lg={10} className="mt-4 mb-4">
                  <Form.Group controlId="name" className="mb-3">
                    <Row className="">
                      <Col lg="2">
                        <label
                          for="Technologyskills"
                          className="create-course-label"
                        >
                          Technology/Skills *
                        </label>
                      </Col>
                      {console.log(selectedSkills, 'selectedskill')}
                      <Col lg="9">
                        <Controller
                          name="technology_skills"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              placeholder="Please select"
                              hideSelectedOptions={false}
                              isClearable={true}
                              value={selectedSkills}
                              isDisabled={id ? isEdit : false}
                              options={technology}
                              onChange={(selectedOption) => {
                                setSelectedSkills(selectedOption);
                                onChange((selectedOption?.id));
                              }}
                              styles={{
                                menu: (styles) => ({
                                  ...styles,
                                  zIndex: '999',
                                }),
                              }}
                              getOptionLabel={(option) => option?.name}
                              getOptionValue={(option) => option?.id}
                            />
                          )}
                        />
                        {errors.technology_skills?.message &&
                          selectedSkills == null && (
                            <p className="invalid-feedback">
                              {errors.technology_skills?.message ||
                                errors.technology_skills?.name.message}
                            </p>
                          )}
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="name" className="mb-4 mt-3">
                    <FormFieldRow
                      size="md"
                      size1="2"
                      size2="9"
                      name="title"
                      type="input"
                      inputRef={register('title')}
                      error={errors.title}
                      label="Assessment Title *"
                      labelClassName="create-course-label"
                      placeHolder="Assessment Title"
                      className="required"
                      disabled={id ? isEdit : false}
                    />{' '}
                    <Form.Group controlId="question" className="mb-4 mt-3 ">
                      {' '}
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="9"
                        name="question"
                        type="textarea"
                        rows="5"
                        inputRef={register('question')}
                        error={errors.question}
                        label="Question : "
                        labelClassName="create-course-label"
                        placeHolder="Write Question here"
                        className="required"
                        // formtext="Describe the Assessment shortly"
                        disabled={id ? isEdit : false}
                      />{' '}
                    </Form.Group>
                  </Form.Group>{' '}
                  <Form.Group controlId="name" className="mb-3">
                    <Row className="">
                      <Col lg="2">
                        <label
                          for="OptionsCount"
                          className="create-course-label"
                          htmlFor="dropdownSelect"
                        >
                          Options Count *
                        </label>
                      </Col>
                      {console.log(selectedSkills, 'selectedskill')}
                      <Col lg="2">
                        <select
                          className="form-control"
                          id="dropdownSelect"
                          value={selectedValue}
                          onChange={handleDropdownChange}
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Group className="mb-4">
                        <Row
                          style={{
                            minHeight: '5vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}
                        >
                          {/* <Col lg={2}>
                            <Form.Label className="create-course-label">
                              Options Type *
                            </Form.Label>
                          </Col> */}
                          {/* <Col lg={9}>
                            <Box className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="radio"
                                label="Number"
                                name="difficultyRadio"
                                value="Number"
                                checked={selectedDifficulty === 'Number'}
                                onChange={handleDifficultyChange}
                                className="text-muted d-flex"
                                style={{ fontSize: 'smaller' }}
                                disabled={id ? isEdit : false}
                              />{' '}
                              <Form.Check
                                inline
                                type="radio"
                                label="Alphabet"
                                name="difficultyRadio"
                                value="Alphabat"
                                checked={selectedDifficulty === 'Alphabat'}
                                onChange={handleDifficultyChange}
                                className="text-muted d-flex"
                                style={{ fontSize: 'smaller' }}
                                disabled={id ? isEdit : false}
                              />
                              <Form.Check
                                inline
                                type="radio"
                                label="None"
                                name="difficultyRadio"
                                value="None"
                                checked={selectedDifficulty === 'none'}
                                onChange={handleDifficultyChange}
                                className="text-muted d-flex"
                                style={{ fontSize: 'smaller' }}
                                disabled={id ? isEdit : false}
                              />
                            </Box>
                            {errors.level && selectedDifficulty == null && (
                              <p className="invalid-feedback">
                                {errors.level?.message
                                  ? errors.level?.message
                                  : errors.level?.name.message}
                              </p>
                            )}
                          </Col> */}
                        </Row>
                      </Form.Group>
                    </Row>
                  </Form.Group>
                  {fields.map((value, index) => (
                    <Row className="dropInputRow" key={index}>
                      <Form.Group
                        as={Row}
                        controlId="formGroupExample"
                        style={{ minHeight: '10vh' }}
                      >
                        <Form.Label
                          column
                          sm={2}
                          style={{ fontSize: 'smaller' }}
                        >
                          {`Options:`
                            //  ${selectedDifficulty === 'Number'
                            //     ? index + 1
                            //     : String.fromCharCode('A'.charCodeAt(0) + index)
                            //   }


                          }
                        </Form.Label>

                        <Col sm={8}>
                          {/* <Form.Control type="text" placeholder="Enter Your Options" ref={register(`options.${index}.option`)} /> */}
                          <FormField
                            data-testid="firstname"
                            name={`options.${index}.option`}
                            type="text"
                            placeholder='Enter Your Options'
                            error={errors.options}
                            inputRef={register(
                              `options.${index}.option`
                            )}
                          />
                        </Col>
                        <Col sm={2}>
                          <Form.Check
                            type="radio"
                            name="radioGroup"
                            id={`radioOption${index + 1}`}
                            label="Answer"
                            ref={register(`options.${index}.answer`)}
                            onChange={(e) => answerdData(index)}
                          />
                        </Col>
                      </Form.Group>
                    </Row>
                  ))}
                  {/* <NumberDropDown/> */}
                  <Row>
                    <Col xl={11}>
                      <Box className=" d-flex justify-content-end">
                        <ButtonToolbar aria-label="Toolbar with button groups">
                          {/* view page */}
                          {id && isEdit ? (
                            <>
                              {editPageApproveButtonRoles.includes(userrole) &&
                                editPageRejectButtonStatus.includes(
                                  chapterData?.status
                                ) && (
                                  <ButtonGroup
                                    className=""
                                    aria-label="Second group"
                                  ></ButtonGroup>
                                )}
                              <Modals
                                btn="Reject"
                                type={type}
                                value={btnValue}
                                valuetype="chapter"
                                id={id}
                                show={isModalOpen}
                                onHide={() => {
                                  setIsModalOpen(false);
                                }}
                              />
                              {editPageApproveButtonRoles.includes(userrole) &&
                                editpageApproveButtonStatus.includes(
                                  chapterData?.status
                                ) && (
                                  <ButtonGroup
                                    className="me-0"
                                    aria-label="Third group"
                                  >
                                    <Button
                                      className=" topicc-savee-btnn rounded-5 px-5"
                                      type="button"
                                      value="Approved"
                                      onClick={updateChapterStatus}
                                    >
                                      Approve
                                    </Button>
                                  </ButtonGroup>
                                )}
                            </>
                          ) : id && !isEdit ? (
                            <>
                              {/* Edit Page */}
                              <ButtonGroup
                                className=""
                                aria-label="Second group"
                              >
                                {editPageSaveButtonStatus.includes(
                                  chapterData?.status
                                ) && (
                                    <>
                                      <Button
                                        className="chapter-save-btn  rounded-5 px-2"
                                        type="submit"
                                        onClick={() => {
                                          if (
                                            auth?.user?.role?.[0]?.['name'] ==
                                            'Admin'
                                          ) {
                                            setSaveType('Approved');
                                          } else {
                                            setSaveType('Pending Approval');
                                          }
                                        }}
                                      >
                                        {pending && saveType !== 'In Draft' ? (
                                          <Span className=" d-flex justify-content-center">
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
                                            {userrole === 'Trainer' &&
                                              chapterData?.status != 'In Draft'
                                              ? 'Send for approval'
                                              : 'Save'}
                                          </>
                                        )}
                                      </Button>
                                    </>
                                  )}

                                {userrole == 'Trainer' &&
                                  editPageCancelButtonStatus.includes(
                                    chapterData?.status
                                  ) ? (
                                  <Button
                                    className="chapter-save-btn"
                                    variant="outline-primary"
                                    type="button"
                                    onClick={handleReset}
                                  >
                                    {' '}
                                    Cancel
                                  </Button>
                                ) : (
                                  chapterData?.status == 'In Draft' && (
                                    <Button
                                      className="chapter-save-btn"
                                      variant="outline-primary"
                                      type="button"
                                      onClick={handleReset}
                                    >
                                      Cancel
                                    </Button>
                                  )
                                )}
                                <>
                                  {editpageApproveButtonStatus.includes(
                                    chapterData?.status
                                  ) &&
                                    editPageApproveButtonRoles.includes(
                                      userrole
                                    ) && (
                                      <Button
                                        className=" topicc-savee-btnn rounded-5 px-5"
                                        type="button"
                                        value="Approved"
                                        onClick={updateChapterStatus}
                                      >
                                        Approve
                                      </Button>
                                    )}

                                  {editPageApproveButtonRoles.includes(
                                    userrole
                                  ) &&
                                    editPageRejectButtonStatus.includes(
                                      chapterData?.status
                                    ) && (
                                      <Button
                                        className=" topic-cancel-btn space1 rounded-5"
                                        variant="outline-primary"
                                        type="button"
                                        value="Reject"
                                        onClick={() => {
                                          props.handleEdit, updateChapterStatus;
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    )}
                                </>
                              </ButtonGroup>
                            </>
                          ) : (
                            <>
                              <ButtonGroup
                                className="align-items-end"
                                aria-label="First group"
                              >
                                <Button
                                  className="chapter-draft-btn px-0 py-1"
                                  variant="outline-white text-primary"
                                  type="submit"
                                  onClick={() => {
                                    setSaveType('In Draft');
                                    console.log(`${saveType} clicked`);
                                  }}
                                >
                                  Save as Draft
                                </Button>
                                <Button
                                  className="chapter-save-btn"
                                  variant="outline-primary"
                                  type="button"
                                  onClick={handleReset}
                                >
                                  {' '}
                                  Cancel
                                </Button>{' '}
                                <Button
                                  className="chapter-save-btn me-0"
                                  variant="primary"
                                  type="submit"
                                  onClick={() => {

                                    if (
                                      auth?.user?.role?.[0]?.['name'] ===
                                      'Admin' ||
                                      auth?.user?.role?.[0]?.['name'] ===
                                      'Super Admin' ||
                                      auth?.user?.role?.[0]?.['name'] ===
                                      'Job Architect'
                                    ) {
                                      setSaveType('Approved');
                                    } else {
                                      setSaveType('Pending');
                                    }
                                    console.log(`${saveType} clicked`);
                                    // handleSubmit();
                                  }}
                                >
                                  {pending && saveType !== 'In Draft' ? (
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
                      </Box>
                    </Col>
                  </Row>
                </Col>{' '}
              </Row>{' '}
              {/* Course Details */}
              {/* Chapter Details */}
              {/* <Row className="d-flex justify-content-center">
                <Col lg={10} className="">
                 
                </Col>
              </Row> */}
              {/* {userrole == "Trainer" &&
                <Row className="d-flex justify-content-center">
                  <Col lg={10} className=" mb-5">
                   

                  </Col>
                </Row>
              } */}
              {/* <Row className="d-flex justify-content-center">
                <Col lg={5}>
                  
                </Col>
              </Row> */}
            </Form>
          </FormContext.Provider>
        </Row>
      </DndProvider>
    </>
  );
};
export default CreateAssessment;
