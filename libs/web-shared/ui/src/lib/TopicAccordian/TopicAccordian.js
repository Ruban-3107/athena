import './TopicAccordian.css';
import FormFieldRow from '../FormFieldRow/FormFieldRow';
import { Controller, get as fieldget } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import {
  topicTypeData,
  deliveryTypeData,
  skills,
  userdropzonelabel,
  getImagePath,
  useAuth
} from '@athena/web-shared/utils';
import Select from 'react-select';
import { Box, FormField, Span, AccordionTopicIcon, Moveaccord, FormContext, CrossIcon, DocModal } from '@athena/web-shared/ui';
import Reactdropzone from '../Reactdropzone/Reactdropzone';

export const TopicAccordian = ({
  topicData,
  name,
  topicIndex,
  topic,
  handleSaveClick,
  handleAccordionClick,
  existingcourseid,
  coursetechskills,
  dragitem,
  dragoveritem,
  handlesort,
  removetopic,
  activeAccordion,
  setActiveAccordion,
  existingchapterid,
  removecheck,
}) => {
  const {
    register,
    control,
    setValue,
    getValues,
    selectedSkills,
    errors,
    trackId,
    isEdit,
    setError
  } = useContext(FormContext);

  const [uploadFileData, setUploadFileData] = useState(null);
  const [editTopic, setEditTopic] = useState();
  const [selectedTopicType, setSelectedTopicType] = useState(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
  // const [selectedSkills, setSelectedSkills] = useState(null);
  const [existingFile, setExistingFile] = useState(true);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [level, setLevel] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const [topictechskill, settopictechskill] = useState(null);
  const [fileName, setfileName] = useState('')
  const [extension, setExtension] = useState('');
  const [userRole, setuserRole] = useState('');
  const auth = useAuth();

  const [docState, setdocState] = useState({
    open: false,
    url: "",
    header: false,
  })

  const handleOpenDoc = () => {
    setdocState({
      open: true,
      url: uploadFileData,
      header: false
    })
  }

  useEffect(() => {
    if (auth && auth?.user) {
      setuserRole(auth?.user?.role[0].name);
    }
  }, [auth?.user]);

  useEffect(() => {
    if (trackId) {
      setdisabled(isEdit);
    } else if (existingcourseid || existingchapterid) {
      setdisabled(true);
    } else {
      setdisabled(false);
    }
  }, [isEdit, trackId, existingcourseid, existingchapterid]);



  useEffect(() => {
    console.log('htht', getValues(`${name}[${topicIndex}].topic_file`));
    if (trackId || existingcourseid || existingchapterid) {
      let total = getValues(`${name}[${topicIndex}].duration`);
      let FileUrl = getValues(`${name}[${topicIndex}].topic_file`);
      handledurationset(total);
      let editFileUrl = FileUrl?.split('?')?.[0];
      let exte = editFileUrl?.split('.').pop();
      let fileName = editFileUrl?.split('/').pop();
      console.log(getValues(), 'getall');
      setValue(`${name}[${topicIndex}].file`, fileName);
      setEditTopic(fileName);
    }
  }, [trackId, existingcourseid, existingchapterid, topicIndex]);

  useEffect(() => {
    if (topic?.topic_id) {
      console.log(topic?.topic_id, "topic?.topic_id");
      setdisabled(true);
      const topicDat = topicData.find((t) => t.id === topic.topic_id);
      console.log("popopop", topicDat);
      for (const key in topicDat) {
        if (key == 'title') {
          setValue(`${name}[${topicIndex}].title`, topicDat['title']);
        }
        if (key == 'description') {
          setValue(
            `${name}[${topicIndex}].description`,
            topicDat['description']
          );
        }
        if (key === 'topic_type') {
          // setSelectedTopicType(
          //   topicTypeData.find(e => e.id == topicDat['topic_type'])
          // );
          setValue(`${name}[${topicIndex}].topic_type`, topicDat['topic_type']);
        }
        if (key === 'delivery_type') {
          // setSelectedDeliveryType(
          //   deliveryTypeData.find(e => e.id == topicDat['delivery_type'])
          // );
          setValue(
            `${name}[${topicIndex}].delivery_type`,
            topicDat['delivery_type']
          );
        }
        if (key == 'duration') {
          let total = topicDat['duration'];
          handledurationset(total);
        }
        if (key == 'topic_link') {
          setValue(`${name}[${topicIndex}].topic_link`, topicDat['topic_link']);
        }
        if (key == 'level') {
          setValue(`${name}[${topicIndex}].level`, topicDat['level']);
        }
        if (key == 'attachment_url') {
          let editFileUrl = topicDat?.attachment_url?.split('?')?.[0];
          console.log(editFileUrl, 'editfileurl');
          let exte = editFileUrl?.split('.').pop();
          console.log(exte, 'exte');
          let fileName = editFileUrl?.split('/').pop();
          console.log(fileName, 'name');
          //setUploadFileData(fileName);
          setValue(`${name}[${topicIndex}].file`, fileName);
          setEditTopic(fileName);
        }
      }
    }
    console.log('gggggggggggggggggg', getValues());
  }, [topicIndex]);

  useEffect(() => {
    if (coursetechskills) {
      setValue(
        `${name}[${topicIndex}].technology_skills`,
        coursetechskills?.id
      );
      settopictechskill(coursetechskills);
    } else if (selectedSkills) {
      setValue(`${name}[${topicIndex}].technology_skills`, selectedSkills?.id);
      settopictechskill(selectedSkills);
    }
  }, [topicIndex, selectedSkills, coursetechskills]);

  const fileData = (data) => {
    setfileName(data[0]?.name)
    setValue(`${name}[${topicIndex}].file`, data);
    setUploadFileData(data[0]?.preview)
    const ccc = data.map((file) => {
      const extension = file.name;
      const extensionName = extension.split('.');
      setExtension(extensionName[1]);
    });
  };

  const handleDurationChange = (totalMinutes) => {
    console.log('///////////?????????', hours);
    let hm, sm;
    hm = hours ? Number(hours) * 60 : 0;
    sm = seconds ? Number(seconds) / 60 : 0;
    totalMinutes = Number(hm) + Number(minutes) + Number(sm);
    // console.log('>>>>>>>>>>>>>>>>', totalMinutes, typeof totalMinutes);
    setValue(`${name}[${topicIndex}].duration`, totalMinutes);
    //  setDuration(totalMinutes);
  };

  const handledurationset = (total) => {
    let hours = total / 60;
    let rhours = Math.floor(hours);
    setHours(Number(rhours));
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    setMinutes(Number(rminutes));
    setSeconds(0);
    setValue(`${name}[${topicIndex}].duration`, total);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setLevel(e.target.value);
    setValue(`${name}[${topicIndex}].level`, e.target.value);
  };

  const SaveAccordion = (event, index) => {
    event.preventDefault();
    handleSaveClick(event, index);
  };

  useEffect(() => {
    if (errors && fieldget(errors, name)?.[topicIndex]) {
      if (!activeAccordion?.includes(topicIndex)) {
        setActiveAccordion((prevArray) => [...prevArray, topicIndex]);
      }
    }
  }, [errors]);
  

  return (
    <>
      <DocModal docState={docState} setdocState={setdocState} isModal={true} />
      <Accordion.Item eventKey={topicIndex} className="mb-3 accord-item">
        <Accordion.Header
          className="topic-accord draggable-item py-2"
          onClick={() => handleAccordionClick(topicIndex)}
          draggable
          onDragStart={(e) => (dragitem.current = topicIndex)}
          onDragEnter={(e) => (dragoveritem.current = topicIndex)}
          onDragEnd={handlesort}
          onDragOver={(e) => e.preventDefault()}
        >
          <Box className="d-flex align-items-center ms-4 gap-4 w-100">
            <Span className="draggable-item mb-0 mt-0">
              <Moveaccord />
            </Span>
            <AccordionTopicIcon />
            {/* {titles != null ? titles : `Topic${topicIndex}`} */}
            {console.log(
              'ssssssssssss',
              `${name}[${topicIndex}].title`,
              getValues(`${name}[${topicIndex}].title`)
            )}
            {getValues(`${name}[${topicIndex}].title`) !== undefined
              ? getValues(`${name}[${topicIndex}].title`).length > 0
                ? getValues(`${name}[${topicIndex}].title`)
                : `Topic${[topicIndex + 1]}`
              : `Topic${[topicIndex + 1]}`}
          </Box>
          {((trackId && !isEdit) ||
            (!trackId && isEdit && !existingcourseid && !existingchapterid)) && (
              <Box className="delete-accord ms-auto me-4">
                <Span
                  style={{ color: '#FF4D4F', cursor: 'pointer' }}
                  //  onClick={() => removetopic(topicIndex)}
                  onClick={() =>
                    topic?.topic_id
                      ? removecheck(
                        topicData?.find((t) => t?.id === topic?.topic_id)
                      )
                      :
                      removetopic(topicIndex)
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
              name={`${name}[${topicIndex}].title`}
              size="md"
              size1="3"
              size2="9"
              type="input"
              labelClassName="create-course-label"
              disabled={disabled}
              inputRef={register(`${name}[${topicIndex}].title`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[topicIndex]?.title
              }
              label="Topic Name *"
              placeHolder="Topic here"
            />
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <FormFieldRow
              name={`${name}[${topicIndex}].description`}
              size1="3"
              size2="9"
              type="textarea"
              disabled={disabled}
              inputRef={register(`${name}[${topicIndex}].description`)}
              error={
                fieldget(errors, name)?.length > 0 &&
                fieldget(errors, name)?.[topicIndex]?.description
              }
              rows="5"
              label="Description "
              labelClassName="create-course-label"
              placeHolder="Description here"
              formtext="Describe the topic shortly"
              formtextclassName="create-form-text"
            />
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <Row className="">
              <Col lg="3">
                <label for="TopicType" className="create-course-label">
                  Topic Type *
                </label>
              </Col>
              <Col lg="9">
                <Controller
                  name={`${name}[${topicIndex}].topic_type`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      placeholder="Please select"
                      hideSelectedOptions={false}
                      isClearable={true}
                      value={topicTypeData.find(
                        (e) =>
                          e.id == getValues(`${name}[${topicIndex}].topic_type`)
                      )}
                      isDisabled={disabled}
                      options={topicTypeData}
                      onChange={(selectedOption) => {
                        onChange(selectedOption.id);
                        console.log("ttttttttt", selectedOption);
                        setSelectedTopicType(selectedOption);
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )}
                />
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[topicIndex] &&
                  fieldget(errors, name)[topicIndex]?.topic_type && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[topicIndex]?.topic_type.message}
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <Row className="">
              <Col lg="3">
                <label for="Delivery_type" className="create-course-label">
                  Delivery Type *
                </label>
              </Col>
              <Col lg="9">
                <Controller
                  name={`${name}[${topicIndex}].delivery_type`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      placeholder="Please select"
                      hideSelectedOptions={false}
                      isClearable={true}
                      value={deliveryTypeData.find(
                        (e) =>
                          e.id ==
                          getValues(`${name}[${topicIndex}].delivery_type`)
                      )}
                      isDisabled={disabled}
                      options={deliveryTypeData}
                      onChange={(selectedOption) => {
                        onChange(selectedOption.id);
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )}
                />
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[topicIndex] &&
                  fieldget(errors, name)[topicIndex]?.delivery_type && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[topicIndex]?.delivery_type.message}
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>
          {selectedTopicType?.name == 'Topic Link' && (
            <Form.Group controlId="name" className="mb-3">
              <FormFieldRow
                name={`${name}[${topicIndex}].topic_link`}
                size="md"
                size1="3"
                size2="9"
                disabled={disabled}
                type="input"
                label="Topic Link *"
                labelClassName="create-course-label"
                inputRef={register(`${name}[${topicIndex}].topic_link`)}
                error={
                  fieldget(errors, name)?.length > 0 &&
                  fieldget(errors, name)?.[topicIndex]?.topic_link
                }
                placeHolder="topic link"
              />
            </Form.Group>
          )}
          <InputGroup name="duration" onChange={handleDurationChange}>
            <Row className="mt-3 mb-3">
              <Col lg={3}>
                <Form.Label name="duration" className="p-0 create-course-label">
                  Duration *
                </Form.Label>
              </Col>
              <Col lg={9}>
                <Row>
                  <Col lg={9} className="d-flex">
                    <FormField
                      aria-label="hr"
                      name="hr"
                      type="number"
                      placeholder="00"
                      disabled={disabled}
                      className="rounded-3 duration-box"
                      onInputCapture={(e) => {
                        setHours(e.target.value);
                      }}
                      value={hours}
                    />
                    <p className="ms-3 me-3">hr</p>
                    <FormField
                      aria-label="min"
                      name="min"
                      type="number"
                      placeholder="00"
                      disabled={disabled}
                      className="rounded-3 duration-box"
                      onInputCapture={(e) => setMinutes(e.target.value)}
                      value={minutes}
                    />
                    <p className="ms-3 me-3">min</p>
                    <FormField
                      aria-label="se c"
                      name="sec"
                      type="number"
                      placeholder="00"
                      disabled={disabled}
                      className="rounded-3 duration-box"
                      onInputCapture={(e) => setSeconds(e.target.value)}
                      value={seconds}
                    />
                    <p className="ms-3 me-3">sec</p>
                  </Col>
                </Row>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[topicIndex] &&
                  fieldget(errors, name)[topicIndex]?.duration && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[topicIndex]?.duration.message}
                    </p>
                  )}
              </Col>
            </Row>
          </InputGroup>

          <Form.Group controlId="name" className="mb-3">
            <Row className="">
              <Col lg="3">
                <label for="Technologyskills" className="create-course-label">
                  Technology/Skills *
                </label>
              </Col>
              <Col lg="9">
                <Controller
                  name={`${name}[${topicIndex}].technology_skills`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      placeholder="Please select"
                      hideSelectedOptions={false}
                      isClearable={true}
                      value={topictechskill}
                      options={skills}
                      isDisabled={true}
                      // onChange={onChange}
                      // onChange={(selectedOption) => {
                      //   console.log("rrrrrrr", selectedOption);
                      //   setSelectedSkills(selectedOption);
                      //   onChange(selectedOption.id);
                      // }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                    />
                  )}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col lg={3}>
                <Form.Label className="create-course-label">Level * </Form.Label>
              </Col>
              <Col lg={9}>
                <Box className="d-flex align-items-center">
                  <Form.Check
                    inline
                    type="radio"
                    label="Beginner"
                    name={`${name}[${topicIndex}].level`}
                    value="Beginner"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${topicIndex}].level`) === 'Beginner'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />{' '}
                  <Form.Check
                    inline
                    type="radio"
                    label="Intermediate"
                    name={`${name}[${topicIndex}].level`}
                    value="Intermediate"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${topicIndex}].level`) === 'Intermediate'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Advanced"
                    name={`${name}[${topicIndex}].level`}
                    value="Advanced"
                    disabled={disabled}
                    checked={
                      getValues(`${name}[${topicIndex}].level`) === 'Advanced'
                    }
                    onChange={handleDifficultyChange}
                    className="text-muted d-flex"
                    style={{ fontSize: 'smaller' }}
                  />
                </Box>
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[topicIndex] &&
                  fieldget(errors, name)[topicIndex]?.level &&
                  selectedDifficulty == null && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[topicIndex]?.level.message}
                    </p>
                  )}
              </Col>
            </Row>
          </Form.Group>

          {selectedTopicType?.name !== 'Topic Link' && (
            <Row>
              <Col lg="3">
                <label for="staticEmail" className="mt-3 create-course-label">
                  Topic Upload *
                </label>
              </Col>
              <Col lg="9" className="mt-3">
                <Reactdropzone
                  name={`${name}[${topicIndex}].file`}
                  fileData={fileData}
                  userdropzone={userdropzonelabel}
                  dropboxclass="dropzone-boxsmall dropzonewidth"
                  fileType={userRole === "Admin" || userRole === "Super Admin" ? "topicfiles" : "topicfilesNoPdf"}
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
                      onClick={() => setUploadFileData(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CrossIcon />
                    </span>
                  </Box>
                }
                {fieldget(errors, name) &&
                  fieldget(errors, name)?.[topicIndex] &&
                  fieldget(errors, name)[topicIndex]?.file && (
                    <p className="invalid-feedback">
                      {fieldget(errors, name)[topicIndex]?.file.message}
                    </p>
                  )}
              </Col>
            </Row>
          )}
          {disabled === false && (
            <Box className="d-flex justify-content-end gap-2 mt-5 mb-4">
              <button
                className="acc-top-cancel px-4 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, topicIndex)}
              >
                Cancel
              </button>
              <button
                className="acc-top-sav px-3 py-1"
                type="button"
                onClick={(e) => SaveAccordion(e, topicIndex)}
              >
                SaveTopic
              </button>
            </Box>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
};
export default TopicAccordian;

