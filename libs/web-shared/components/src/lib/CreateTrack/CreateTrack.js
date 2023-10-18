import './CreateTrack.css';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Accordion,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Col,
  Form,
  Row,
  Spinner
} from 'react-bootstrap';
import {
  CourseAccordion,
  CourseOffcanvas,
  FormContext,
  FormFieldRow,
  Reactdropzone,
  RoundPlus,
  DroppableComponent,
  DraggableComponent,
  Box, Span,
  HeaderComponent,
  Modals,
  Loader,
  CrossIcon
} from '@athena/web-shared/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import {
  apiRequest,
  skills,
  useParams,
  useAuth,
  useRouter,
  isFoundCourse,
  userdropzonelabelImage,
  addTrackSchema,
} from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const CreateTrack = (props) => {
  const methods = useForm({ resolver: yupResolver(addTrackSchema) });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    setError,
    control,
    formState: { errors },
  } = methods;

  const {
    fields: Coursefields,
    append: appendCourse,
    remove: removecourse,
    move,
  } = useFieldArray({
    control,
    name: 'children',
  });

  const addCourseAll = () => {
    appendCourse({ title: '', blurb: '', prerequisites: '' });
  };
  const auth = useAuth();
  const [existingFile, setExistingFile] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [saveType, setSaveType] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedTrackType, setSelectedTrackType] = useState(null);
  const [courselist, setcourselist] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [uploadFileData, setUploadFileData] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [selectedJobArchitect, setSelectedJobArchitect] = useState(null);
  const [userrole, setuserrole] = useState('');
  const [domainData, setDomainData] = useState([]);
  const [pending, setPending] = useState(false);
  const [trackData, setTrackData] = useState('');
  const [editimage, setEditimage] = useState();
  const [JobArchitectsData, setJobArchitectsData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const params = useParams();
  const router = useRouter();
  const { id: trackId } = params;
  const [status, setStatus] = useState('');
  const [isEdit, setIsEdit] = useState(true);
  const [type, setType] = useState('');
  const [btnValue, setBtnValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');

  const checkStatus = ['Published', 'Approved'];
  const editPageSaveButtonStatus = ['Rejected', 'In Draft', 'Pending Approval', 'Review In Progress'];
  const editPageCancelButtonStatus = ['In Draft', 'Pending Approval', 'Rejected'];
  const editpageApproveButtonStatus = ['Rejected', 'Pending Approval', 'Review In Progress'];
  const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress'];
  const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];

  const handleEdit = (value) => {
    setIsEdit(value)
  }

  useEffect(() => {
    if (auth && auth.user) {
      console.log('auth.user?.role[0].name', auth.user?.role[0].name);
      setuserrole(auth.user?.role[0].name);
    }
  }, [auth.user]);

  const handleJobArchitectChange = (selected) => {
    setValue('approver', selected?.id);
    setSelectedJobArchitect(selected);
  };

  

  const fileData = (data) => {
    setValue('cover_image', data);
    setUploadFileData(data[0]?.preview);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setValue('level', e.target.value);
  };

  const handlePermissionChange = (e) => {
    setPermissions(e.target.value);
    setValue('permission', e.target.value);
  };

  useEffect(() => {
    if (uploadFileData == null) {
      setExistingFile(false);
    } else {
      setExistingFile(true);
    }
  }, [uploadFileData]);

  const handleClear = () => {
    setValue('cover_image', null);
    setEditimage('');
    setUploadFileData(null);
    setPending(false);
    setSelectedDifficulty('');
    setPermissions('');
    setSelectedTrackType('');
    setSelectedSkills(null);
    setSelectedJobArchitect(null);
    setValue('approver', null);
    reset();
    reset({
      children: [],
    });
    clearErrors();
  };

  const getDomain = async () => {
    const getDomainResponse = await apiRequest(
      `api/courses/domainTechnology/getDomainTechnology/domain`
    );
    setDomainData(
      getDomainResponse?.value?.map((e) => {
        return { name: e.name, id: e.id };
      })
    );
    console.log(
      'Domain',
      getDomainResponse?.value?.map((e) => e.name)
    );
  };

  const getJobArchitect = async () => {
    const getJobArchitectResponse = await apiRequest(`api/users/jobArchitects`);
    setJobArchitectsData(getJobArchitectResponse?.value?.userData?.map((e) => {
      return { name: e.first_name, id: e.id };
    }));
  };

  useEffect(() => {
    getDomain();
    getJobArchitect();
  }, []);

  const setfilter = (word) => {
    setFilterText(word);
  }

  const onsubmit = async (data) => {
    console.log('trackdata', data, JSON.stringify(data));
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
        data.status =
          saveType === 'In Draft'
            ? 'In Draft'
          : saveType === 'Pending Approval'
              ? 'Pending Approval'
              : 'Approved';
        data.slug = data['title'];
        data.children = data?.children?.map((childObj) => {
          if (!('course_id' in childObj)) {
            childObj.chapters = childObj.chapters_details.map((chapterObj) => {
              if (!('chapter_id' in chapterObj)) {
                chapterObj.topics = chapterObj.topics.map((topicObj) => {
                  if (!('topic_id' in topicObj)) {
                    if ('topic_link' in topicObj) {
                      delete topicObj.file;
                      return topicObj;
                    } else {
                      return {
                        ...topicObj,
                        file: topicObj.file[0],
                      };
                    }
                  } else {
                    return {
                      id: topicObj['topic_id'],
                    };
                  }
                });
                return chapterObj;
              } else {
                return {
                  id: chapterObj['chapter_id'],
                };
              }
            });
            delete childObj.chapters_details;
            return childObj; // <--- add this return statement
          } else {
            return {
              id: childObj['course_id'],
            };
          }
        });

        console.log('afterdata', data, JSON.stringify(data));
        console.log('yyyyyyyyyyyy');

        let formData = new FormData();

        for (const i in data) {
          if (i === 'children') {
            data[i].forEach((child, childIndex) => {
              if (!('id' in child)) {
                child.slug = child.title;
                child.status = data.status;
                if (data['to_be_reviewed_by']) {
                  child.to_be_reviewed_by = data['to_be_reviewed_by'];
                }
              }
              for (const j in child) {
                if (j === 'chapters' && child[j].length > 0) {

                  child[j].forEach((chapter, chapterIndex) => {
                    if (!('id' in chapter)) {
                      chapter.slug = chapter.title;
                      chapter.status = data.status;
                      if (data['to_be_reviewed_by']) {
                        chapter.to_be_reviewed_by = data['to_be_reviewed_by'];
                      }
                    }

                    for (const k in chapter) {
                      if (k === 'topics' && chapter[k].length > 0) {
                        chapter[k].forEach((topic, topicIndex) => {
                          // const topicFormData = new FormData();
                          if (!('id' in topic)) {
                            topic.status = data.status;
                            if (data['to_be_reviewed_by']) {
                              topic.to_be_reviewed_by = data['to_be_reviewed_by'];
                            }
                          }
                          // formData.append(`children[${childIndex}][${j}][${chapterIndex}][${k}][${topicIndex}]`, topic);
                          for (const l in topic) {
                            // topicFormData.append(`[${l}]`, topic[l]);
                            console.log('pioo', `[${l}]`);
                            formData.append(
                              `children[${childIndex}][${j}][${chapterIndex}][${k}][${topicIndex}][${l}]`,
                              topic[l]
                            );
                          }

                        });
                      } else {
                        formData.append(
                          `children[${childIndex}][${j}][${chapterIndex}][${k}]`,
                          chapter[k]
                        );
                      }
                    }
                  });
                } else if (j === 'cover_image') {
                  formData.append(`children[${childIndex}][${j}]`, child[j][0]);
                }
                else {
                  if (j !== 'technology_skill') {
                    formData.append(`children[${childIndex}][${j}]`, child[j]);
                  }
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

        const response = await apiRequest(
          'api/courses/tracks/child/create',
          'POST',
          formData,
          true
        );
        if (response.status === 'success') {
          setPending(false);
          toast.success(
            saveType === 'Draft'
              ? 'Track saved in Draft'
              : 'Track saved successfully'
          );
          // setChaptersList([]);
          // setPage(1);
          handleClear();
        } else {
          setPending(false);
          toast.error(response.message);
        }
      }
    } catch (error) {
      // toast.error('Something Went Wrong');
      console.log(error);
    }
  };


  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleCourseTypeChange = (e) => {
    setSelectedTrackType(e.target.value);
    setValue('track_type', e.target.value);
  };

  const getCourse = async () => {
    let url;
    if (filterText !== '') {
      url = `api/courses/tracks/chapters?searchKey=${filterText}`
    }
    else url = `api/courses/tracks/chapters`;
    const coursedetailsresponse = await apiRequest(url);
    console.log('ssss', coursedetailsresponse);
    if (coursedetailsresponse?.status === 'success') {
      setcourselist(coursedetailsresponse.value);
    } else {
      setcourselist([]);
    }
  };

  useEffect(() => {
    getCourse();
  }, [filterText]);

  const Addcourseidonly = (courseId, arr) => {
    if (!isFoundCourse(arr, courseId)) {
      appendCourse({ course_id: courseId });
    } else {
      return null;
    }
  };

  const handleCheckboxChange = (course, isChecked) => {
    if (isChecked) {
      setSelectedCourse((prev) => [...prev, course]);
    } else {
      setSelectedCourse((prev) => prev.filter((item) => item !== course));
    }
  };
  const handleAddCourse = () => {
    onSave(selectedCourse);
  };

  const onSave = (selectedCourse) => {
    const selectedCourseIds = selectedCourse.map((course) => course.id);
    const coursesToRemove = Coursefields.filter((field) => !!('course_id' in field && !selectedCourseIds.includes(field.course_id)));

    coursesToRemove.reduceRight((_, course, index) => {
      const courseIndex = Coursefields.findIndex((field) => field.course_id === course.course_id);
      if (courseIndex !== -1) {
        removecourse(courseIndex);
      }
    }, null);

    selectedCourse.forEach((course) => {
      if (!Coursefields.some((field) => field.course_id === course.id)) {
        appendCourse({ course_id: course.id });
      }
    });
  };

  const handleDragCourse = (course, filteredItems) => {
    console.log(course,"course",filteredItems,"coursefiltereditems");
    if (filteredItems.includes(course)) {
      return;
    }
    else {
      Addcourseidonly(course.id, filteredItems);
      setSelectedCourse((prev) => [...prev, course]);
    }
  }

  const CourseAccordionHeaderClick = (index) => {
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((dat) => dat != index));
    } else {
      setActiveAccordion((prevArray) => [...prevArray, index]);
    }
  };

  const CoursehandleSaveClick = (event, index) => {
    event.stopPropagation();
    setActiveAccordion(
      activeAccordion.filter((accIndex) => accIndex !== index)
    );
  };

  const getTrackById = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`api/courses/tracks/children/${trackId}`);
      console.log('reses', response);
      setTrackData(response.value);
      setStatus(response?.value?.status);
      setIsLoading(false)
    } catch (error) {
      console.error("trackbyiderror", error);
      setIsLoading(false)

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
    console.log(trackData, "fdfd")
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
          setPermissions(trackData['permission']);
          setValue('permission', trackData['permission']);
        }
        if (key === 'image_url') {
          let editFileUrl = trackData?.image_url.split('?')?.[0];
          let exte = editFileUrl?.split('.').pop();
          let fileName = editFileUrl?.split('/').pop();
          setValue('cover_image', fileName);
          setEditimage(fileName)
        }
        if (key === 'technology_skills') {
          setSelectedSkills(skills.find((e) => e.id == trackData['technology_skills']));
          setValue('technology_skills', trackData['technology_skills']);
        }
        if (key === 'track_type') {
          setSelectedTrackType(trackData['track_type']);
          setValue('track_type', trackData['track_type']);
        }
        if (key === 'children') {
          const trackCourses = trackData['children'];
          console.log(trackCourses, 'sdsd');

          const courseDetails = trackCourses.map((course) => {
            const chaptersDetails = [];
            if (course.track_chapters && course.track_chapters.length) {
              course.track_chapters.forEach((chapter) => {
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
                      topic_file: topic.attachment_url
                    });
                  });
                }

                chaptersDetails.push({
                  title: chapter.title,
                  description: chapter.description,
                  level: chapter.level,
                  technology_skills: chapter.technology_skills,
                  topics: topics
                });
              });
            }

            return {
              title: course.title,
              blurb: course.blurb,
              prerequisites: course.prerequisites,
              level: course.level,
              permission: course.permission,
              course_image: course.image_url?.split('/').pop(),
              technology_skills: course.technology_skills,
              track_type: course.track_type,
              chapters_details: chaptersDetails
            };
          });

          setValue('children', courseDetails);
        }
        if (trackData?.status == "Pending Approval" && userrole == "Job Architect") {
          setIsModalOpen(true)
          setType('statusReview');

        }

      }
    }

    console.log(getValues('chapters_details'), 'ddfd');
  }, [trackData]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  //const handle drag sorting
  const handleSort = async () => {
    move(dragItem.current, dragOverItem.current);
  };

  const updateTrackStatus = async (event) => {
    const value = event.target.value;
    console.log('trackey', value);
    let data = {};
    if (value === "Approved") {
      data['status'] = value;
    } else {
      data['status'] = value;
      data['reason'] = "reason for reject"
    }
    let statusUpdateResponse = await apiRequest(
      `api/courses/tracks/${trackId}`, 'PUT', data
    )
    if (statusUpdateResponse.status == 'success') {
      toast.success(`Track ${value} successfully`);
      router.navigate(`/app/managetrack`);
    }
    else {
      toast.error(statusUpdateResponse.message)
    }
  }

  const handleDeselectCourse = (course) => {
    setSelectedCourse((prev) => prev.filter((item) => item.id !== course.id));
    let index = Coursefields?.findIndex(
      (x) => x?.course_id === course?.id
    );
    removecourse(index);
  };

  const Providervalue = useMemo(
    () => ({ register, control, setValue, getValues, errors, isEdit, trackId,setError }),
    [register, control, setValue, getValues, errors, isEdit, trackId, setError]
  );

  const handleclearcourse = () => {
    setSelectedCourse([]);
  };

  useEffect(() => {
    console.log('fiii', Coursefields)
  }, [Coursefields])
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
              {isEdit ? 'Edit Track' : 'View Track'}
            </Span>
          </Button>
        </div>
      ) : null}
      <HeaderComponent
        title={
          trackId && isEdit
            ? 'View Track'
            : trackId && !isEdit
              ? 'Edit Track'
              : 'Create Track'
        }
        hidebreadcumb
      />
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <>
          <DndProvider backend={HTML5Backend}>
            <CourseOffcanvas
              handleClose={handleClose}
              handleShow={handleShow}
              show={show}
              course={courselist}
              handleSelectCourse={handleCheckboxChange}
              handleclearcourse={handleclearcourse}
              selectedcourselist={selectedCourse}
              handleAddCourse={handleAddCourse}
              filterfunc={setfilter}
            />

            <FormContext.Provider value={Providervalue}>
              <Form onSubmit={handleSubmit(onsubmit)}>
                <Row>
                  <Col lg={10} className="ms-xl-3">
                    <Form.Group controlId="name" className="mb-5 mt-3">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="9"
                        name="title"
                        type="input"
                        inputRef={register('title')}
                        error={errors.title}
                        label="Track Title *"
                        labelClassName="create-course-label"
                        placeHolder="Track title"
                        className="required"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>
                    <Form.Group controlId="description" className="mb-5">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="9"
                        name="blurb"
                        type="textarea"
                        rows="4"
                        inputRef={register('blurb')}
                        error={errors.blurb}
                        label="Description"
                        labelClassName="create-course-label"
                        placeHolder="Description here"
                        className="requiredd"
                        formtext="Describe the course shortly"
                        formtextclassName="create-form-text"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>
                    <Form.Group controlId="prerequisites" className="mb-5">
                      <FormFieldRow
                        size="md"
                        size1="2"
                        size2="9"
                        inputRef={register('prerequisites')}
                        error={errors.prerequisites}
                        name="prerequisites"
                        type="input"
                        label="Pre-requisites *"
                        labelClassName="create-course-label"
                        placeHolder="Required topic knowledge"
                        className="required"
                        disabled={trackId ? isEdit : false}
                      />
                    </Form.Group>
                    <Row className="mb-5">
                      <Col lg="2">
                        <label
                          for="staticEmail"
                          className="create-course-label"
                        >
                          Cover image
                        </label>
                      </Col>
                      <Col lg="9">
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
                    {/* {uploadFileData?.length > 0 && <Row className="empty-row"></Row>} */}
                    <Form.Group className="mb-5">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Level
                          </Form.Label>
                        </Col>
                        <Col lg={9}>
                          <Box className="d-flex align-items-center">
                            <Form.Check
                              inline
                              type="radio"
                              label="Beginner"
                              name="difficultyRadiotrack"
                              value="Beginner"
                              checked={selectedDifficulty === 'Beginner'}
                              onChange={handleDifficultyChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Intermediate"
                              name="difficultyRadiotrack"
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
                              name="difficultyRadiotrack"
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
                    <Form.Group className="mb-5">
                      <Row>
                        <Col lg={2}>
                          <Form.Label className="create-course-label">
                            Permission
                          </Form.Label>
                        </Col>
                        <Col lg={9}>
                          <Box className="d-flex align-items-center">
                            <Form.Check
                              inline
                              type="radio"
                              label="Public"
                              name="permissiontrack"
                              value="Public"
                              checked={permissions === 'Public'}
                              onChange={handlePermissionChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="Private"
                              name="permissiontrack"
                              value="Private"
                              checked={permissions === 'Private'}
                              onChange={handlePermissionChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                          </Box>
                          {errors.permission && permissions == null && (
                            <p className="invalid-feedback">
                              {errors.permission?.message
                                ? errors.permission?.message
                                : errors.permission?.name.message}
                            </p>
                          )}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group controlId="name" className="mb-5">
                      <Row className="">
                        <Col lg="2">
                          <label
                            for="Delivery_type"
                            className="create-course-label"
                          >
                            Domain/Subject *
                          </label>
                        </Col>
                        <Col lg="9">
                          <Controller
                            name="technology_skills"
                            control={control}
                            render={({ field: { onChange } }) => (
                              <Select
                                placeholder="Please select"
                                hideSelectedOptions={false}
                                isClearable={true}
                                value={selectedSkills}
                                isDisabled={trackId ? isEdit : false}
                                options={domainData}
                                onChange={(selectedOption) => {
                                  setSelectedSkills(selectedOption);
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
                            Track type :{' '}
                          </Form.Label>
                        </Col>
                        <Col lg={10}>
                          <Box className="d-flex align-items-center">
                            <Form.Check
                              inline
                              type="radio"
                              label="Certification"
                              name="trackTypeRadiotype"
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
                              name="trackTypeRadiotype"
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
                              name="trackTypeRadiotype"
                              value="softskill"
                              checked={selectedTrackType === 'softskill'}
                              onChange={handleCourseTypeChange}
                              className="text-muted d-flex"
                              style={{ fontSize: 'smaller' }}
                              disabled={trackId ? isEdit : false}
                            />
                          </Box>
                          {errors.track_type && selectedTrackType == null && (
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
                            Courses *
                          </Form.Label>
                        </Col>
                        <Col lg={9}>
                          <DroppableComponent
                            accept="table-row1"
                            onDrop={handleDragCourse}
                            fields={Coursefields}
                          >
                            <Accordion
                              className="mb-2"
                              activeKey={activeAccordion}
                              alwaysOpen
                            >
                              {Coursefields.map((course, index) => (
                                <CourseAccordion
                                  key={course.id}
                                  courseindex={index}
                                  name={'children'}
                                  course={course}
                                  coursedata={courselist}
                                  handleAccordionClick={
                                    CourseAccordionHeaderClick
                                  }
                                  handleSaveClick={CoursehandleSaveClick}
                                  setActivecourseAccordion={setActiveAccordion}
                                  activecourseAccordion={activeAccordion}
                                  dragitem={dragItem}
                                  dragoveritem={dragOverItem}
                                  handlesort={handleSort}
                                  removecourse={removecourse}
                                  removecheck={handleDeselectCourse}
                                />
                              ))}
                            </Accordion>
                            {((trackId && !isEdit) || (!trackId && isEdit)) && (
                              <Box className="mb-2">
                                <button
                                  type="button"
                                  onClick={handleShow}
                                  className="p-0 w-100 border-0"
                                >
                                  <Card className="text-primary bg-light py-2">
                                    Drag and drop Courses here
                                  </Card>
                                </button>
                                {errors.children?.message && (
                                  <p className="invalid-feedback">
                                    {errors.children?.message ||
                                      errors.children?.name.message}
                                  </p>
                                )}
                              </Box>
                            )}
                          </DroppableComponent>
                          {((trackId && !isEdit) || (!trackId && isEdit)) && (
                            <Span onClick={addCourseAll}>
                              <RoundPlus /> &nbsp;&nbsp;New Course
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
                      <Col lg={11}>
                        <ButtonToolbar
                          aria-label="Toolbar with button groups"
                          className="justify-content-end mt-5 mb-5"
                        >
                          {/* {trackId && (
                      <>
                        {!isEdit && (
                          <>
                            <ButtonGroup className="" aria-label="Second group">
                              <Button
                                style={{ color: 'blue' }}
                                variant=""
                                type="submit"
                                onClick={() => {
                                  if (auth?.user?.role?.[0]?.name === 'Admin') {
                                    setSaveType('Published');
                                  } else {
                                    setSaveType('Pending Approval');
                                  }
                                }}
                              >
                                {pending && saveType === 'In Draft' ? (
                                  <Span className="d-flex justify-content-center">
                                    &nbsp; Loading...
                                  </Span>
                                ) : (
                                  userrole === 'Trainer' ? 'Send for approval' : 'Save'
                                )}
                              </Button>
                            </ButtonGroup>
                          </>
                        )}
                        <ButtonGroup className="" aria-label="Second group">
                          <Button
                            className="topic-cancel-btn space1 rounded-5"
                            variant="outline-primary"
                            type="button"
                            value="Rejected"
                            onClick={updateTrackStatus}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup className="me-0" aria-label="Third group">
                          <Button
                            className="topicc-savee-btnn rounded-5 px-5"
                            type="button"
                            value="Approved"
                            onClick={updateTrackStatus}
                          >
                            Approve
                          </Button>
                        </ButtonGroup>
                      </>
                    )}
                    {!trackId && (
                      <ButtonGroup className="me-5" aria-label="First group">
                        <Button
                          className="course-btn mx-2"
                          variant="outline-white text-primary"
                          type="submit"
                          onClick={() => {
                            setSaveType('In Draft');
                            console.log('Clicked Save Draft');
                          }}
                        >
                          Save as Draft
                        </Button>
                        <Button
                          className="course-btn mx-2"
                          variant="outline-primary"
                          type="button"
                          onClick={handleClear}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="course-btn mx-2"
                          variant="primary"
                          type="submit"
                          disabled={pending}
                          onClick={() => {
                            setSaveType(
                              auth?.user?.role?.[0]?.name === 'Admin' ? 'Published' : 'Pending'
                            );
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
                            userrole === 'Trainer' ? 'Send for approval' : 'Save'
                          )}
                        </Button>
                      </ButtonGroup>
                    )} */}
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
                                valuetype="track"
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
                                            console.log("ppppppppppp", auth?.user?.role, auth?.user?.role?.[0])
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
                                              : 'Save Track'}
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
                                  {editPageApproveButtonRoles.includes(
                                    userrole
                                  ) &&
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
                              <ButtonGroup
                                className=""
                                aria-label="Second group"
                              >
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
                                        : 'Save Track'}
                                    </>
                                  )}
                                </Button>
                              </ButtonGroup>
                            </>
                          )}
                        </ButtonToolbar>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </FormContext.Provider>
          </DndProvider>
        </>
      )}
    </>
  );
};

export default CreateTrack;

