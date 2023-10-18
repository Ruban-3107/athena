import './TrainerCalender.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Modal,
  ListGroup,
} from 'react-bootstrap';
import { CardBox, Box, LocationIcon, ChatIcon, PersonIcon, Span, ButtonComponent } from '@athena/web-shared/ui';
import { useAuth, apiRequest } from '@athena/web-shared/utils';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
export const TrainerCalender = (props) => {
  const auth = useAuth();
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [statusModal, setStatusModal] = useState({ open: false, modaldata: null });
  const [modaldrop, setModaldrop] = useState(null);
  const calendarRef = useRef(null);
  const [uniqueScheduleId, setUniqueScheduleId] = useState(null)
  const [updateData, setUpdateData] = useState({})
  const [eventstatus, seteventstatus] = useState("");
  

  const schema = yup.object().shape({
    reason: yup
      .object()
      .shape({
        label: yup.string().required("Please provide valid reason (from label)"),
        value: yup.string().required("Please provide valid reason")
      })
      .nullable()
      .required("Please provide valid reason (from outter null check)"),
    message: yup
      .string()
      .required('Message is required')
      .min(10, 'Message should be min 10 characters')
      .max(255, 'Message should be max 255 characters')
  });

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({ resolver: yupResolver(schema) });
  const changeCalendarView = (view) => {
    setCalendarView(view)
    setTimeout(() => {
      let calendarApi = calendarRef.current.getApi(); // linter will complain it's possibly null
      calendarApi.changeView(view); // the actual view we want
    }, 100);
  };
  useEffect(() => {
    console.log(errors, "error")
  }, [errors]);

  const stylee = {
    pending: {
      textcolor: '#40A9FF',
      backgroundColor: 'rgba(64, 169, 255, 0.25)',
    },
    cancelled: {
      textcolor: '#535151',
      backgroundColor: "#F5F5F5",
    },
    scheduled: {
      textcolor: '#6750A3',
      backgroundColor: 'rgba(103, 80, 163, 0.25)',
    },
    'under rescheduling': {
      textcolor: '#A37709',
      backgroundColor: 'rgba(255, 200, 59, 0.25',
    },
    rescheduled: {
      textcolor: '#D664F5',
      backgroundColor: 'rgba(225, 170, 240, 0.34)',
    },
    declined: {
      textcolor: '#FF3838',
      backgroundColor: 'rgba(255, 56, 56, 0.25)',
    },
  }

  const getSchedulesByuserId = async (id) => {
    let key = 'trainer'
    if (auth?.user?.role[0]['name'] === "Learner") {
      key = 'learner'
    }
    const scheduledetails = await apiRequest(`api/batches/schedules/${key}/${id}`);
    console.log("?????????????????????", scheduledetails)
    let events = scheduledetails?.value?.scheduleData?.map((x) => {
      console.log("x?.schedule_batches.name::::",x?.schedule_batches.name)
      return {
        id: x.id,
        title: x.topicTitle,
        course: x.courseTitle,
        start: x.start_at,
        end: x.end_at,
        status: x.status,
        topic_id: x.topic_id,
        chapter_id: Number(x.chapter_id),
        course_id: Number(x.track_id),
        trainer_id: x.trainer_id,
        unique_id: x.unique_id,
        trainer_name: `${x.trainer.first_name} ${x.trainer.last_name}`.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        batch_id: Number(x.batch_id),
        batch_learners: x?.learner_id,
        accepted_at: x?.accepted_at,
        declined_at: x?.declined_at,
        accepted_by: x?.accepted_by,
        declined_by: x?.declined_by,
        batch_name : x?.schedule_batches.name
      }
    })
    if (auth?.user?.role[0]['name'] === "Learner") {
      let fevents = events?.filter(event => (
        (event.status === 'scheduled' || event.status === 'rescheduled' || (event.status === 'cancelled'
          && (event.accepted_at !== null || event.accepted_at > event.declined_at)) || (event.status === 'pending' && (event.accepted_at !== null || event.accepted_at > event.declined_at)))
        || (event.status === 'declined' && (event.declined_at !== null && event.declined_at > event.accepted_at))
      ));
      console.log("%%%%%%%%%%%", fevents)
      setScheduleEvents(fevents)
    }
    else {
      console.log("%%%%%%%%%%%", auth.user)
      // let fevents = events?.filter(event => (
      //   // (event.status !== 'declined') || (event.status === 'cancelled' && event.accepted_by === Number(auth?.user?.id))
      //   event.status !== 'cancelled' || (event.status === 'cancelled' && event.accepted_by === (auth?.user?.id ? Number(auth.user.id) : null)) || event.status !== 'declined'
      // ));
      // let fevents = events?.filter(event => (
      //   event.status !== 'declined' && (event.status !== 'cancelled' || (Number(event.accepted_by) === Number(auth.user.id)))
      // ));
      // console.log("%%%%%%%%%%%", fevents)
      setScheduleEvents(events)
    }

  }

  useEffect(() => {
    console.log("////////////////////////", auth)
    getSchedulesByuserId(auth?.user?.id);
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#40A9FF';
      case 'cancelled':
        return '#535151';
      case 'scheduled':
        return '#6750A3';
      case 'declined':
        return '#FF3838';
      case 'rescheduled':
        return '#D664F5';
      case 'under rescheduling':
        return '#A37709';
      default:
        return '#000000';
    }
  };

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const renderEventContent = (eventInfo) => {

    console.log("????????????", eventInfo.event)
    const title = eventInfo.event.title.length > 20
      ? eventInfo.event.title.slice(0, 20) + '...'
      : eventInfo.event.title;
    let temp = eventInfo.event.extendedProps;
    console.log("temp.123333", temp)
    const course = temp.course.length > 10
      ? temp.course.slice(0, 10) + '...'
      : temp.course;
    const { start, end } = eventInfo.event;
    const startTime = start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let status = temp?.status;
    let accepted_at = temp?.accepted_at;
    let declined_at = temp?.declined_at;
    if (auth?.user?.role[0]['name'] === "Trainer") {
      if (status === 'under rescheduling') {
        status = 'under rescheduling'
        // status = 'under rescheduling'
      }
    }
    if (auth?.user?.role[0]['name'] === "Learner") {
      if (status === 'pending') {
        status = ''
      }
      if (status === 'under rescheduling') {
        status = 'under rescheduling'
        // status = 'under rescheduling'
      }
    }
    console.log("br", status)
    return (
      <Box
        className="event-box w-100"
        style={{ backgroundColor: stylee[status]?.backgroundColor, borderLeft: `5px solid ${stylee[status]?.textcolor}` }}
      >
        <h6
          className="d-flex justify-content-end"
          style={{
            fontSize: '9px',
            position: 'absolute',
            top: -14,
            right: 13,
            backgroundColor: getStatusColor(status),
            color: '#fff',
            padding: '2px 13px',
            borderRadius: '7px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }}
        >
          {toTitleCase(status)}
        </h6>
        <Box className="pl-2 py-2">
          <Box className="d-flex align-items-center justify-content-between">
            <h5 style={{ color: "#000", fontSize: "10px", textDecoration: (status === "cancelled") ? 'line-through' : 'none' }} className="">{toTitleCase(title)}</h5>
            {/* <h6
              className="d-flex justify-content-end"
              style={{
                fontSize: '10px',
                color: getStatusColor(status) // Call a function to get the appropriate color based on the status
              }}
            >

              {status === 'pending' ? 'new' : status}
            </h6> */}
          </Box>
          {/* {Here the schedule show} */}
          <Box className="d-flex justify-content-between mr-1 mb-1">
            <h6 className="mb-0" style={{ color: stylee[status]?.textcolor, fontSize: "8px" }}>{toTitleCase(course)}</h6>
            <h6 className="d-flex justify-content-end mb-0" style={{ color: "#000", fontSize: "8px" }}>{startTime}-{endTime}</h6>
          </Box>
        </Box>
      </Box >
    )
  }

  const handleEventClick = (arg) => {
    // alert('Coordinates: ' + arg.jsEvent.screenX + ',' + arg.jsEvent.screenY);
    // const bodyRect = document.body.getBoundingClientRect(),
    // elemRect = arg.el.getBoundingClientRect(),
    // offsetLeft   = elemRect.left - bodyRect.left -320,
    // offsetTop   = elemRect.top - bodyRect.top - 450
    if (arg.event._def.extendedProps.status === 'cancelled') {
      // Prevent event click when status is "cancelled"
      arg.jsEvent.preventDefault();
      return;
    }

    console.log("$$$$$$$$$$$$$$$$$$arg.event.extendedProps", arg.event.extendedProps)
    const title = arg.event.title.length > 20
      ? arg.event.title.slice(0, 20) + '...'
      : arg.event.title;
    let temp = arg.event.extendedProps;
    const course = temp.course.length > 10
      ? temp.course.slice(0, 10) + '...'
      : temp.course;
    setUniqueScheduleId(temp.unique_id)
    let filterData =scheduleEvents.filter((data) => {
      return data.unique_id
        == temp.unique_id

    })
    setUpdateData({
      'track_id': Number(temp.course_id),
      'chapter_id': Number(temp.chapter_id),
      'topic_id': Number(temp.topic_id),
      'trainer_id': Number(temp.trainer_id),
      'batch_id': Number(temp.batch_id),
      'learner_id': temp.batch_learners,
      'topic_name': filterData[0].title,
      'trainer_name' : filterData[0].trainer_name,
      "start_at": filterData[0].start,
      "end_at":filterData[0].end,
      "batch_name": temp.batch_name
    })
    seteventstatus(temp.status);

    const { start, end } = arg.event;
    const startTime = new Date(start);
    const endTime = new Date(end);

    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };

    const startString = `${startTime.toLocaleDateString('en-US', options).replace('at', ',')}`;
    // const endString = `${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')} ${endTime.getHours() >= 12 ? 'PM' : 'AM'}`;
    const endString = `${endTime.getHours() % 12}:${endTime.getMinutes().toString().padStart(2, '0')} ${endTime.getHours() >= 12 ? 'PM' : 'AM'}`;

    const outputString = `${startString} to ${endString}`;

    const obj = { "title": title, "course": course, "timings": outputString, "trainer": temp.trainer_name, "status": temp.status }
    console.log("outputString,obj", obj);

    setStatusModal({ open: true, modaldata: obj })

  };
  

  const modaldropdowndata = [
    {
      label: 'Accept', value: eventstatus==="under rescheduling" ? "under rescheduling" :"scheduled" 
    },
    {
      label: 'Decline', value: "cancelled"
    }
  ]
  
  const cancelreasons = [
    {
      label: 'Emergency', value: "emergency"
    },
    {
      label: 'Others', value: "others"
    }
  ]
  const handledropdown = async (value) => {
    console.log("valu::::::::::::", value.value)
    setModaldrop(value.value)
    let data = updateData;
    console.log(updateData, "ttttt")
    if (value.value === 'scheduled' || value.value === "under rescheduling") {
      data['status'] = (value.value === 'under rescheduling') ? "rescheduled" : "scheduled"; //status check
      const updateSchedule = await apiRequest(`api/batches/schedules/${uniqueScheduleId}`, 'PUT', data);
      if (updateSchedule?.status === "success") {
        setStatusModal({ open: false, modaldata: null })
        getSchedulesByuserId(data.trainer_id)
        toast.success("Schedule updated successfully")

      } else {
        toast.error(updateSchedule?.message)
        setStatusModal({ open: false, modaldata: null })
        getSchedulesByuserId(data.trainer_id)
      }
    }
  };


  const OnsubmitReject = async (values, event) => {
    event.preventDefault();
    //const data = values;
    console.log("valuesssssssssssssssssyy", updateData)
    values['reason'] = values['reason'].value;
    let data = updateData;
    data['status'] = 'declined'
    data['reason_for_cancellation'] = `${values['reason']}-${values['message']}`;
    const updateSchedule = await apiRequest(`api/batches/schedules/${uniqueScheduleId}`, 'PUT', data);
    if (updateSchedule?.status === "success") {
      setStatusModal({ open: false, modaldata: null })
      getSchedulesByuserId(data.trainer_id)
      toast.success("Schedule declined successfully")
      setModaldrop("")

    } else {
      toast.error(updateSchedule?.message)
      setStatusModal({ open: false, modaldata: null })
      getSchedulesByuserId(data.trainer_id)
    }
  };
  const cancelform = () => {
    setModaldrop("")
  }
  const closeModal = () => {
    reset();
    setModaldrop("")
    setStatusModal({ open: false });
  };
  const onDayRender = (day) => {
    if (day.events.length > 0) {
      this.calendar.scrollToEvent(day.events[0]);
    } else {
      // this.calendar.scrollToDate(moment('2023-05-30'));
      this.calendar.scrollToDate(moment(new Date()));
    }
  };
  return (
    <section className="bg-image">
      <Container className='px-xl-5'>
        <Row className="px-0 mt-4">
          <Col lg={9} md={12} className='px-xl-0'>
            <h4 className="fw-bold">Schedule</h4>
          </Col>
        </Row>
        <Row>
          {/* <Col xl={3}>
            <Box className="sticky-wrapper" style={{ marginTop: '25px' }}>
              {(auth?.user?.role?.[0]?.["name"] === "Trainer") ? (
                <QuickLinksTrainer />
              ) : (
                <QuickLinksLearner />
              )}
            </Box>
          </Col> */}
          <Col xl={12} className="px-0">
            <Box className="position-relative">
              <CardBox className="card  border-darkblue mt-4 py-5 calendar-card-trainer">
                <Box>
                  <FullCalendar
                    viewClassNames={"trainer-view"}
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={calendarView}
                    fixedWeekCount={false}
                    contentHeight="auto"
                    contentWidth="auto"
                    customButtons={{
                      filter: {
                        text: <Form.Select aria-label="Default select example"
                          value={calendarView}
                          onChange={(e) => { changeCalendarView(e?.currentTarget?.value) }}>
                          <option value='dayGridMonth'>Month</option>
                          <option value='timeGridWeek'>Week</option>
                          <option value="timeGridDay">Day</option>
                        </Form.Select>
                      }
                    }}
                    dayMaxEvents={2}
                    eventLimitText={function (eventCnt) {
                      return `+${eventCnt} more`;
                    }}
                    headerToolbar={{
                      start: '',
                      center: '',
                      end: 'prev title next filter',
                    }}
                    events={scheduleEvents}
                    editable={true}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    allDaySlot={false}
                    onDayRender={onDayRender}
                  />
                </Box>
              </CardBox>
              <Modal
                show={`${statusModal.open ? "show" : ""}`}
                dialogClassName='status-modal'
                size={`${modaldrop !== 'cancelled' ? 'sm' : 'md'}`}
                contentClassName='status-modal-content'
                className="trainer-calendar-modal"
                onHide={closeModal}
              >

                <Box>
                  <Box className="px-4 py-3" style={{ backgroundColor: "#e4d1e3" }}>
                    <h6 style={{ color: "#4e8399", fontsize: "medium", fontWeight: "600" }}>My Schedule</h6>
                    <h4 className="mb-1 fw-bold">{statusModal?.modaldata?.title ? toTitleCase(statusModal?.modaldata?.title) : "events"}</h4>
                    <p style={{ fontSize: "small", fontWeight: "500" }} className="text-black" >{statusModal?.modaldata?.timings}</p>
                    {modaldrop !== 'Rejected' && (auth?.user?.role?.[0]?.['name'] !== "Learner") && (
                      <Box className="d-flex gap-4 mt-3">
                        <ButtonComponent name="JOIN" variant="primary" className="event-join-trainer"
                          disabled={!(statusModal?.modaldata?.status === 'scheduled' || statusModal?.modaldata?.status === 'rescheduled')} />
                        <Select
                          placeholder={(eventstatus === 'accepted' && eventstatus === 'declined') ? eventstatus : 'Respond'}
                          options={modaldropdowndata.filter((e) => e.value)}
                          onChange={handledropdown}
                          value={modaldropdowndata.find(item => item.value === modaldrop)}
                          // getOptionLabel={(option) => option.label}
                          // getOptionValue={(option) => option.value}
                          styles={{
                            indicatorSeparator: (styles) => ({ display: 'none' }),
                            control: (styles) => ({ ...styles, borderRadius: "10px", border: "none", color: "#000" })
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box className="px-3 mt-3">
                    {modaldrop == 'cancelled' ? (
                      <Form onSubmit={handleSubmit(OnsubmitReject)}>
                        <Row className='pl-2 d-flex align-items-center'>
                          <Col lg="4" className="labelName px-0">
                            <Form.Label className='reason-form-txt'>Reason for Cancellation &nbsp; :</Form.Label>
                          </Col>
                          <Col lg="7" >
                            <Form.Group controlId="reason">
                              <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    placeholder="Choose Your Reason"
                                    options={cancelreasons}
                                    styles={{
                                      indicatorSeparator: (styles) => ({ display: 'none' }), //  >= dialog's z-index
                                      control: (styles) => ({ ...styles, borderRadius: "10px", fontSize: "smaller", borderColor: "#3b4c99", boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' })
                                    }}
                                  />
                                )}
                              />
                              <p className='invalid-feedback'>{errors.reason?.message || errors.reason?.label.message}</p>
                            </Form.Group>
                          </Col>

                        </Row>
                        <Form.Group controlId="formfirstname" className="mt-3">
                          <Row className='pl-2'>
                            <Col lg={4} className="px-0"><Form.Label className="reason-form-txt">Your Message &nbsp; :</Form.Label></Col>
                            <Col lg={7}> <Form.Control as="textarea" rows={4} name="message" {...register('message')} style={{ borderRadius: "10px", borderColor: "#3b4c99", boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }} />
                              <p className='invalid-feedback'>{errors?.message?.message}</p>
                            </Col>

                          </Row>

                        </Form.Group>
                        <Row className="mt-4 mb-3 pl-2">
                          <Col lg={4} className="px-0"></Col>
                          <Col lg={7}>
                            <Box className="d-flex justify-content-between">
                              <ButtonComponent name="Cancel" variant="outline-dark border-2" className="calmodel-btn-cancel" type="button" onClick={cancelform} />
                              <ButtonComponent name="Save" className="calmodel-btn-save" type="submit" />
                            </Box>
                          </Col>
                        </Row>
                      </Form>
                    ) :
                      <ListGroup variant="flush">
                        <ListGroup.Item className="px-1">
                          <LocationIcon />
                          <Span className="ms-3 list-card-txt">Online meeting</Span>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-1">
                          <ChatIcon />
                          <Span className="ms-3 list-card-txt">Chat with participants</Span>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-1 d-flex">
                          <Span>
                            <PersonIcon />
                          </Span>
                          <Span style={{ display: "flex", flexDirection: "column" }}>
                            <Span className="ms-3 list-card-txt">{(statusModal?.modaldata?.trainer)} </Span>
                            <Span className="ms-3" style={{ fontSize: "xx-small", color: "#d0cece" }}>Organizer</Span>
                          </Span>
                        </ListGroup.Item>
                      </ListGroup>}
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Col>
        </Row>
      </Container >
    </section >
  );
}
export default TrainerCalender;
