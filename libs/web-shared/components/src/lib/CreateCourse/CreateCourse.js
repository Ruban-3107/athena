import './CreateCourse.css';
import {
  Form,
  Row,
  Col,
  Button,
  Offcanvas,
  Table,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Card,
  ButtonGroup,
  ButtonToolbar
} from 'react-bootstrap';
import {
  FormFieldRow,
  Reactdropzone,
  SearchBar,
  RoundPlus,
  ChapterAccordion,
  FormContext,
  DraggableComponent,
  Modals,
  Box,
  DeleteIcon,
  FormField,
  Loader,
  Span,
  DroppableComponent,
  HeaderComponent
} from '@athena/web-shared/ui';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  apiRequest,
  skills,
  useAuth,
  useParams,
  useRouter,
  addCourseSchema,
  isFoundChapter,
  userdropzonelabelImage
} from '@athena/web-shared/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CrossIcon } from '../../../../ui/src';

export const CreateCourse = (props) => {
  const methods = useForm({ resolver: yupResolver(addCourseSchema) });
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    getValues,
    unregister,
    control,
    setError,
    formState: { errors },
  } = methods;

  const {
    fields: chapter_fields,
    append: append_chapter,
    remove: remove_chapter,
    move,
  } = useFieldArray({
    control,
    name: 'chapters_details',
  });

  const Addchapterall = () => {
    append_chapter({ title: '', description: '' });
  };


  const scrollContainerRef = useRef(null);
  const [file, setFile] = useState([]);
  const [uploadFileData, setUploadFileData] = useState(null);
  const [existingFile, setExistingFile] = useState(true);

  const [page, setPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedTrackType, setSelectedTrackType] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
  const [userrole, setuserrole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectAll, setSelectAll] = useState(false);

  const [filteredItems, setFilteredItems] = useState([]);

  const [chapters, setChapters] = useState([]);

  const [show, setShow] = useState(false);

  const [saveType, setSaveType] = useState(null);

  const [level, setLevel] = useState('');
  const [permission, setPermission] = useState('');
  const [loader, setLoader] = useState(false);

  const [trackData, setTrackData] = useState('');
  const [filterText, setFilterText] = useState('');
  const [pageN, setPageN] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [isClearable, setIsClearable] = useState(true);
  const [selectedJobArchitect, setSelectedJobArchitect] = useState(null);
  const [technology, setTechnology] = useState([]);
  const [technologySkill, setTechnologySkill] = useState(null);
  const [pending, setPending] = useState(false);
  const [editimage, setEditimage] = useState();
  const [JobArchitectsData, setJobArchitectsData] = useState([]);
  const [status, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(true);
  const [Totalpage, setTotalpage] = useState('');
  const [selectedChapters, setSelectedChapters] = useState([]);

  const [type, setType] = useState('');
  const [btnValue, setBtnValue] = useState('');
  const checkStatus = ['Published', 'Approved'];
  const editPageSaveButtonStatus = ['Rejected', 'In Draft', 'Pending Approval', 'Review In Progress'];
  const editPageCancelButtonStatus = ['In Draft', 'Pending Approval', 'Rejected'];
  const editpageApproveButtonStatus = ['Rejected', 'Pending Approval', 'Review In Progress'];
  const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress'];
  const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];

  const handleEdit = (value) => {
    setIsEdit(value)
  }
  const handleJobArchitectChange = (selected) => {
    console.log('////////', selected);
    setValue('approver', selected?.id);
    setSelectedJobArchitect(selected);
  };

  const params = useParams();
  const { id: trackId } = params;
  const router = useRouter();
  const auth = useAuth();

  let chaptersResponse;

  useEffect(() => {
    if (auth && auth.user) {
      console.log('auth.user?.role[0].name', auth.user?.role[0].name);
      setuserrole(auth.user?.role[0].name);
    }
  }, [auth.user]);

  const handleShow = () => {
    if (selectedSkills != null) {
      setShow(true);
    }
    else {
      toast.info('Please choose technology first')
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setSelectedChapters(event.target.checked ? chapters : []);
  };

  const handleCheckboxChange = (chapter, isChecked) => {
    if (isChecked) {
      setSelectedChapters((prev) => [...prev, chapter]);
    } else {
      setSelectedChapters((prev) => prev.filter((item) => item !== chapter));
    }
  };
  const handleAddChapter = () => {
    onSave(selectedChapters);
  };

  const onSave = (selectedChapters) => {
    const selectedChapterIds = selectedChapters.map((chapter) => chapter.id);
    const chaptersToRemove = chapter_fields.filter((field) => !!('chapter_id' in field && !selectedChapterIds.includes(field.chapter_id)));

    chaptersToRemove.reduceRight((_, chapter, index) => {
      const chapterIndex = chapter_fields.findIndex((field) => field.chapter_id === chapter.chapter_id);
      if (chapterIndex !== -1) {
        remove_chapter(chapterIndex);
      }
    }, null);

    selectedChapters.forEach((chapter) => {
      if (!chapter_fields.some((field) => field.chapter_id === chapter.id)) {
        append_chapter({ chapter_id: chapter.id });
      }
    });
  };

  const handleClear = () => {
    setValue('cover_image', null);
    setEditimage('')
    setPending(false);
    setUploadFileData(null);
    setSelectedDifficulty('');
    setSelectedPermission('');
    setSelectedTrackType('');
    setSelectedSkills(null);
    setSelectedJobArchitect(null);
    setValue('approver', null);
    reset();
    reset({
      chapters_details: [],
    });
  };

  const handleClearchapter = () => {
    setSelectedChapters([]);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setLevel(e.target.value);
    setValue('level', e.target.value);
  };
  const handlePersmissionChange = (e) => {
    setSelectedPermission(e.target.value);
    setPermission(e.target.value);
    setValue('permission', e.target.value);
  };

  const handleCourseTypeChange = (e) => {
    setSelectedTrackType(e.target.value);
    setValue('track_type', e.target.value);
  };

  const CanvasChaptersButton = () => {
    return (
      <button
        variant="white"
        onClick={handleShow}
        className="p-0 w-100 border-0"
        type='button'
      >
        <Card className="text-primary bg-light py-2">
          {/* {show ? `Hide Topics` : `+ Add Topics`} */}
          Drag and drop chapters here
        </Card>
      </button>
    );
  };

  const fileData = (data) => {
    setValue('cover_image', data);
    setUploadFileData(data[0]?.preview);
  };

  const onSubmit = async (data) => {
    console.log("coursedata", data, JSON.stringify(data));
    setPending(true);
    try {
      data['to_be_reviewed_by'] = Number(data['approver']);
      delete data['approver'];
      if (data) {
        Object.keys(data).forEach((property) => {
          if (
            typeof data[property] === 'string' &&
            data[property]?.trim() === ''
          )
            data[property] = null;
        });
        data.level =
          selectedDifficulty === 'Beginner'
            ? 'Beginner'
            : selectedDifficulty === 'Intermediate'
              ? 'Intermediate'
              : 'Advanced';
        data.track_type =
          selectedTrackType === 'upskill'
            ? 'upskill'
            : selectedTrackType === 'certification'
              ? 'certification'
              : 'softskill';
        data.permission =
          selectedPermission === 'Public' ? 'Public' : 'Private';
        data.status =
          saveType === 'In Draft'
            ? 'In Draft'
          : saveType === 'Pending Approval'
              ? 'Pending Approval'
              : 'Approved';
        data.slug = data['title'];
        data.chapters = data.chapters_details;
        delete data.chapters_details;
        data.chapters = data?.chapters?.map((obj) => {
          if (!Object.keys(obj).includes('chapter_id')) {
            // obj.slug = obj.title;
            obj.topics = obj.topics.map((x) => {
              if (!Object.keys(x).includes('topic_id')) {
                if ('topic_link' in x) {
                  delete x.file;
                  return x;
                } else {
                  return {
                    ...x,
                    file: x.file[0],
                  };
                }
              } else {
                return {
                  id: x['topic_id'],
                };
              }
            });
            delete obj.topics_details;
            return obj;
          } else {
            return {
              id: obj['chapter_id'],
            };
          }
        });

        console.log('afterdata', data, JSON.stringify(data));
        let formData = new FormData();
        for (const i in data) {
          console.log('data::', data, 'i::', i);
          if (i === 'chapters') {
            data[i].forEach((chapter, chapterIndex) => {
              if (!('id' in chapter)) {
                chapter.slug = chapter.title;
                chapter.status = data.status;
                if (data['to_be_reviewed_by']) {
                  chapter.to_be_reviewed_by = data['to_be_reviewed_by'];
                }
              }
              console.log('chaptersssssss', chapter);
              for (const j in chapter) {
                if (j === 'topics' && chapter[j].length > 0) {
                  chapter[j].forEach((topic, topicIndex) => {
                    if (!('id' in topic)) {
                      topic.status = data.status;
                      if (data['to_be_reviewed_by']) {
                        topic.to_be_reviewed_by = data['to_be_reviewed_by'];
                      }
                    }
                    for (const key in topic) {
                      formData.append(
                        `chapters[${chapterIndex}][${j}][${topicIndex}][${key}]`,
                        topic[key]
                      );
                    }
                  });
                } else {
                  formData.append(
                    `chapters[${chapterIndex}][${j}]`,
                    chapter[j]
                  );
                }
              }
            });
          } else if (i === 'cover_image') {
            formData.append(i, data[i][0]);
          } else {
            formData.append(i, data[i]);
          }
        }
        [...formData.entries()].forEach((e) =>
          console.log('zzzzzzzzz', e, typeof e)
        );

        let response = await apiRequest(
          'api/courses/tracks/create/track',
          'POST',
          formData,
          true
        );
        if (response.status === 'success') {
          setPending(false)
          toast.success(
            saveType === 'Draft'
              ? 'Course saved in Draft'
              : 'Course saved successfully'
          );
          setPage(1);
          handleClear();
        } else {
          setPending(false);
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error('Something Went Wrong');
      console.log(error);
    }
  };

  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );

  const getCH = async (pageNo, size) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let requestParams = { pageNo, size };
      requestParams['status'] = 'Approved';
      // requestParams.status = "Approved"
      if (technologySkill) {
        requestParams.technology_skills = technologySkill;
      }
      if (filterText) {
        requestParams.searchkey = filterText;
      }

      const {
        value: {
          chapterData: { rows, totalPages },
        },
      } = await apiRequest(
        'api/courses/chapters/getChapters',
        'POST',
        requestParams
      );
      setTotalpage(totalPages);
      if (pageN === 1) {
        setChapters(rows)
      }
      else {
        setChapters((prevChap) => [...prevChap, ...rows]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCH(pageN, pageSize);
  }, [pageN, pageSize, filterText, technologySkill]);

  const getTrackById = async () => {
    try {
      setLoader(true);
      const response = await apiRequest(`api/courses/tracks/${trackId}`);
      console.log('reses', response);
      setTrackData(response?.value);
      setStatus(response?.value?.status);
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const ChapterAccordionHeaderClick = (index) => {
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((dat) => dat != index));
    } else {
      setActiveAccordion((prevArray) => [...prevArray, index]);
    }
  };

  const ChapterhandleSaveClick = (event, index) => {
    event.stopPropagation();
    setActiveAccordion(
      activeAccordion.filter((accIndex) => accIndex !== index)
    );
  };

  const Addchapteridonly = (chapterId, arr) => {
    if (!isFoundChapter(arr, chapterId)) {
      append_chapter({ chapter_id: chapterId });
    } else {
      return null;
    }
  };
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = async () => {
    move(dragItem.current, dragOverItem.current);
  };

  const handleDragChapter = (chapter, filteredItems) => {
    if (filteredItems.includes(chapter)) {
      return;
    }
    else {
      Addchapteridonly(chapter.id, filteredItems);
      setSelectedChapters((prev) => [...prev, chapter]);
    }
  }

  const getTechnology = async () => {
    const getTechnologyResponse = await apiRequest(
      `api/courses/domainTechnology/getDomainTechnology/technology`
    );
    setTechnology(
      getTechnologyResponse?.value?.map((e) => {
        return { name: e.name, id: e.id, value: e.id };
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

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.current;
    console.log(scrollTop, clientHeight, scrollHeight, 'test')
    if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
      if (pageN < Totalpage) {
        setPageN((prevPage) => prevPage + 1);
      } else {
        return null;
      }
    }
  };

  const updateTrackStatus = async (event) => {
    const value = event.target.value;
    console.log('trackey', value);
    let data = {};
    if (value === 'Approved') {
      data['status'] = value;
    } else {
      data['status'] = value;
      data['reason'] = 'reason for reject';
    }
    let statusUpdateResponse = await apiRequest(
      `api/courses/tracks/${trackId}`,
      'PUT',
      data
    );
    if (statusUpdateResponse.status == 'success') {
      toast.success(`Course ${value} successfully`);
      router.navigate(`/app/managecourse`);
    } else {
      toast.error(statusUpdateResponse.message);
    }
  };

  useEffect(() => {
    if (trackId) {
      getTrackById();
    } else {
      handleClear();
    }

  }, [trackId]);

  useEffect(() => {
    console.log(trackData, 'fdfd');
    if (trackData) {
      for (const key in trackData) {
        if (key === 'title') {
          setValue('title', trackData['title']);
        }
        if (key === 'blurb') {
          setValue('blurb', trackData['blurb']);
        }
        if (key === 'prerequisites') {
          setValue('prerequisites', trackData['prerequisites']);
        }
        if (key === 'level') {
          setSelectedDifficulty(trackData['level']);
          setValue('level', trackData['level']);
        }
        if (key === 'permission') {
          setSelectedPermission(trackData['permission']);
          setValue('permission', trackData['permission']);
        }
        if (key === 'image_url') {
          let editFileUrl = trackData?.image_url.split('?')?.[0];
          let exte = editFileUrl?.split('.').pop();
          let fileName = editFileUrl?.split('/').pop();
          setValue('cover_image', fileName);
          setEditimage(fileName);
        }
        if (key === 'technology_skills') {
          setSelectedSkills(
            skills.find((e) => e.id == trackData['technology_skills'])
          );
          setValue('technology_skills', trackData['technology_skills']);
        }
        if (key === 'track_type') {
          setSelectedTrackType(trackData['track_type']);
          setValue('track_type', trackData['track_type']);
        }
        if (key === 'track_chapters') {
          const trackChapters = trackData['track_chapters'];
          console.log(trackChapters, 'sdsd');

          const chaptersDetails = [];

          trackChapters.forEach((chapter) => {
            const topics = [];

            if (chapter.chapter_topics && chapter.chapter_topics.length) {
              chapter.chapter_topics.forEach((topic) => {
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

            chaptersDetails.push({
              title: chapter.title,
              description: chapter.description,
              level: chapter.level,
              technology_skills: chapter.technology_skills,
              topics: topics,
            });
          });

          setValue('chapters_details', chaptersDetails);
        }
        if (trackData?.status == "Pending Approval" && userrole == "Job Architect") {
          setIsModalOpen(true)
          setType('statusReview');

        }
      }
    }

  }, [trackData]);

  const handleDeselectChapter = (chapter) => {
    setSelectedChapters((prev) => prev.filter((item) => item.id !== chapter.id));
    let index = chapter_fields?.findIndex(
      (x) => x?.chapter_id === chapter?.id
    );
    remove_chapter(index);
  };

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
      setError,
      unregister,
    }),
    [register, control, setValue, selectedSkills, errors, isEdit, trackId]
  );
  useEffect(() => {
    console.log(selectedSkills, 'ccc')
  }, [selectedSkills])

  const TableList = ({ items }) => {
    return (
      <>
        <Table>
          <tbody>
            {items?.map((chapter, index) => (
              <DraggableComponent
                type="table-row1"
                item={chapter}
                renderElement={'tr'}
                handleClose={handleClose}
              >
                {chapter.title.length > 25 ? (
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 1000, hide: 400 }}
                    overlay={renderTooltip(`${chapter.title}`)}
                  >
                    <td>
                      <div className="form-check">
                        <Form.Check
                          type="checkbox"
                          checked={selectedChapters.includes(chapter)}
                          onChange={(e) => {
                            handleCheckboxChange(chapter, e.target.checked);
                          }}
                        />
                        {chapter.title.slice(0, 25) + '...'}
                      </div>
                    </td>
                  </OverlayTrigger>
                ) : (
                  <td>
                    <div className="form-check">
                      <Form.Check
                        type="checkbox"
                        checked={selectedChapters.includes(chapter)}
                        onChange={(e) => {
                          handleCheckboxChange(chapter, e.target.checked);
                        }}
                      />
                      {chapter.title}
                    </div>
                  </td>
                )}

                {/* <td className="empty-td">&nbsp;&nbsp;</td> */}
                <td className="text-secondary">
                  {chapter.chapter_topics?.reduce(
                    (totalDuration, topic) => {
                      const topicDuration = topic.duration;
                      let durationVal = Math.round(
                        totalDuration + Number(topicDuration)
                      );
                      return durationVal;
                    },
                    0
                  )}{' '}
                  {Math.round(
                    chapter.chapter_topics?.reduce(
                      (totalDuration, topic) => {
                        const topicDuration = topic.duration;
                        return (
                          totalDuration + Number(topicDuration)
                        );
                      },
                      0
                    )
                  ) <= 1
                    ? 'min'
                    : 'mins'}
                </td>
              </DraggableComponent>
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

  return (
    <>
      {trackId && !checkStatus.includes(status) ? (
        <div className="d-flex  justify-content-end mt-5">
          <Button
            variant="none"
            className="f-16 d-flex align-items-center gap-3 text-info"
            onClick={() => {
              handleEdit(isEdit ? false : true);
            }}
          >
            <Span className="text-info">
              {isEdit ? 'Edit Course' : 'View Course'}
            </Span>
          </Button>
        </div>
      ) : null}
      <HeaderComponent
        title={
          trackId && isEdit
            ? 'View Course'
            : trackId && !isEdit
              ? 'Edit Course'
              : 'Create Course'
        }
        hidebreadcumb
      />
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Row>
            <FormContext.Provider value={Providervalue}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Course Details */}
                <Row className="ms-xl-5">
                  <Col xl={10} className="ms-xl-3">
                    <Form.Group controlId="name" className="mb-4">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="10"
                        style={{ width: '100%' }}
                        name="title"
                        type="input"
                        inputRef={register('title')}
                        error={errors.title}
                        label="Course Title *"
                        labelClassName="create-course-label"
                        placeHolder="Title here"
                        className="required"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>{' '}
                    <Form.Group controlId="description" className="mb-4">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="10"
                        name="blurb"
                        type="textarea"
                        rows="4"
                        inputRef={register('blurb')}
                         error={errors.blurb}
                        label="Description"
                        labelClassName="create-course-label"
                        placeHolder="Description text here"
                        className="requiredd"
                        formtext="Describe the course shortly"
                        formtextclassName="create-form-text"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>{' '}
                    <Form.Group controlId="prerequisites" className="mb-5">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="10"
                        inputRef={register('prerequisites')}
                        error={errors.prerequisites}
                        name="prerequisites"
                        type="input"
                        label="Pre-requisites"
                        labelClassName="create-course-label"
                        placeHolder="Required topic knowledge"
                        className="required"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>
                    <Form.Group controlId="coverimage" className="mb-4">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Cover Image:
                          </Form.Label>
                        </Col>
                        <Col lg={6}>
                          <>
                            {uploadFileData && (
                              <Box className='position-relative' style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <img src={uploadFileData} alt="Uploaded File" style={{ maxWidth: '400px', minWidth: '200px', objectFit: 'cover' }} />
                                <span
                                  title="Delete"
                                  onClick={() => {
                                    setUploadFileData(null);
                                    setValue('cover_image', '')
                                  }}
                                  style={{ cursor: 'pointer', position: 'absolute', top: '0px', right: '-10px' }}
                                >
                                  <CrossIcon />
                                </span>
                              </Box>
                            )}

                            {!uploadFileData && (
                              <Reactdropzone
                                name="cover_image"
                                fileData={fileData}
                                userdropzone={userdropzonelabelImage}
                                dropboxclass="dropbox-admincourse"
                                fileType="images"
                                maxSize={'2097152'}
                                setError={setError}
                              />
                            )}

                          </>
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group className="mb-5">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Level:{' '}
                          </Form.Label>
                        </Col>
                        <Col lg={10}>
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
                              disabled={trackId ? isEdit : false}
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
                              disabled={trackId ? isEdit : false}
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
                              disabled={trackId ? isEdit : false}
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
                    <Form.Group
                      name="Permission"
                      title="Permission"
                      label="Permission: "
                      className="mb-5"
                    >
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Permission:{' '}
                          </Form.Label>
                        </Col>
                        <Col lg={10}>
                          <Box className="d-flex">
                            <Form.Check
                              inline
                              type="radio"
                              label="Public"
                              name="permissionRadio"
                              value="Public"
                              checked={selectedPermission === 'Public'}
                              onChange={handlePersmissionChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Private"
                              name="permissionRadio"
                              value="Private"
                              checked={selectedPermission === 'Private'}
                              onChange={handlePersmissionChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                          </Box>
                          {errors.permission && selectedDifficulty == null && (
                            <p className="invalid-feedback">
                              {errors.permission?.message
                                ? errors.permission?.message
                                : errors.permission?.name.message}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group controlId="name" className="mb-4">
                      <Row className="">
                        <Col lg="2">
                          <label
                            for="Technologyskills"
                            className="create-course-label"
                          >
                            Technology/Skills *
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
                                isDisabled={trackId ? isEdit : false}
                                value={selectedSkills}
                                options={technology}
                                onChange={(selectedOption) => {
                                  setSelectedSkills(selectedOption);
                                  // setTechnologySkill(selectedOption?.id);
                                  onChange(selectedOption?.id);
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
                    <Form.Group>
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Course type:{' '}
                          </Form.Label>
                        </Col>
                        <Col lg={10}>
                          <Box className="d-flex align-items-center">
                            <Form.Check
                              inline
                              type="radio"
                              label="Certification"
                              name="trackTypeRadio"
                              value="certification"
                              checked={selectedTrackType === 'certification'}
                              onChange={handleCourseTypeChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />{' '}
                            <Form.Check
                              inline
                              type="radio"
                              label="Up-skilling"
                              name="trackTypeRadio"
                              value="upskill"
                              checked={selectedTrackType == 'upskill'}
                              onChange={handleCourseTypeChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Soft skills"
                              name="trackTypeRadio"
                              value="softskill"
                              checked={selectedTrackType === 'softskill'}
                              onChange={handleCourseTypeChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                          </Box>
                          {errors.track_type && selectedDifficulty == null && (
                            <p className="invalid-feedback">
                              {errors.track_type?.message
                                ? errors.track_type?.message
                                : errors.track_type?.name.message}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group controlId="add-chapter" className=" mt-5">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Chapters
                          </Form.Label>
                        </Col>
                        <Col lg={10}>
                          <Offcanvas
                            style={{ width: '520px' }}
                            show={show}
                            onHide={handleClose}
                            placement="end"
                          >
                            <Offcanvas.Header
                              closeButton
                              className="custom-close-button button"
                            >
                              <Offcanvas.Title>Explore Chapters</Offcanvas.Title>{' '}
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
                                    className="mx-1 md-3 form-group select-all-group"
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
                                  <TableList items={chapters} />
                                </div>
                              </Box>
                            </Offcanvas.Body>
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
                                      handleClearchapter();
                                    }}
                                  >
                                    Clear All
                                  </Button>

                                  <Button
                                    className="chapter-save-btn"
                                    variant="primary"
                                    type="button"
                                    onClick={() => {
                                      handleAddChapter();
                                      toast.success(`Added ${selectedChapters.length} chapters`);
                                      handleClose();
                                    }}
                                  >
                                    Add Chapters
                                  </Button>
                                </ButtonGroup>
                              </ButtonToolbar>
                            </Offcanvas.Header>
                          </Offcanvas>
                          <DroppableComponent
                            accept="table-row1"
                            onDrop={handleDragChapter}
                            fields={chapter_fields}
                          >
                            <Accordion
                              className="mb-2"
                              activeKey={activeAccordion}
                              alwaysOpen
                            >
                              {chapter_fields.map((chapter, index) => (
                                <ChapterAccordion
                                  key={chapter.id}
                                  name="chapters_details"
                                  chapterdata={chapters}
                                  chapter={chapter}
                                  chapterIndex={index}
                                  handleAccordionClick={
                                    ChapterAccordionHeaderClick
                                  }
                                  handleSaveClick={ChapterhandleSaveClick}
                                  setActiveAccordionchapter={setActiveAccordion}
                                  dragitem={dragItem}
                                  dragoveritem={dragOverItem}
                                  handlesort={handleSort}
                                  remove_chapter={remove_chapter}
                                  removecheck={handleDeselectChapter}
                                />
                              ))}
                            </Accordion>
                            {((trackId && !isEdit) || (!trackId && isEdit)) && (
                              <>
                                <Box className="mb-3">
                                  <CanvasChaptersButton />
                                  {errors.chapters_details?.message && (
                                    <p className="invalid-feedback">
                                      {errors.level?.message
                                        ? errors.level?.message
                                        : errors.level?.name.message}
                                    </p>
                                  )}
                                </Box>
                              </>
                            )}
                          </DroppableComponent>
                          {((trackId && !isEdit) || (!trackId && isEdit)) && (
                            <Span onClick={Addchapterall}>
                              <RoundPlus /> &nbsp;&nbsp;New Chapter
                            </Span>
                          )}
                        </Col>
                      </Row>
                    </Form.Group>
                    {userrole == 'Trainer' && (
                      <Form.Group controlId="add-chapter" className=" mt-5">
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
                                    isClearable={isClearable}
                                    value={selectedJobArchitect}
                                    options={JobArchitectsData}
                                    onChange={handleJobArchitectChange}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    isDisabled={trackId ? isEdit : false}
                                  />
                                )}
                              />
                            </Box>
                          </Col>
                        </Row>
                      </Form.Group>
                    )}
                    <ButtonToolbar
                      aria-label="Toolbar with button groups"
                      className="justify-content-end mt-5 mb-5"
                    >
                      {trackId && isEdit ? (
                        <>
                          {editPageApproveButtonRoles.includes(userrole) &&
                            editPageRejectButtonStatus.includes(
                              trackData?.status
                            ) && (
                              <ButtonGroup
                                className=""
                                aria-label="Second group"
                              >
                                <Button
                                  className="course-cancel-btn space1 rounded-5"
                                  variant="outline-primary"
                                  type="button"
                                  value="Reject"
                                  onClick={() => {
                                    handleEdit,
                                      setIsModalOpen(true),
                                      setType('RejectView'),
                                      setBtnValue('Reject'),
                                      updateTrackStatus;
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
                            valuetype="course"
                            id={trackId}
                            show={isModalOpen}
                            onHide={() => {
                              setIsModalOpen(false);
                            }}
                          />
                          {editPageApproveButtonRoles.includes(userrole) &&
                            editpageApproveButtonStatus.includes(
                              trackData?.status
                            ) && (
                              <ButtonGroup
                                className="me-0"
                                aria-label="Third group"
                              >
                                <Button
                                  className=" course-savee-btnn rounded-5 px-5"
                                  type="button"
                                  value="Approved"
                                  onClick={updateTrackStatus}
                                >
                                  Approve
                                </Button>
                              </ButtonGroup>
                            )}
                        </>
                      ) : trackId && !isEdit ? (
                        <>
                          <ButtonGroup
                            className="me-0"
                            aria-label="Second group"
                          >
                            {editPageSaveButtonStatus.includes(
                              trackData?.status
                            ) && (
                                <>
                                  <Button
                                    className="course-savee-btnn rounded-5 px-2"
                                    type="submit"
                                    disabled={pending}
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
                                        {console.log(saveType, 'savetype')}
                                        {userrole === 'Trainer' &&
                                          trackData?.status != 'In Draft'
                                          ? 'Send for approval'
                                          : 'Save Course'}
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                            {userrole == 'Trainer' &&
                              editPageCancelButtonStatus.includes(
                                trackData?.status
                              ) ? (
                              <Button
                                className="course-cancel-btn  space1 rounded-5"
                                variant="outline-primary"
                                type="button"
                                onClick={handleClear}
                              >
                                Cancel
                                {/* Cancel */}
                              </Button>
                            ) : (
                              trackData?.status == 'In Draft' && (
                                <Button
                                  className="course-cancel-btn  space1 rounded-5"
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
                              {editpageApproveButtonStatus.includes(
                                trackData?.status
                              ) &&
                                editPageApproveButtonRoles.includes(
                                  userrole
                                ) && (
                                  <Button
                                    className=" course-savee-btnn rounded-5 px-5"
                                    type="button"
                                    value="Approved"
                                    onClick={updateTrackStatus}
                                  >
                                    Approve
                                  </Button>
                                )}
                              {editPageApproveButtonRoles.includes(userrole) &&
                                editPageRejectButtonStatus.includes(
                                  trackData?.status
                                ) && (
                                  <Button
                                    className=" course-cancel-btn space1 rounded-5"
                                    variant="outline-primary"
                                    type="button"
                                    value="Reject"
                                    onClick={() => {
                                      handleEdit, updateTrackStatus;
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
                              className="course-cancel-btn  space1 rounded-5"
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
                              className="course-savee-btnn rounded-5 px-2"
                              type="submit"
                              disabled={pending}
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
                                    : 'Save Course'}
                                </>
                              )}
                            </Button>
                          </ButtonGroup>
                        </>
                      )}
                    </ButtonToolbar>
                  </Col>
                </Row>
              </Form>
            </FormContext.Provider>
          </Row>
        </DndProvider >
      )}
    </>
  );
};
export default React.memo(CreateCourse);
