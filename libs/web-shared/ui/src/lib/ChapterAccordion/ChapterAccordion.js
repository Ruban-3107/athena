import './ChapterAccordion.css';
import { Accordion, Card, Col, Form, Row, Offcanvas, Button, ButtonToolbar, ButtonGroup, Table, Spinner, OverlayTrigger } from 'react-bootstrap';
import { useEffect, useState, useRef, useContext } from 'react';
import FormFieldRow from '../FormFieldRow/FormFieldRow';
import { Controller, useFieldArray, get as fieldget } from 'react-hook-form';
import Select from 'react-select';
import { skills, apiRequest, isFoundTopic } from '@athena/web-shared/utils';
import { Box, Span, SearchBar, DocumentIcon, FormContext, DraggableComponent, DroppableComponent } from '@athena/web-shared/ui';
import { AccordionChapterIcon, Moveaccord, RoundPlus, VideoIcon } from '../Icons/Icons';
import TopicAccordian from '../TopicAccordian/TopicAccordian';
import { toast } from 'react-toastify';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const ChapterAccordion = (props) => {

  const { register, control, setValue, errors, selectedSkills, isEdit, getValues, trackId } = useContext(FormContext);

  const {
    chapterdata, chapter, name, chapterIndex, activeAccordionchapter,
    setActiveAccordionchapter, handleSaveClick, dragitem, dragoveritem, removecheck,
    handlesort, handleAccordionClick, remove_chapter, existingcourseid,coursetechskills
  } = props;
  const { fields: topic_fields, append: append_topic, remove: remove_topic, move } = useFieldArray({
    control,
    name: `${name}[${chapterIndex}].topics`,
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState([]);
  const [disabled, setdisabled] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicsList, setTopicsList] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [pageN, setPageN] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [topicType, setTopicType] = useState('All');
  const [Totalpage, setTotalpage] = useState('');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('All');
  const [saveType, setSaveType] = useState(null);
  const [chaptertechskill, setchaptertechskill] = useState(null);
  const scrollContainerRef = useRef(null);
  const [selectedTopics, setSelectedTopics] = useState([]);


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
        remove_topic(topicIndex);
      }
    }, null);

    selectedTopics.forEach((topic) => {
      if (!topic_fields.some((field) => field.topic_id === topic.id)) {
        append_topic({ topic_id: topic.id });
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

  useEffect(() => {
    if (coursetechskills) {
      setValue(`${name}[${chapterIndex}].technology_skills`, coursetechskills?.id);
      setchaptertechskill(coursetechskills);
    }
    else if (selectedSkills) {
      setValue(`${name}[${chapterIndex}].technology_skills`, selectedSkills?.id);
      setchaptertechskill(selectedSkills);
    }
  }, [chapterIndex, selectedSkills, coursetechskills]);

  const Addtopicall = () => {
    append_topic({
      title: '',
      description: '',
      topic_type: '',
      delivery_type: '',
      technology_skills: '',
      level: '',
    });
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setValue(`${name}[${chapterIndex}].level`, e.target.value);
  };

  const SaveAccordion = (event, index) => {
    handleSaveClick(event, index);
  };

  const TopicAccordionHeaderClick = (index) => {
    if (activeAccordion.includes(index)) {
      setActiveAccordion(activeAccordion.filter((dat) => dat != index));
    } else {
      setActiveAccordion((prevArray) => [...prevArray, index]);
    }
  };

  const TopichandleSaveClick = (event, index) => {
    event.stopPropagation();
    setActiveAccordion(
      activeAccordion.filter((accIndex) => accIndex !== index)
    );
  };

  const handleDeselectTopic = (topic) => {
    const newFilteredItems = filteredItems.filter((item) => item !== topic);
    let index = topic_fields?.findIndex((x) => x?.topic_id === topic?.id);
    remove_topic(index);
    setFilteredItems(newFilteredItems);
  };

  const Addtopicidonly = (topicId, topic) => {
    if (!isFoundTopic(topic, topicId)) {
      append_topic({ topic_id: topicId });
    } else {
      return null;
    }
  };
  useEffect(() => {
    if (trackId) {
      setdisabled(isEdit);
    }
    else if (existingcourseid) {
      setdisabled(true);
    }
    else {
      setdisabled(false);
    }
  }, [isEdit, trackId, existingcourseid]);

  useEffect(() => {
    if (chapter?.chapter_id) {
      setdisabled(true);
      const chapterDat = chapterdata.find(t => t.id === chapter.chapter_id);
      console.log(chapterDat, 'chapty')
      for (const key in chapterDat) {
        if (key === 'title') {
          setValue(`${name}[${chapterIndex}].title`, chapterDat['title']);
        }
        if (key === 'description') {
          setValue(`${name}[${chapterIndex}].description`, chapterDat['description']);
        }
        if (key === 'level') {
          setSelectedDifficulty(chapterDat['level']);
          setValue(`${name}[${chapterIndex}].level`, chapterDat['level']);
        }
        if (key == 'chapter_topics') {
          const chapterTopics = chapterDat['chapter_topics'];
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
                topic_file: topic.attachment_url
              });
            });
          }
          setValue(`${name}[${chapterIndex}].topics`, topics);
        }
      }
    }
  }, [chapterIndex]);

  const getTop = async (pageNo, size) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let requestParams = {
        pageNo,
        size,
      };
      if (chaptertechskill) {
        requestParams.technology_skills = chaptertechskill.id;
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
      console.log(error);
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
  }, [pageN, pageSize, filterText, chaptertechskill]);

  function TableRow({ topic }) {
    return (
      <>
        <DraggableComponent
          type="table-row3"
          item={topic}
          renderElement={'tr'}
          handleClose={handleClose}
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
            </div>
          </td>

          {topic.title.length > 30 ? (
            <OverlayTrigger
              delay={{ show: 1000, hide: 400 }}
              placement="bottom-start"
              overlay={renderTooltip(`${topic.title}`)}
            >
              <td style={{ cursor: 'pointer' }}>
                {`${topic.title.slice(0, 30)}...`}
              </td>
            </OverlayTrigger>
          ) : (
            <td style={{ cursor: 'pointer' }}>{topic.title}</td>
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
      </>
    );
  }

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

  const handleShow = () => {
    if (selectedSkills != null) {
      setShow(true);
    }
    else {
      toast.info('please select technology skill first');
    }
  };
  const handleClose = () => {
    setShow(false);
  };
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = async () => {
    move(dragItem.current, dragOverItem.current);
  };

  useEffect(() => {
    if (errors && fieldget(errors, name)?.[chapterIndex]) {
      if (!activeAccordionchapter?.includes(chapterIndex)) {
        setActiveAccordionchapter((prevArray) => [...prevArray, chapterIndex]);
      }
    }
  }, [errors]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Accordion.Item eventKey={chapterIndex} className="mb-3 accord-item">
        <Accordion.Header
          className="topic-accord"
          onClick={() => handleAccordionClick(chapterIndex)}
          draggable
          onDragStart={(e) => (dragitem.current = chapterIndex)}
          onDragEnter={(e) => (dragoveritem.current = chapterIndex)}
          onDragEnd={handlesort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Box className="d-flex align-items-center ms-4 gap-4 w-100">
            <Span className="draggable-item mb-0 mt-0">
              <Moveaccord />
            </Span>
            <AccordionChapterIcon />
            {getValues(`${name}[${chapterIndex}].title`) !== undefined
              ? getValues(`${name}[${chapterIndex}].title`).length > 0
                ? getValues(`${name}[${chapterIndex}].title`)
                : `chapter${[chapterIndex + 1]}`
              : `chapter${[chapterIndex + 1]}`}
          </Box>

          {((trackId && !isEdit) ||
            (!trackId && isEdit && !existingcourseid)) && (
              <Box className="delete-accord ms-auto me-4">
                <Span
                  style={{ color: '#FF4D4F', cursor: 'pointer' }}
                  onClick={() =>
                    chapter?.chapter_id
                      ? removecheck(
                        chapterdata.find((t) => t?.id === chapter?.chapter_id)
                      )
                      : remove_chapter(chapterIndex)
                  }
                >
                  Remove
                </Span>
              </Box>
            )}
        </Accordion.Header>
        <Accordion.Body className="topic-body">
          <Form.Group controlId="title" className="mb-3">
            <FormFieldRow
              name={`${name}[${chapterIndex}].title`}
              size="md"
              size1="3"
              size2="9"
              type="input"
              disabled={disabled}
              inputRef={register(`${name}[${chapterIndex}].title`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[chapterIndex]?.title
              }
              label="Chapter Title *"
              labelClassName="create-course-label"
              placeHolder="chapter here"
            />
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <FormFieldRow
              name={`${name}[${chapterIndex}].description`}
              size1="3"
              size2="9"
              type="textarea"
              disabled={disabled}
              inputRef={register(`${name}[${chapterIndex}].description`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[chapterIndex]?.description
              }
              rows="5"
              label="Chapter Description"
              placeHolder="Description here"
              labelClassName="create-course-label"
              formtext="Describe the topic shortly"
              formtextclassName="create-form-text"
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
                    name={`${name}[${chapterIndex}].level`}
                    value="Beginner"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${chapterIndex}].level`) === 'Beginner'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />{' '}
                  <Form.Check
                    inline
                    type="radio"
                    label="Intermediate"
                    name={`${name}[${chapterIndex}].level`}
                    value="Intermediate"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${chapterIndex}].level`) ===
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
                    name={`${name}[${chapterIndex}].level`}
                    value="Advanced"
                    disabled={disabled}
                    checked={`${name}[${chapterIndex}].level` === 'Advanced'}
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                </Box>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[chapterIndex] &&
                  fieldget(errors, name)[chapterIndex]?.level && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[chapterIndex]?.level.message}
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
                  name={`${name}[${chapterIndex}].technology_skills`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      placeholder="Please select"
                      hideSelectedOptions={false}
                      isClearable={true}
                      value={chaptertechskill}
                      isDisabled={true}
                      options={skills}
                      // onChange={(selectedOption) => {
                      //   setselectedSkills(selectedOption);
                      //   onChange(selectedOption.id);
                      // }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )}
                />
                {/* {errors.topic_type && selectedTopicType == null && (
              <p className="invalid
              -feedback">
                {errors.topic_type?.message ||
                  errors.topic_type?.name.message}
              </p>
            )} */}
              </Col>
            </Row>
          </Form.Group>
          <Row className="d-flex justify-content-center">
            <Form.Group>
              <Form.Label className="create-course-label">Topics</Form.Label>
              <Offcanvas
                style={{ width: '520px' }}
                show={show}
                onHide={handleClose}
                placement="end"
              >
                <Offcanvas.Header
                  closeButton
                  className="custom-close-button button "
                >
                  <Offcanvas.Title>Explore Topics</Offcanvas.Title>{' '}
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
                  onScroll={handleScroll}>
                  <Box className="mx-2 exp-topics">
                    <div                    >
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
                          setTopicsList([]);
                        }}
                      >
                        Clear All
                      </Button>{' '}
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
                        {' '}
                        Add Topic
                      </Button>{' '}
                    </ButtonGroup>{' '}
                  </ButtonToolbar>{' '}
                </Offcanvas.Header>{' '}
              </Offcanvas>
              <DroppableComponent
                accept="table-row3"
                onDrop={handleDragTopic}
                fields={topic_fields}>
                <Accordion
                  className="mb-2"
                  activeKey={activeAccordion}
                  alwaysOpen
                >
                  {topic_fields.map((topic, index) => (
                    <TopicAccordian
                      key={topic.id}
                      topicData={topics}
                      topic={topic}
                      name={`${name}[${chapterIndex}].topics`}
                      topicIndex={index}
                      handleAccordionClick={TopicAccordionHeaderClick}
                      handleSaveClick={TopichandleSaveClick}
                      removetopic={remove_topic}
                      dragitem={dragItem}
                      dragoveritem={dragOverItem}
                      handlesort={handleSort}
                      setActiveAccordion={setActiveAccordion}
                      coursetechskills={chaptertechskill}
                      existingcourseid={existingcourseid}
                      existingchapterid={chapter?.chapter_id}
                      removecheck={handleDeselectTopic}
                    />
                  ))}
                </Accordion>
                {((trackId && !isEdit) ||
                  (!trackId && isEdit && !existingcourseid)) && (
                    <>
                      <button
                        type="button"
                        onClick={handleShow}
                        variant="white"
                        className="p-0 w-100 mt-2 border-0 mb-2"
                      >
                        <Card className="text-primary bg-light py-2">
                          Drag and drop topics here
                        </Card>
                      </button>
                      {fieldget(errors, name) &&
                        fieldget(errors, name)?.[chapterIndex] &&
                        fieldget(errors, name)[chapterIndex]?.topics && (
                          <p className="invalid-feedback">
                            {fieldget(errors, name)[chapterIndex]?.topics.message}
                          </p>
                        )}
                    </>
                  )}
              </DroppableComponent>
              {((trackId && !isEdit) ||
                (!trackId && isEdit && !existingcourseid)) && (
                  <Span onClick={Addtopicall}>
                    <RoundPlus /> &nbsp;&nbsp;New Topic
                  </Span>
                )}
            </Form.Group>
          </Row>
          {disabled === false && (
            <Box className="d-flex justify-content-end gap-2 mt-5 mb-4">
              <button
                className="acc-top-cancel px-4 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, chapterIndex)}
              >
                Cancel
              </button>
              <button
                className="acc-top-sav px-3 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, chapterIndex)}
              >
                SaveChapter
              </button>
            </Box>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </DndProvider>
  );
};
export default ChapterAccordion;

