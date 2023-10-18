import './CreateChapter.css';
import {
  Form,
  Row,
  Col,
  Table,
  Button,
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
  FormFieldRow,
  DocumentIcon,
  VideoIcon,
  SearchBar,
  RoundPlus,
  TopicAccordian,
  FormContext,
  DraggableComponent,
  Modals,
  HeaderComponent,
  Box,
  FormField,
  Span,
  DroppableComponent,
} from '@athena/web-shared/ui';
import {
  useForm,
  Controller,
  useFieldArray,
} from 'react-hook-form';
import Select from 'react-select';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  apiRequest,
  Router,
  skills,
  useAuth,
  useParams,
  useRouter,
  isFoundTopic,
  addChapterSchema,
  checkStatus,
  checkTrainerStatus,
  editPageSaveButtonStatus,
  editPageCancelButtonStatus,
  editpageApproveButtonStatus,
  editpageCancelButtonStatus,
  editPageRejectButtonStatus,
  editPageRejectHideStatus,
  editPageApproveButtonRoles
} from '@athena/web-shared/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const CreateChapter = (props) => {

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    clearErrors,
    control,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addChapterSchema) });

  const {
    fields: topic_fields,
    append,
    remove: removetopic,
    move,
  } = useFieldArray({
    control,
    name: 'topics',
  });

  const [userrole, setuserrole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [saveType, setSaveType] = useState(null);
  const [topics, setTopics] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [topicType, setTopicType] = useState('All');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('All');
  const [chapterData, setChapterData] = useState('');
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const auth = useAuth();

  const [filterText, setFilterText] = useState('');
  const [pageN, setPageN] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [selectedJobArchitect, setSelectedJobArchitect] = useState(null);
  const [technology, setTechnology] = useState([]);
  const [pending, setPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(true);
  const [JobArchitectsData, setJobArchitectsData] = useState([]);
  const [type, setType] = useState('');
  const [btnValue, setBtnValue] = useState('');
  const [Totalpage, setTotalpage] = useState('');
  const scrollContainerRef = useRef(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleEdit = (value) => {
    setIsEdit(value);
  };


  const handleJobArchitectChange = (selected) => {
    setValue('approver', selected?.id);
    setSelectedJobArchitect(selected);
  };
  useEffect(() => {
    if (auth && auth.user) {
      setuserrole(auth.user?.role[0].name);
    }
  }, [auth.user]);

  useEffect(() => {
    console.log("ttyytytyt", errors)
  }, [errors])


  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    if (selectedSkills != null) {
      setShow(true);
    }
    else {
      toast.info('Please choose Technology first');
    }
  };

  const getChapterById = async () => {
    const getChapterByIdResponse = await apiRequest(
      `api/courses/chapters/${id}`
    );
    setChapterData(getChapterByIdResponse?.value);
    setStatus(getChapterByIdResponse?.value?.status);
    console.log(getChapterByIdResponse, 'getChapterByIdResponse');
  };

  useEffect(() => {
    if (chapterData) {
      for (const key in chapterData) {
        if (key === 'title') {
          setValue('title', chapterData['title']);
        }
        if (key === 'description') {
          setValue('description', chapterData['description']);
        }
        if (key == 'level') {
          setValue('level', chapterData['level']);
          setSelectedDifficulty(chapterData['level']);
        }
        if (key == 'technology_skills') {
          setSelectedSkills(
            technology.find((e) => Number(e.id) === Number(chapterData['technology_skills']))
          );
          setValue(
            'technology_skills',
            technology.find((e) => Number(e.id) === Number(chapterData['technology_skills']))
          );
        }
        if (key == 'chapter_topics') {
          const chapterTopics = chapterData['chapter_topics'];
          const topics = [];
          if (chapterTopics && chapterTopics.length) {
            chapterTopics.forEach((topic) => {
              topics.push({
                title: topic.title,
                description: topic.description,
                topic_type: topic.topic_type,
                delivery_type: topic.delivery_type,
                level: topic.level,
                duration: topic.duration,
                topic_file: topic.attachment_url,
              });
            });
          }
          setValue('topics', topics);
        }
        if (
          chapterData?.status == 'Pending Approval' &&
          userrole == 'Job Architect'
        ) {
          setIsModalOpen(true);
          setType('chapterStatusReview');
        }
      }
    }
  }, [chapterData]);
  useEffect(() => {
    if (id) {
      getChapterById();
    } else {
      handleReset();
    }
  }, [id]);

  const getTop = async (pageNo, size) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
          topicData: { rows, totalPages },
        },
      } = await apiRequest(
        'api/courses/topics/searchAndFilterTopic',
        'POST',
        requestParams
      );
      setTotalpage(totalPages);
      if (pageN === 1) {
        setTopics(rows);
      } else {
        setTopics((prevTopics) => [...prevTopics, ...rows]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
      if (pageN < Totalpage) {
        setPageN((prevPage) => prevPage + 1);
      } else {
        return null;
      }
    }
  };

  useEffect(() => {
    getTop(pageN, pageSize);
  }, [pageN, pageSize, filterText, selectedSkills]);

  const handleCheckboxChange = (topic, isChecked) => {
    if (isChecked) {
      setSelectedTopics((prev) => [...prev, topic]);
    } else {
      setSelectedTopics((prev) => prev.filter((item) => item !== topic));
    }
  };
  const handleAddTopic = () => {
    onSave(selectedTopics);
  };

  const onSave = (selectedTopics) => {
    const selectedTopicIds = selectedTopics.map((topic) => topic.id);
    const topicsToRemove = topic_fields.filter((field) => {
      if ('topic_id' in field && !selectedTopicIds.includes(field.topic_id)) {
        return true;
      }
      return false;
    });
    console.log('remove', topicsToRemove)

    topicsToRemove.reduceRight((_, topic, index) => {
      const topicIndex = topic_fields.findIndex((field) => field.topic_id === topic.topic_id);
      if (topicIndex !== -1) {
        removetopic(topicIndex);
      }
    }, null);

    selectedTopics.forEach((topic) => {
      if (!topic_fields.some((field) => field.topic_id === topic.id)) {
        append({ topic_id: topic.id });
      }
    });
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setSelectedTopics(event.target.checked ? topics : []);
  };

  const handleDragTopic = (topic, filteredItems) => {
    if (filteredItems.includes(topic)) {
      return;
    }
    else {
      Addtopicidonly(topic.id, filteredItems);
      setSelectedTopics((prev) => [...prev, topic]);
    }
  }

  /**Select all */
  const CanvasTopics = () => {
    return (
      <button
        variant="white"
        onClick={handleShow}
        className="p-0 w-100 mt-2 border-0"
        type='button'
      >
        <Card className="text-primary bg-light py-2">
          {/* {show ? `Hide Topics` : `+ Add Topics`} */}
          Drag and drop topics here
        </Card>
      </button>
    );
  };

  const handleReset = () => {
    reset({
      title: '',
      description: '',
      topics: [],
    });
    setValue('level', '');
    setSelectedDifficulty(null);
    setValue('technology_skills', '');
    setSelectedSkills(null);
    setSelectedJobArchitect(null);
    setValue('approver', null);
    // if (id) {
    //   router.navigate('/app/managechapter');
    // }
  };

  useEffect(() => {
    console.log("saveeeeeeee", saveType);
  },[saveType])

  const handleDeselectTopic = (topic) => {
    setSelectedTopics((prev) => prev.filter((item) => item.id !== topic.id));
    let index = topic_fields?.findIndex((x) => x?.topic_id === topic?.id);
    removetopic(index);
  };

  const onSubmit = async (data) => {
    setPending(false);

    console.log('dataaa', saveType, data);
    setPending(true);
    let a = JSON.parse(JSON.stringify(data));
    try {
      data['to_be_reviewed_by'] = Number(data['approver']);
      delete data['approver'];
      if (data) {
        // if (data['null']) data['null'] = null;
        Object.keys(data).forEach((property) => {
          if (
            typeof data[property] === 'string' &&
            data[property]?.trim() === ''
          )
            data[property] = null;
        });
        data.status =
          saveType === 'In Draft'
            ? 'In Draft'
            : saveType === 'Pending Approval'
              ? 'Pending Approval'
              : 'Approved';
        data.slug = data.title;
        // data.topics = data.topics_details;
        // delete data.topics_details;
        data.topics = data.topics.map((obj) => {
          console.log(obj, 'objjjjj');
          if (!Object.keys(obj).includes('topic_id')) {
            if (
              obj['topic_type'] == 'Topic Link' &&
              'topic_link' in obj &&
              obj['topic_link'] !== null
            ) {
              delete obj.file;
              return obj;
            } else {
              delete obj.topic_link;
              return {
                ...obj,
                file: obj.file[0],
              };
            }
          } else {
            return {
              id: obj['topic_id'],
            };
          }
        });
        console.log('yuyuyuyu', JSON.stringify(data.topics));

        let formData = new FormData();
        for (const i in data) {
          if (i == 'topics') {
            data[i].forEach((topic, index) => {
              if (!('id' in topic)) {
                topic.status = data.status;
                if (data['to_be_reviewed_by']) {
                  topic.to_be_reviewed_by = Number(data['to_be_reviewed_by']);
                }
              }
              for (var key in topic) {
                formData.append(`topics[${index}][${key}]`, topic[key]);
                console.log('key::', `topics[${index}][${key}]`, topic[key]);
                // if(key === "file"){
                //   formData.append(`topics[${index}]["filename"]`, topic[key]["path"]);
                // }
              }
            });
          } else {
            formData.append(i, data[i]);
          }
        }
        [...formData.entries()].forEach((e) =>
          console.log('zzzzzzzzz', e, typeof e)
        );

        const url = 'api/courses/chapters/create/chapter';
        // id
        // ? `api/courses/chapters/${id}`
        // : 'api/courses/chapters/create/chapter';
        const method = 'POST';
        // id ? 'PUT' : 'POST';
        const response = await apiRequest(url, method, formData, true);
        console.log('rrrrrrrr', response);
        if (response.status === 'success') {
          setPending(false);
          toast.success(
            saveType === 'Draft'
              ? 'Chapter saved in draft'
              : 'Chapter saved successfully'
          );
          handleReset();
          clearErrors('topics');
        } else {
          setPending(false);
          toast.error(response.message?.message);
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.log('@@@@@', error);
    }
    setPending(false);
  };

  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );

  const Addtopicidonly = (topicId, topic) => {
    if (!isFoundTopic(topic, topicId)) {
      append({ topic_id: topicId });
    } else {
      return null;
    }
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setValue('level', e.target.value);
  };

  const Addtopicall = () => {
    append({
      title: '',
      description: '',
      topic_type: '',
      delivery_type: '',
      technology_skills: '',
      level: '',
    });
  };

  const AccordionHeaderClick = (index) => {
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((dat) => dat !== index));
    } else {
      setActiveAccordion((prevArray) => [...prevArray, index]);
    }
  };

  const handleSaveClick = (event, index) => {
    event.stopPropagation();
    setActiveAccordion(
      activeAccordion.filter((accIndex) => accIndex !== index)
    );
  };

  const TableRow = ({ topic }) => {
    return (
      <DraggableComponent
        type="table-row"
        item={topic}
        renderElement={'tr'}
        handleClose={handleClose}
      >
        {topic.title.length > 30 ? (
          <OverlayTrigger
            delay={{ show: 1000, hide: 400 }}
            placement="bottom-start"
            overlay={renderTooltip(`${topic.title}`)}
          >
            <td>
              <div className="form-check">
                <Form.Check
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={(e) => {
                    handleCheckboxChange(topic, e.target.checked);
                  }}
                />
                {topic.title.slice(0, 25) + '...'}
              </div>
            </td>
          </OverlayTrigger>
        ) : (
          <td>
            <div className="form-check">
              <Form.Check
                type="checkbox"
                checked={selectedTopics.includes(topic)}
                onChange={(e) => {
                  handleCheckboxChange(topic, e.target.checked);
                }}
              />
              {topic.title}
            </div>
          </td>
        )}
        <td>
          {topic.delivery_type === 'Podcast' ||
            topic.delivery_type === 'Video' ? (
            <VideoIcon />
          ) : topic.delivery_type === 'Reading Material' ? (
            <DocumentIcon />
          ) : null}
        </td>
        {/* <td>{`${Math.floor(topic.duration)} mins`}</td> */}
        <td>
          {topic.duration === '1' || topic.duration === '0'
            ? `${Math.floor(topic.duration)} min`
            : `${Math.floor(topic.duration)} mins`}
        </td>
      </DraggableComponent>
    );
  };

  const TableList = ({ items }) => {
    return (
      <>
        <Table>
          <tbody>
            {items
              ?.filter(
                (topic) =>
                  ((topicType === 'All' || topic.topic_type === topicType) &&
                    (deliveryTypeFilter === 'All' ||
                      topic.delivery_type === deliveryTypeFilter)) ||
                  filteredItems.includes(topic)
              )
              .map((topic, index) => (
                <TableRow key={topic.id} topic={topic} />
              ))}
          </tbody>
        </Table>
        {isLoading && (
          <Span className="d-flex align-items-center justify-content-center loader-text">
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
        )}
      </>
    );
  };

  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  const handleSort = async () => {
    move(dragItem.current, dragOverItem.current);
  };

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
      setError
    }),
    [register, control, setValue, getValues, selectedSkills, errors, isEdit, trackId, reset, setError]
  );
  const updateChapterStatus = async (event) => {
    const value = event.target.value;
    let data = {};
    if (value === 'Approved') {
      data['status'] = value;
    } else {
      data['status'] = value;
      data['reason'] = 'reason for reject';
    }
    let statusUpdateResponse = await apiRequest(
      `api/courses/chapters/${id}`,
      'PUT',
      data
    );
    if (statusUpdateResponse) {
      toast.success('Chapter Approved successfully');
      router.navigate(`/app/managechapter`);
    }
  };

  const getTechnology = async () => {
    const getTechnologyResponse = await apiRequest(
      `api/courses/domainTechnology/getDomainTechnology/technology`
    );
    setTechnology(
      getTechnologyResponse?.value?.map((e) => {
        return { name: e.name, id: e.id };
      })
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

  useEffect(() => {
    getTechnology();
    getJobArchitect();
  }, []);
  // const checkStatus = ['Published', 'Approved'];
  // const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];
  // const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress'];
  // const editpageApproveButtonStatus = [
  //   'Rejected',
  //   'Pending Approval',
  //   'Review In Progress',
  // ];
  // const editPageSaveButtonStatus = [
  //   'Rejected',
  //   'In Draft',
  //   'Pending Approval',
  //   'Review In Progress',
  // ];
  // const editPageCancelButtonStatus = [
  //   'In Draft',
  //   'Pending Approval',
  //   'Rejected',
  // ];

  useEffect(() => {
    console.log(errors, 'errr')
  }, [errors])
  return (
    <>
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
                  {isEdit ? 'Edit Chapter' : 'View Chapter'}
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
                  {isEdit ? 'Edit Chapter' : 'View Chapter'}
                </Span>
              </Button>
            </div>
          ) : null}
        </>

      )}

      <HeaderComponent
        title={
          id && isEdit
            ? 'View Chapter'
            : id && !isEdit
              ? 'Edit Chapter'
              : 'Create Chapter'
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
                  <Form.Group controlId="name" className="mb-4 mt-3">
                    <FormFieldRow
                      size="md"
                      size1="2"
                      size2="9"
                      name="title"
                      type="input"
                      inputRef={register('title')}
                      error={errors.title}
                      label="Chapter Title *"
                      labelClassName="create-course-label"
                      placeHolder="Chapter title"
                      className="required"
                      disabled={id ? isEdit : false}
                    />{' '}
                  </Form.Group>{' '}
                  <Form.Group controlId="description" className="mb-4 mt-3 ">
                    {' '}
                    <FormFieldRow
                      size="md"
                      size1="2"
                      size2="9"
                      name="description"
                      type="textarea"
                      rows="5"
                      inputRef={register('description')}
                      error={errors.description}
                      label="Description"
                      labelClassName="create-course-label"
                      placeHolder="Description here"
                      className="required"
                      formtext="Describe the chapter shortly"
                      formtextclassName="create-form-text"
                      disabled={id ? isEdit : false}
                    />{' '}
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Row>
                      <Col lg={2}>
                        <Form.Label className="create-course-label">
                          Level:{' '}
                        </Form.Label>
                      </Col>
                      <Col lg={9}>
                        <Box className="d-flex align-items-center">
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
                        </Box>
                        {errors.level && selectedDifficulty == null && (
                          <p className="invalid-feedback">
                            {errors.level?.message
                              ? errors.level?.message
                              : errors.level?.name.message}
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Form.Group>
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
                  <Form.Group className="mb-3">
                    <Row>
                      <Col lg={2} className="adjust2">
                        <Form.Label className="create-course-label">
                          Add Topic *
                        </Form.Label>
                      </Col>
                      <Col lg={9}>
                        <Offcanvas
                          style={{ width: '520px' }}
                          show={show}
                          onHide={handleClose}
                          placement="end"
                        >
                          {' '}
                          <Offcanvas.Header
                            closeButton
                            className="custom-close-button button "
                          >
                            {' '}
                            <Offcanvas.Title>
                              Explore Topics
                            </Offcanvas.Title>{' '}
                          </Offcanvas.Header>
                          <Span className="mx-3">
                            <Row>
                              <SearchBar
                                placeholder="Search text"
                                onChange={(e) => {
                                  setFilterText(e.target.value);
                                }}
                              />
                              <Form>
                                <Form.Group
                                  inline
                                  className="mx- md-3 form-group select-all-group"
                                >
                                  <Form.Check
                                    inline
                                    id="selectAll"
                                    label={`Select All`}
                                    name="selectAll"
                                    type="checkbox"
                                    className="form-check text-secondary"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  />
                                </Form.Group>
                              </Form>
                            </Row>
                          </Span>
                          <Offcanvas.Body
                            ref={scrollContainerRef}
                            className={`offcanvas-body${isLoading ? ' scrolled' : ''}`}
                            onScroll={handleScroll}
                          >
                            <Box className="mx-2 exp-topics">
                              <div>
                                <TableList items={topics} />
                              </div>
                            </Box>
                          </Offcanvas.Body>{' '}
                          <Row className=" d-flex justify-content-center align-items-center">
                          </Row>
                          <Offcanvas.Header>
                            <Span className="justify-content-center align-items-end"></Span>
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
                                    // handleClear();
                                    setSelectAll(false);
                                    setFilteredItems([]);
                                    // handleReset();
                                    reset({
                                      topics: [],
                                    });
                                  }}
                                >
                                  Clear All
                                </Button>
                                <Button
                                  className="chapter-save-btn"
                                  variant="primary"
                                  type="button"
                                  onClick={() => {
                                    handleAddTopic();
                                    toast.success(`Added ${selectedTopics.length} topics`);
                                    handleClose();
                                  }}
                                >
                                  Add Topic
                                </Button>
                              </ButtonGroup>
                            </ButtonToolbar>
                          </Offcanvas.Header>
                        </Offcanvas>
                        <DroppableComponent
                          accept="table-row"
                          onDrop={handleDragTopic}
                          fields={topic_fields}
                        >
                          <Accordion
                            className="mb-2"
                            activeKey={activeAccordion}
                            alwaysOpen
                          >
                            {topic_fields.map((topic, index) => (
                              <TopicAccordian
                                key={topic.id}
                                topicIndex={index}
                                topic={topic}
                                topicData={topics}
                                name={'topics'}
                                handleAccordionClick={AccordionHeaderClick}
                                handleSaveClick={handleSaveClick}
                                activeAccordion={activeAccordion}
                                dragitem={dragItem}
                                dragoveritem={dragOverItem}
                                handlesort={handleSort}
                                removetopic={removetopic}
                                setActiveAccordion={setActiveAccordion}
                                removecheck={handleDeselectTopic}
                              />
                            ))}
                          </Accordion>

                          {((trackId && !isEdit) || (!trackId && isEdit)) && (
                            <Box className="mt-2 mb-3">
                              {topics && <CanvasTopics />}
                              {errors.topics?.message && (
                                <p className="invalid-feedback">
                                  {errors.topics?.message ||
                                    errors.topics?.name.message}
                                </p>
                              )}
                            </Box>
                          )}
                        </DroppableComponent>
                        {((trackId && !isEdit) || (!trackId && isEdit)) && (
                          <Span onClick={Addtopicall}>
                            <RoundPlus /> &nbsp;&nbsp;New Topic
                          </Span>
                        )}
                      </Col>
                    </Row>
                  </Form.Group>
                  {userrole == 'Trainer' && (
                    <Form.Group controlId="add-chapter" className=" mb-3">
                      <Row>
                        <Col lg="2">
                          <label for="staticEmail" className="mt-3">
                            Approver
                          </label>
                        </Col>
                        <Col lg="9" className="mt-3">
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
                                  options={JobArchitectsData}
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
                    </Form.Group>
                  )}
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
                                  >
                                    <Button
                                      className="topic-cancel-btn space1 rounded-5"
                                      variant="outline-primary"
                                      type="button"
                                      value="Reject"
                                      onClick={() => {
                                        props.handleEdit,
                                          setIsModalOpen(true),
                                          updateChapterStatus,
                                          setType('RejectView'),
                                          setBtnValue('Reject');
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
                                  {/* {editpageApproveButtonStatus.includes(
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
                                    )} */}
                                  {editpageCancelButtonStatus.includes(
                                    chapterData?.status
                                  ) &&
                                    editPageApproveButtonRoles.includes(
                                      userrole
                                    ) && (
                                      <Button
                                        className="chapter-save-btn"
                                        variant="outline-primary"
                                        type="button"
                                        onClick={handleReset}
                                      >
                                        Cancel
                                      </Button>
                                    )}

                                  {editPageApproveButtonRoles.includes(
                                    userrole
                                  ) &&
                                    editPageRejectHideStatus.includes(
                                      chapterData?.status
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
                                            updateChapterStatus;
                                        }}
                                      >
                                        Reject
                                      </Button>
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
                                      setSaveType('Pending Approval');
                                    }
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
            </Form>
          </FormContext.Provider>
        </Row>
      </DndProvider>
    </>
  );
};
export default CreateChapter;
