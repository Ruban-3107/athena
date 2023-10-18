import './CourseAccordion.css';
import {
  Accordion,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  Col,
  Form,
  Offcanvas,
  Row,
  Spinner,
  Table,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import './CourseAccordion.css';
import { Box, Span } from '@athena/web-shared/ui';
import { AccordionChapterIcon, CrossIcon, Moveaccord, RoundPlus } from '../Icons/Icons';
import FormFieldRow from '../FormFieldRow/FormFieldRow';
import TextEditor from '../TextEditor/TextEditor';
import Reactdropzone from '../Reactdropzone/Reactdropzone';
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, get as fieldget } from 'react-hook-form';
import {
  apiRequest,
  skills,
  isFoundChapter,
  userdropzonelabelImage,
} from '@athena/web-shared/utils';
import Select from 'react-select';
import ChapterAccordion from '../ChapterAccordion/ChapterAccordion';
import { FormContext } from '../FormContext/FormContext';
import SearchBar from '../SearchBar/SearchBar';
import { toast } from 'react-toastify';
import DraggableComponent from '../DraggableComponent/DraggableComponent';
import DroppableComponent from '../DroppableComponent/DroppableComponent';

export const CourseAccordion = (props) => {
  const { register, control, setValue, errors, isEdit, getValues, trackId } =
    useContext(FormContext);
  const {
    courseindex,
    name,
    handleSaveClick,
    dragitem,
    dragoveritem,
    handlesort,
    handleAccordionClick,
    removecourse,
    course,
    coursedata,
    setActivecourseAccordion,
    activecourseAccordion,
    removecheck,
  } = props;

  const {
    fields: chapter_fields,
    append: append_chapter,
    remove: remove_chapter,
    move: move_chapter,
  } = useFieldArray({
    control,
    name: `children[${courseindex}].chapters_details`,
  });

  const [chapters, setChapters] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedskill, setselectedskill] = useState(null);
  const [existingFile, setExistingFile] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [pageN, setPageN] = useState(1);
  const [disabled, setdisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTrackType, setSelectedTrackType] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [saveType, setSaveType] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [uploadFileData, setUploadFileData] = useState(null);
  const [show, setShow] = useState(false);
  const [editcourse, setEditcourse] = useState();
  const [technology, setTechnology] = useState([]);
  const [Totalpage, setTotalpage] = useState('');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (trackId) {
      setdisabled(isEdit);
    } else {
      setdisabled(false);
    }
  }, [isEdit, trackId]);

  useEffect(() => {
    if (course?.course_id) {
      setdisabled(true);
      const courseDat = coursedata.find((t) => t.id === course.course_id);
      for (const key in courseDat) {
        if (key == 'title') {
          setValue(`${name}[${courseindex}].title`, courseDat['title']);
        }
        if (key == 'blurb') {
          setValue(`${name}[${courseindex}].blurb`, courseDat['blurb']);
        }
        if (key == 'prerequisites') {
          setValue(
            `${name}[${courseindex}].prerequisites`,
            courseDat['prerequisites']
          );
        }
        if (key === 'level') {
          setSelectedDifficulty(courseDat['level']);
          setValue(`${name}[${courseindex}].level`, courseDat['level']);
        }
        if (key === 'permission') {
          setSelectedPermission(courseDat['permission']);
          setValue(
            `${name}[${courseindex}].permission`,
            courseDat['permission']
          );
        }
        if (key == 'image_url') {
          let editFileUrl = courseDat?.image_url?.split('?')?.[0];
          let exte = editFileUrl?.split('.').pop();
          let fileName = editFileUrl?.split('/').pop();
          setUploadFileData(fileName);
          setValue(`${name}[${courseindex}].cover_image`, fileName);
          setEditcourse(fileName);
        }
        if (key === 'technology_skills') {
          setselectedskill(
            technology.find((e) => e.id == courseDat['technology_skills'])
          );
          console.log(
            'sgsg',
            technology.find((e) => e.id == courseDat['technology_skills']),
            technology,
            courseDat['technology_skills']
          );
          setValue(
            `${name}[${courseindex}].technology_skills`,
            courseDat['technology_skills']
          );
        }
        if (key === 'track_type') {
          setSelectedTrackType(courseDat['track_type']);
          setValue(
            `${name}[${courseindex}].track_type`,
            courseDat['track_type']
          );
        }
        if (key === 'track_chapters') {
          const trackChapters = courseDat['track_chapters'];

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

          setValue(`${name}[${courseindex}].chapters_details`, chaptersDetails);
        }
      }
    }
    // else {
    //   setselectedskill(selectedSkills)
    //   setValue(`${name}[${courseindex}].technology_skills`, selectedSkills?.id);
    // }
  }, [courseindex]);

  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );

  const getCH = async (pageNo, size) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      let requestParams = { pageNo, size };
      if (selectedskill) {
        console.log(selectedskill, 'sksk')
        requestParams.technology_skills = selectedskill.id;
      }
      if (filterText) {
        requestParams.searchkey = filterText;
      }
      requestParams['status'] = 'Approved';
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
        setChapters(rows);
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
  }, [pageN, pageSize, filterText, selectedskill]);

  const AddChapterAll = () => {
    append_chapter({ title: '', description: '' });
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setValue(`${name}[${courseindex}].level`, e.target.value);
  };

  const handleCourseTypeChange = (e) => {
    setSelectedTrackType(e.target.value);
    setValue(`${name}[${courseindex}].track_type`, e.target.value);
  };
  const handlePermissionChange = (e) => {
    setSelectedPermission(e.target.value);
    setValue(`${name}[${courseindex}].permission`, e.target.value);
  };

  const fileData = (data) => {
    setValue(`${name}[${courseindex}].cover_image`, data);
    setUploadFileData(data[0]?.preview);
  };
  const ChapterAccordionHeaderClick = (index) => {
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((dat) => dat != index));
    } else {
      setActiveAccordion((prevArray) => [...prevArray, index]);
    }
  };

  const SaveAccordion = (event, index) => {
    event.preventDefault();
    handleSaveClick(event, index);
  };

  const ChapterhandleSaveClick = (event, index) => {
    event.stopPropagation();
    setActiveAccordion(
      activeAccordion.filter((accIndex) => accIndex !== index)
    );
  };

  const dragItemchapter = useRef(null);
  const dragOverItemchapter = useRef(null);

  const handleSortchapter = async () => {
    move_chapter(dragItemchapter.current, dragOverItemchapter.current);
  };
  const handleShow = () => {
    if (selectedskill !== null) {
      setShow(true);
    }
    else {
      toast.info('please select technology skill first')
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const Addchapteridonly = (chapterId, arr) => {
    if (!isFoundChapter(arr, chapterId)) {
      append_chapter({ chapter_id: chapterId });
    } else {
      return null;
    }
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


  const handleDragChapter = (chapter, filteredItems) => {
    if (filteredItems.includes(chapter)) {
      return;
    }
    else {
      Addchapteridonly(chapter.id, filteredItems);
      setSelectedChapters((prev) => [...prev, chapter]);
    }
  }

  const handleDeselectChapter = (chapter) => {
    setSelectedChapters((prev) => prev.filter((item) => item.id !== chapter.id));
    let index = chapter_fields?.findIndex(
      (x) => x?.chapter_id === chapter?.id
    );
    remove_chapter(index);
  };

  useEffect(() => {
    if (errors && fieldget(errors, name)?.[courseindex]) {
      if (!activeAccordion?.includes(courseindex)) {
        setActivecourseAccordion((prevArray) => [...prevArray, courseindex]);
      }
    }
  }, [errors]);

  useEffect(() => {
    if (uploadFileData == null) {
      setExistingFile(false);
    } else {
      setExistingFile(true);
    }
  }, [uploadFileData]);

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

  useEffect(() => {
    getTechnology();
  }, []);

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
    if (trackId) {
      let FileUrl = getValues(`${name}[${courseindex}].course_image`);
      let editFileUrl = FileUrl?.split('?')?.[0];
      let exte = editFileUrl?.split('.').pop();
      let fileName = editFileUrl?.split('/').pop();
      setValue(`${name}[${courseindex}].cover_image`, fileName);
      setEditcourse(fileName);
    }
  }, [trackId, courseindex]);

  return (
    <>
      <Offcanvas
        style={{ overflowX: 'hidden', width: '520px' }}
        show={show}
        onHide={handleClose}
        placement="end"
      >
        <Offcanvas.Header closeButton className="custom-close-button button">
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
          onScroll={handleScroll}>
          <Box className="mx-2 exp-topics">
            <div
            >
              <Table>
                <tbody>
                  {chapters?.map((chapter, index) => (
                    <DraggableComponent
                      type="table-row2"
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
                              return totalDuration + Number(topicDuration);
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
            </div>
          </Box>
        </Offcanvas.Body>
        <Row className=" d-flex justify-content-center align-items-center">
        </Row>

        <Offcanvas.Header>
          <Span className="justify-content-center align-items-end"></Span>
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup
              className="me-3 align-items-end gap-4"
              aria-label="First group"
            >
              <Button
                className="chapter-save-btn"
                variant="outline-primary"
                type="button"
                onClick={() => {
                  handleClear();
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
      <Accordion.Item eventKey={courseindex} className="mb-3 accord-item">
        <Accordion.Header
          className="topic-accord"
          onClick={() => handleAccordionClick(courseindex)}
          draggable
          onDragStart={(e) => (dragitem.current = courseindex)}
          onDragEnter={(e) => (dragoveritem.current = courseindex)}
          onDragEnd={handlesort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Box className="d-flex align-items-center ms-4 gap-4 w-100">
            <Span className="draggable-item mb-0 mt-0">
              <Moveaccord />
            </Span>
            <AccordionChapterIcon />
            {getValues(`${name}[${courseindex}].title`) !== undefined
              ? getValues(`${name}[${courseindex}].title`).length > 0
                ? getValues(`${name}[${courseindex}].title`)
                : `course${[courseindex + 1]}`
              : `course${[courseindex + 1]}`}
          </Box>

          {((trackId && !isEdit) || (!trackId && isEdit)) && (
            <Box className="delete-accord ms-auto me-4">
              <Span
                style={{ color: '#FF4D4F', cursor: 'pointer' }}
                onClick={() =>
                  course?.course_id
                    ? removecheck(
                      coursedata?.find((t) => t?.id === course?.course_id)
                    )
                    : removecourse(courseindex)
                }
              >
                Remove
              </Span>
            </Box>
          )}
        </Accordion.Header>
        <Accordion.Body className="topic-body">
          <Form.Group controlId="name" className="mb-3 mt-3">
            <FormFieldRow
              size="md"
              size1="3"
              size2="9"
              name={`${name}[${courseindex}].title`}
              type="input"
              disabled={disabled}
              inputRef={register(`${name}[${courseindex}].title`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[courseindex]?.title
              }
              label="Course Title *"
              labelClassName="create-course-label"
              placeHolder="Title here"
              className="required"
            />
          </Form.Group>{' '}
          <Form.Group controlId="description" className="mb-3 mt-4">
            <FormFieldRow
              size="md"
              size1="3"
              size2="9"
              name={`${name}[${courseindex}].blurb`}
              type="textarea"
              disabled={disabled}
              rows="4"
              inputRef={register(`${name}[${courseindex}].blurb`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[courseindex]?.blurb
              }
              label="Course Description *"
              labelClassName="create-course-label"
              placeHolder="Description here"
              className="requiredd"
              formtext="Describe the course shortly"
              formtextclassName="create-form-text"
            />
          </Form.Group>
          <Form.Group controlId="prerequisites" className="mb-5">
            <FormFieldRow
              size="md"
              size1="3"
              size2="9"
              inputRef={register(`${name}[${courseindex}].prerequisites`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[courseindex]?.prerequisites
              }
              name={`${name}[${courseindex}].prerequisites`}
              type="input"
              label="Pre-requisites"
              labelClassName="create-course-label"
              placeHolder="Required topic knowledge"
              className="required"
              disabled={disabled}
            />
          </Form.Group>
          <Form.Group controlId="coverimage" className="mb-5">
            <Row>
              <Col lg={3}>
                <Form.Label className="create-course-label">
                  Cover Image:
                </Form.Label>
              </Col>
              <Col lg={9}>
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
                      name={`${name}[${courseindex}].cover_image`}
                      fileData={fileData}
                      userdropzone={userdropzonelabelImage}
                      dropboxclass="dropbox-admincourse"
                      fileType="images"
                    />
                  )}
                </>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-5">
            <Row>
              <Col lg={3}>
                <Form.Label className="create-course-label">Level: </Form.Label>
              </Col>
              <Col lg={9}>
                <Box className="d-flex align-items-center">
                  <Form.Check
                    inline
                    type="radio"
                    label="Beginner"
                    name={`${name}[${courseindex}].difficultycourse`}
                    value="Beginner"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].level`) === 'Beginner'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />{' '}
                  <Form.Check
                    inline
                    type="radio"
                    label="Intermediate"
                    name={`${name}[${courseindex}].difficultycourse`}
                    disabled={disabled}
                    value="Intermediate"
                    checked={
                      getValues(`${name}[${courseindex}].level`) ===
                      'Intermediate'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Advanced"
                    name={`${name}[${courseindex}].difficultycourse`}
                    disabled={disabled}
                    value="Advanced"
                    checked={
                      getValues(`${name}[${courseindex}].level`) === 'Advanced'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                </Box>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[courseindex] &&
                  fieldget(errors, name)[courseindex]?.level &&
                  selectedDifficulty == null && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[courseindex]?.level.message}
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
              <Col lg={3}>
                <Form.Label className="create-course-label">
                  Permission:{' '}
                </Form.Label>
              </Col>
              <Col lg={9}>
                <Box className="d-flex align-items-center">
                  <Form.Check
                    inline
                    type="radio"
                    label="Public"
                    name={`${name}[${courseindex}].permissionradio`}
                    value="Public"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].permission`) ===
                      'Public'
                    }
                    onChange={handlePermissionChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Private"
                    name={`${name}[${courseindex}].permissionradio`}
                    value="Private"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].permission`) ===
                      'Private'
                    }
                    onChange={handlePermissionChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                </Box>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[courseindex] &&
                  fieldget(errors, name)[courseindex]?.permission &&
                  selectedPermission == null && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[courseindex]?.permission.message}
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <Row className="">
              <Col lg="3">
                <label for="Technologyskills" className="create-course-label">
                  Technology/Skills *
                </label>
              </Col>
              <Col lg="9">

                <Controller
                  name={`${name}[${courseindex}].technology_skills`}
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Select
                      placeholder="Please select"
                      hideSelectedOptions={false}
                      isDisabled={disabled}
                      isClearable={true}
                      value={selectedskill}
                      options={technology}
                      onChange={(selectedOption) => {
                        setselectedskill(selectedOption);
                        onChange(selectedOption?.id);
                      }}
                      getOptionLabel={(option) => option?.name}
                      getOptionValue={(option) => option?.id}
                    />
                  )}
                />
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[courseindex] &&
                  fieldget(errors, name)[courseindex]?.technology_skills &&
                  selectedskill == null && (
                    <p className="invalid-feedback">
                      {
                        fieldget(errors, name)[courseindex]?.technology_skills
                          .message
                      }
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col lg={3}>
                <Form.Label className="create-course-label">
                  Course type:{' '}
                </Form.Label>
              </Col>
              <Col lg={9}>
                <Box className="d-flex align-items-center">
                  <Form.Check
                    inline
                    type="radio"
                    label="Certification"
                    name={`${name}[${courseindex}].track_type`}
                    value="certification"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].track_type`) ===
                      'certification'
                    }
                    onChange={handleCourseTypeChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />{' '}
                  <Form.Check
                    inline
                    type="radio"
                    label="Up-skilling"
                    name={`${name}[${courseindex}].track_type`}
                    value="upskill"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].track_type`) ==
                      'upskill'
                    }
                    onChange={handleCourseTypeChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Soft skills"
                    name={`${name}[${courseindex}].track_type`}
                    value="softskill"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${courseindex}].track_type`) ===
                      'softskill'
                    }
                    onChange={handleCourseTypeChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                </Box>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[courseindex] &&
                  fieldget(errors, name)[courseindex]?.track_type &&
                  selectedTrackType == null && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[courseindex]?.track_type.message}
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>
          <Row>
            <Form.Group>
              <Form.Label className="create-course-label">Chapters</Form.Label>
              <DroppableComponent accept="table-row2" onDrop={handleDragChapter} fields={chapter_fields}>
                <Accordion
                  className="mb-2"
                  activeKey={activeAccordion}
                  alwaysOpen
                >
                  {chapter_fields.map((chapter, index) => (
                    <ChapterAccordion
                      key={chapter.id}
                      chapterdata={chapters}
                      name={`children[${courseindex}].chapters_details`}
                      chapter={chapter}
                      chapterIndex={index}
                      handleAccordionClick={ChapterAccordionHeaderClick}
                      handleSaveClick={ChapterhandleSaveClick}
                      activeAccordionchapter={activeAccordion}
                      setActiveAccordionchapter={setActiveAccordion}
                      dragitem={dragItemchapter}
                      dragoveritem={dragOverItemchapter}
                      handlesort={handleSortchapter}
                      remove_chapter={remove_chapter}
                      courseindex={courseindex}
                      coursetechskills={selectedskill}
                      existingcourseid={course?.course_id}
                      removecheck={handleDeselectChapter}
                    />
                  ))}
                </Accordion>
                {((trackId && !isEdit) || (!trackId && isEdit)) && (
                  <Box className="mt-2 mb-3">
                    <button
                      variant="white"
                      type="button"
                      onClick={handleShow}
                      className="p-0 w-100 mt-2 border-0"
                    >
                      <Card className="text-primary bg-light py-2">
                        Drag and drop chapters here
                      </Card>
                    </button>
                    {fieldget(errors, name) &&
                      fieldget(errors, name)?.[courseindex] &&
                      fieldget(errors, name)[courseindex]?.chapters_details && (
                        <p className="invalid-feedback">
                          {
                            fieldget(errors, name)[courseindex]
                              ?.chapters_details.message
                          }
                        </p>
                      )}
                  </Box>
                )}
              </DroppableComponent>
              {((trackId && !isEdit) || (!trackId && isEdit)) && (
                <Span onClick={AddChapterAll}>
                  <RoundPlus /> &nbsp;&nbsp;New Chapters
                </Span>
              )}
            </Form.Group>
          </Row>
          {disabled === false && (
            <Box className="d-flex justify-content-end gap-2 mt-5 mb-4">
              <button
                className="acc-top-cancel px-4 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, courseindex)}
              >
                Cancel
              </button>
              <button
                className="acc-top-sav px-3 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, courseindex)}
              >
                Save Course
              </button>
            </Box>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
};
export default CourseAccordion;
