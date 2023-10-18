import './Fullcalender.css';
import React, { useRef, useState, useEffect } from 'react';
import { Form, Row, Col, Modal, ButtonToolbar, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { CardBox, Box, DeleteModal, AddScheduleDatePickerIcon } from '@athena/web-shared/ui';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import FullCalendar, { computeSegStartResizable } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import TimePicker from 'react-time-picker-input';
import 'react-time-picker-input/dist/components/TimeInput.css';
import Select, { components } from 'react-select';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { getCircleRadius, useRouter, apiRequest } from '@athena/web-shared/utils';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export function Fullcalender(props) {

  const router = useRouter();
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedBatchDateRange, setSelectedBatchDateRange] = useState({});
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedchapter, setSelectedChapter] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [time_start, setTimeStart] = useState('09:00');
  const [time_end, setTimeEnd] = useState('18:00');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatchCourses, setSelectedBatchCourses] = useState([]);
  const [courseDetails, setAllCourseDetails] = useState([]);
  const [selectedCourseTopics, setSelectedCourseTopics] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [learners, setLearners] = useState([]);
  const [calendarView, setCalendarView] = useState('dayGridMonth');
  const [editSchedule, setEditSchedule] = useState(false);
  const [editScheduleTopicId, setEditScheduleTopicId] = useState(null);
  const [editscheduleCourseId, setEditScheduleCourseId] = useState(null);
  const [uniqueScheduleId, setUniqueScheduleId] = useState(null);
  const [uniqueScheduleTime, setUniqueScheduleTime] = useState({});
  const [disableHours, setTimePickerDisabledHours] = useState([])
  const [show, setShow] = useState(false)
  const [allCourses, setAllCourses] = useState([]);
  const [allTopicsOfSpecifiedCourse, setAllTopicsOfSpecifiedCourse] = useState([]);
  const [checkStatus, setCheckStatus] = useState('')

  const presentDay = new Date();

  const createScheduleSchema = yup.object().shape({
    course: yup.string().required('Please select a course'),
    //.matches(/^[a-zA-Z\s]{3,255}$/, 'invalid Topic Name'),

    topic: yup.string().required('Please select a topic'),
    // .max(500, 'Description should be max 500 charachers')
    // .required('Description is required'),
    // .matches(/^[a-zA-Z\s]{3,500}$/, 'invalid description'),
    trainer: yup.string().required('Please select a trainer'),
    date: yup.date(),
    time_start: yup.string()
      .test(
        'start-time-validation',
        'Start time should not be less than current time',
        function (value) {
          if (!value) {
            return true; // Don't run validation if value is empty
          }

          const timeFormat = 'HH:mm'; // Adjust format if necessary
          const startTime = moment(value, timeFormat);
          const currentDate = moment().startOf('day'); // Get the current date at the start of the day
          // const selectedDate = moment(this.parent.date); // Get the selected date from the date field (replace 'date' with the actual name of your date field)
          const selectedDate = moment(new Date(this.parent.date));
          if (!selectedDate.isSame(currentDate, 'day')) {
            return true; // Return true if the selected date is not the same as the current day
          }

          return startTime.isAfter(moment()); // Check if start time is after the current time
        }
      ),
    time_end: yup.string()
      .test(
        'end-time-validation',
        'End time should not be less than start time',
        function (value) {
          if (!value) {
            return true; // Don't run validation if value is empty
          }

          const timeFormat = 'HH:mm'; // Adjust format if necessary
          if (!moment(value, timeFormat, true).isValid()) {
            return false;
          }
          const endTime = moment(value, timeFormat);
          const startTime = moment(this.parent.time_start, timeFormat);

          return endTime.isAfter(startTime); // Check if end time is after start time
        }
      ),

  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    getValues,
    control,
  } = useForm({ resolver: yupResolver(createScheduleSchema) });

  useEffect(() => {
    console.log('@@@@@@@@@@', getValues());
  });

  const changeCalendarView = (view) => {
    setCalendarView(view);
    setTimeout(() => {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view); // the actual view we want
    }, 100);
  };

  const onCloseForm = () => {
    setSelectedDate(null);
    setShowAddScheduleForm(false);
    reset();
    setSelectedTopic(null);
    setSelectedCourse(null);
    setSelectedTrainer(null);
    setSelectedChapter(null);
    setEditScheduleTopicId(null);
    setEditScheduleCourseId(null);
    setUniqueScheduleId(null);
    setUniqueScheduleTime({})
    setEditSchedule(false);
    //setSelectedBatchCourses([])
    setSelectedCourseTopics([])
    setTimeStart('09:00');
    setTimeEnd('18:00');
  };

  const onCloseSchedule = () => {
    onCloseForm()
    setShowAddScheduleForm(false);
  }

  const getCoursesWithBatch = async (id) => {
    if (id) {
      const batchdetails = await apiRequest(`api/batches/batches/getBatch/${id}`);
      console.log('batchdetails', batchdetails);

      setLearners(
        batchdetails?.value?.batchData?.batch_learners?.map((x) => x.id)
      );
      const courses = batchdetails?.value?.batchData?.user_tracks?.flatMap(track => {
        if (track.course_summary_data.children.length === 0) {
          // If track doesn't have children, it is a course itself
          return [track.course_summary_data];
        } else {
          // If track has children, access the courses within it
          return track.course_summary_data.children;
        }
      });

      const courses1 = batchdetails?.value?.batchData?.assigned_tracks?.flatMap(track => {
        if (track?.children.length === 0) {
          // If track doesn't have children, it is a course itself
          return [track];
        } else {
          // If track has children, access the courses within it
          return track?.children;
        }
      });


      setAllCourseDetails(
        courses
      );

      setSelectedBatchCourses(courses);
    }
  };
  const getSchedulesByBatchId = async (batch_id) => {

    let scheduledetails;
    if (batch_id) {
      console.log('?????????????????????', `api/batches/schedules/batch/${batch_id}`);
      scheduledetails = await apiRequest(
        `api/batches/schedules/batch/${batch_id}`
      );
    } else {
      scheduledetails = await apiRequest(
        `api/batches/schedules`
      );
    }
    console.log('?????????????????????', scheduledetails);

    let events = scheduledetails?.value?.scheduleData?.map((x) => {
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
        trainer_name: `${x.trainers?.first_name ?? null} ${x.trainers?.last_name ?? null}`,
        declined_at: x.declined_at,
        accepted_at: x.accepted_at,
        reason_for_cancelling: x.reason_for_cancellation

      };
    });
    console.log("batchdeta", events)
    setScheduleEvents(events);
  };

  // useEffect(() => {
  //   // convert duration to hours and minutes
  //   console.log("//////useEffect", selectedTopic?.duration, time_start)
  //   let duration = selectedTopic?.duration;
  //   let start_time = time_start;
  //   const hours = Math.floor(duration / 60);
  //   const minutes = duration % 60;

  //   // parse start_time to get hours and minutes
  //   const [startHours, startMinutes] = start_time.split(':').map(Number);

  //   // add hours and minutes to start_time
  //   const endHours =
  //     startHours + hours + Math.floor((startMinutes + minutes) / 60);
  //   const endMinutes = (startMinutes + minutes) % 60;



  //   // format end_time as a string
  //   const formattedEndTime = `${endHours
  //     .toString()
  //     .padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  //     console.log("formattedEndTime:::::::::::",formattedEndTime)
  //   setTimeEnd(formattedEndTime);
  // }, [time_start, selectedTopic]);

  const getBatches = async (x) => {
    const batchdetails = await apiRequest(`api/batches/batches/`);
    setBatchData(batchdetails?.value?.batchData);
  };






  const getTopicsWithCourse = async (id) => {
    // Assuming you have the courses array and scheduled topics array
    const coursesArray = courseDetails; // Your array of courses
    const scheduledTopicsArray = scheduleEvents; // Your array of scheduled topics
    const courseId = id; // Replace this with the specific course_id you have

    // Helper function to flatten the courses and chapters and retrieve all topics
    const getAllTopicsFromCourses = (courses, parentChapterId = null) => {
      return courses.flatMap((course) => {
        if (course.children && course.children.length > 0) {
          // If the course has children, recursively flatten and get topics from children
          return [
            ...getAllTopicsFromCourses(course.children),
            ...course.chapters.flatMap((chapter) => getAllTopicsFromCourses([chapter], chapter.id)),
          ];
        } else {
          // If the course has direct chapters, get topics directly
          return course.chapters.flatMap((chapter) =>
            chapter.topics.map((topic) => ({ ...topic, chapter_id: chapter.id, course_id: course.id }))
          );
        }
      });
    };

    // Find the specific course based on the course_id
    const specificCourse = coursesArray.find((course) => Number(course.id) === Number(courseId));

    if (specificCourse) {
      // Get all the topics from the specific course, including those from children courses
      const allTopics = getAllTopicsFromCourses([specificCourse]);
      setAllTopicsOfSpecifiedCourse(allTopics)
      // Filter out the topics that are not present in the scheduled topics array
      // const topicsNotScheduled = allTopics.filter(
      //   (topic) => !scheduledTopicsArray.some((scheduledTopic) => Number(scheduledTopic.topic_id) === Number(topic.id) && scheduledTopic.status === 'cancelled')
      // );

      const topicsNotScheduled = allTopics?.filter((topic) => {
        const isScheduled = scheduledTopicsArray?.some((scheduledTopic) => Number(scheduledTopic.topic_id) === Number(topic.id));
        const isCancelled = scheduledTopicsArray?.some((scheduledTopic) => Number(scheduledTopic.topic_id) === Number(topic.id) && scheduledTopic.status === "cancelled");
        return !isScheduled || isCancelled;
      });

      setSelectedCourseTopics(topicsNotScheduled);
    } else {
      setSelectedTopic(null);
      setSelectedCourseTopics([]);
    }


  }

  const getTrainers = async () => {
    let trainers = await apiRequest(`api/users/getAllTrainers`);
    setTrainers(trainers?.value);
  };


  useEffect(() => {
    if (!props?.fromDashboard) {
      getBatches();
      getTrainers();
    } else {
      getSchedulesByBatchId()
    }
  }, []);

  const handleBatchChange = (selectedOption) => {
    // let calendarApi = calendarRef.current.getApi();
    console.log('/////////', selectedOption);
    setSelectedBatch(selectedOption);
    if (selectedOption == null) {
      setSelectedBatchDateRange({ start: null, end: null });
      setTimeout(() => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(new Date());
      }, 100);

      setScheduleEvents([]);
    } else {
      console.log('/////////', selectedOption.started_at);
      //let daterange2 = { start: new Date(selectedOption['started_at']).toISOString(), end: new Date(selectedOption['end_at']) ?? new Date() }
      let daterange2 = {};
      daterange2 = { start: new Date(selectedOption.started_at), end: null };
      setTimeout(() => {
        let calendarApi = calendarRef.current.getApi();
        // calendarApi.gotoDate(new Date(selectedOption.started_at));
        calendarApi.gotoDate(new Date());
      }, 100);
      setSelectedBatchDateRange(daterange2);
      getCoursesWithBatch(selectedOption?.id);
      getSchedulesByBatchId(selectedOption?.id);
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('wwwwwwwwwwww', getValues(), selectedBatch, editSchedule, uniqueScheduleId,);
      console.log("scheduleEvents:::::::::::::", selectedTopic.title, learners, selectedTrainer.name, selectedBatch.name)
      let data = {};
      let date =
        getValues('date') === undefined
          ? moment(new Date(selectedDate)).format('YYYY-MM-DD')
          : moment(new Date(getValues('date'))).format('YYYY-MM-DD');
      let stime = getValues('time_start');
      let etime = getValues('time_end');
      console.log('timeeeeeeeeeeeeeeeee', date, stime, etime);
      data['topic_id'] = Number(selectedTopic.id);
      data['chapter_id'] = Number(selectedchapter);
      data['track_id'] = Number(selectedCourse.id);
      data['learner_id'] = learners;
      data['batch_id'] = Number(selectedBatch.id);
      data['trainer_id'] = Number(selectedTrainer.id);
      // console.log("qqqqqqqqqqqqqqqqqqqq", date, stime, etime);
      data['start_at'] = moment(new Date(`${date} ${stime}`)).format('YYYY-MM-DD HH:mm');
      data['end_at'] = moment(new Date(`${date} ${etime}`)).format('YYYY-MM-DD HH:mm');
      data['trainer_name'] = selectedTrainer.name;
      data['batch_name'] = selectedBatch.name;
      data['topic_name'] = selectedTopic.title;



      console.log('inputtttttttttttt', data, checkStatus);
      let route, method;
      if (editSchedule) {
        data['status'] = (checkStatus == 'scheduled' || checkStatus == 'under rescheduling') ? "under rescheduling" :
          checkStatus == 'rescheduled' ? "under rescheduling" : 'pending';

        //data['status'] = 'rescheduled'
        route = `api/batches/schedules/${uniqueScheduleId}`;
        method = 'PUT';
      } else {
        route = `api/batches/schedules`;
        method = 'POST';
      }
      const createSchedule = await apiRequest(route, method, data);
      if (createSchedule?.status === 'success') {
        console.log('////////////////////', createSchedule);
        if (editSchedule) {
          toast.success('Schedule updated successfully');
        } else {
          toast.success('Schedule created successfully');
        }
      } else {
        toast.error(createSchedule?.message);
      }
      getSchedulesByBatchId(selectedBatch.id);
      onCloseForm();
      console.log('dfdfdfdfdfdfdfddf', date, stime, etime, data);
      setIsLoading(false);
    } catch (err) {
      toast.error('Something went wrong, please try again later');
      onCloseForm();
    }

  };
  // const handleDateClick = (info) => {
  //   console.log('swsw', info);
  //   setSelectedDate(null);
  //   if (selectedBatch) {
  //     setSelectedDate(info.date);
  //     setValue('date', info.date);
  //     setShowAddScheduleForm(true);
  //     setTimeStart('09:00');
  //     setTimeEnd('18:00');
  //   } else {
  //     if (!props?.fromDashboard) {
  //       toast.error('Please select a batch first');
  //     }
  //   }
  // };

  const handleDateClick = (info) => {
    const selectedDatee = new Date(info.dateStr);
    const today = new Date();
    console.log('fffffff', selectedDatee);

    // Remove the time portion from the dates for accurate comparison
    selectedDatee.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (selectedDatee < today) {
      if (!props?.fromDashboard) {
        toast.warn("Schedule can't be created for past days!");
      } else if (selectedDate.getTime() === today?.getTime()) {
        const currentTime = new Date().getTime();
        const selectedTime = selectedDate.getTime();

        if (selectedTime < currentTime) {
          toast.warn("Schedule can't be created for past times!");
        }
      }
    } else {
      setSelectedDate(null);
      if (selectedBatch) {
        setSelectedDate(info.date);
        setValue('date', info.date);
        setShowAddScheduleForm(true);
        setTimeStart('09:00');
        setTimeEnd('18:00');
      } else {
        if (!props?.fromDashboard) {
          toast.error('Please select a batch first');
        }
      }
    }
  };


  //on click the schedule the pop will open component
  const handleEventClick = (arg) => {


    if (!props?.fromDashboard) {
      if (arg.event._def.extendedProps.status === 'cancelled') {
        // Prevent event click when status is "cancelled"
        arg.jsEvent.preventDefault();
        return;
      }
      setEditSchedule(true);
      console.log(
        'pppppp////////////////',
        arg.event.title,
        arg.event.start,
        arg.event.end,
      );
      console.log('//pppppppppppppppp', arg.event._def.extendedProps);
      const temp = arg.event._def.extendedProps;
      setValue('trainer', temp.trainer_name);
      setValue('topic', arg.event.title);
      setValue('course', temp.course);
      setEditScheduleTopicId(temp.topic_id);
      setEditScheduleCourseId(temp.course_id);
      setSelectedCourse({ id: temp.course_id, slug: temp.course });
      setSelectedTopic({ id: temp.topic_id, title: arg.event.title });
      setSelectedChapter(temp.chapter_id);
      setUniqueScheduleId(temp.unique_id);
      setSelectedTrainer(trainers?.filter((x) => Number(x.id) === Number(temp.trainer_id))[0]);
      const date = new Date(arg.event.start);
      const enddate = new Date(arg.event.end);
      setSelectedDate(new Date(arg.event.start));
      setValue('date', new Date(arg.event.start));
      let hours = String(date.getHours()).padStart(2, '0');
      let minutes = String(date.getMinutes()).padStart(2, '0');
      let formattedTime = `${hours}:${minutes}`;
      setTimeStart(formattedTime);
      hours = String(enddate.getHours()).padStart(2, '0');
      minutes = String(enddate.getMinutes()).padStart(2, '0');
      formattedTime = `${hours}:${minutes}`;
      setTimeEnd(formattedTime);
      console.log(" enddate::: ", formattedTime)
      setShowAddScheduleForm(true);


    }
  };
  useEffect(() => {
    // This code runs after the state has been updated
    getTopicsWithCourse(editscheduleCourseId);
  }, [editSchedule, editScheduleTopicId, editscheduleCourseId]);

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
      textcolor: '#EAB0FA',
      backgroundColor: '#FFC83B40',
    },
    rescheduled: {
      textcolor: '#D664F5',
      backgroundColor: 'rgba(225, 170, 240, 0.34)',
    },
    declined: {
      textcolor: '#FF3838',
      backgroundColor: 'rgba(255, 56, 56, 0.25)',
    },
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

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
        return '#00FFFF';
      default:
        return '#000000';
    }
  };

  const renderEventContent = (eventInfo) => {
    const titlecount = !props.fromDashboard ? 20 : 13;
    const coursecount = 10;

    const title =
      eventInfo.event.title.length > titlecount
        ? eventInfo.event.title.slice(0, titlecount) + '...'
        : eventInfo.event.title;
    const course =
      eventInfo?.event?.extendedProps?.course?.length > coursecount
        ? eventInfo.event.extendedProps.course.slice(0, coursecount) + '...'
        : eventInfo.event.extendedProps.course;
    const { start, end } = eventInfo.event;
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    let status = eventInfo.event.extendedProps.status;
    console.log("status121331313", status)
    let accepted_at = eventInfo.event.extendedProps.accepted_at;
    let declined_at = eventInfo.event.extendedProps.declined_at;
    setCheckStatus(status)
    if (status === 'under rescheduling') {
      if ((accepted_at && declined_at) ? accepted_at > declined_at : true) {
        status = 'under rescheduling'
      }
    }
    console.log('br', status);

    return (

      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip('Reason for cancellation')}>
        <Box
          className="event-box w-100 h-100 position-relative"
          style={{
            backgroundColor: stylee[status]?.backgroundColor,
            borderLeft: `5px solid ${stylee[status]?.textcolor}`,
          }}
        >
          {!props.fromDashboard ?
            (<h6
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
            </h6>) : (
              <h6
                className="d-flex justify-content-end"
                style={{
                  fontSize: '9px',
                  position: 'absolute',
                  top: -14,
                  right: 13,
                  left: 13,
                  backgroundColor: getStatusColor(status),
                  color: '#fff',
                  padding: '2px 13px',
                  borderRadius: '7px',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }}
              >
                {toTitleCase(status.slice(0, 5) + '...')}
              </h6>)}


          <Box className="pl-2 py-2 ">
            <Box className="d-flex align-items-center justify-content-betwee">
              <h5 style={{ color: '#000', fontSize: '10px', textDecoration: (status === "cancelled") ? 'line-through' : 'none' }}>{toTitleCase(title)}</h5>

            </Box>

            <Box className="d-flex align-items-center justify-content-between mr-1 mb-1">
              <h6 className="mb-0" style={{ color: stylee[status]?.textcolor, fontSize: '8px' }}>
                {toTitleCase(course)}
              </h6>
              {!props.fromDashboard && (
                <h6 className="d-flex justify-content-end mb-0" style={{ color: '#000', fontSize: '8px' }}>
                  {startTime}-{endTime}
                </h6>
              )}
            </Box>

          </Box>

        </Box>
      </OverlayTrigger >
    );
  };

  const renderTooltip = (name) => (
    <Tooltip id="status-tooltip">{name}</Tooltip>
  );

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const plusButtonHtml =
      '<div class="fc-daygrid-day-button"><span class="fc-daygrid-day-button-inner">+</span></div>';

    calendarApi.on('dayMouseEnter', (arg) => {
      const cell = arg.dayEl;
      cell.insertAdjacentHTML('beforeend', plusButtonHtml);
    });

    calendarApi.on('dayMouseLeave', (arg) => {
      const cell = arg.dayEl;
      const plusButton = cell.querySelector('.fc-daygrid-day-button');
      plusButton.remove();
    });
  }, []);


  const handleCancel = async () => {
    let data = {}
    data['status'] = 'cancelled'
    data['topic_id'] = Number(selectedTopic.id);
    data['chapter_id'] = Number(selectedchapter);
    data['track_id'] = Number(selectedCourse.id);
    data['learner_id'] = learners;
    data['batch_id'] = Number(selectedBatch.id);
    data['trainer_id'] = Number(selectedTrainer.id);
    data['topic_name'] = selectedTopic.title
    data['batch_name'] = selectedBatch.name
    data['trainer_name'] = selectedTrainer.name
    let date =
      getValues('date') === undefined
        ? moment(new Date(selectedDate)).format('YYYY-MM-DD')
        : moment(new Date(getValues('date'))).format('YYYY-MM-DD');
    let stime = getValues('time_start');
    let etime = getValues('time_end');
    data['start_at'] = moment(new Date(`${date} ${stime}`)).format('YYYY-MM-DD HH:mm');
    data['end_at'] = moment(new Date(`${date} ${etime}`)).format('YYYY-MM-DD HH:mm');
    console.log("date:6646646", data)
    const cancelScheduleResponse = await apiRequest(
      `api/batches/schedules/${uniqueScheduleId}`,
      'PUT',
      data
    );
    if (cancelScheduleResponse) {
      setShow(false);
      toast.success('You have successfully cancelled');
      getSchedulesByBatchId(selectedBatch.id);
    }
    onCloseForm();
  }

  const onDayRender = (day) => {
    if (day.events.length > 0) {
      this.calendar.scrollToEvent(day.events[0]);
    } else {
      this.calendar.scrollToDate(moment('2023-05-30'));
    }
  };


  return (
    <section className="bg-image">
      {/* <Container> */}
      {!props?.fromDashboard && <div className="empty-space"></div>}
      <Row>
        <Col lg="12" md="8">
          {!props?.fromDashboard && (
            <Col lg="4" md="6">
              <Select
                className="batch-select"
                placeholder="Select batch"
                value={selectedBatch}
                options={batchData}
                onChange={handleBatchChange}
                isClearable={true}
                closeMenuOnSelect={true}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                // menuPortalTarget={document.body}
                styles={{

                  menu: (state) => ({
                    ...state,
                    zIndex: 99
                  }),
                }}
              />
            </Col>
          )}

          <Col>
            <Box
              className={
                props?.fromDashboard
                  ? 'position-relative calendar-start'
                  : 'position-relative calendar-start mt-5'
              }
            >
              <Box>
                <CardBox
                  className={
                    props?.fromDashboard
                      ? 'border-darkblue py-0 calendar-card-admin'
                      : 'border-darkblue mt-4 py-0 calendar-card-admin'
                  }
                >
                  <Box>
                    <div
                      className={
                        location.pathname != '/app/dashboard'
                          ? `Ap`
                          : 'titleclass'
                      }
                    >
                      <FullCalendar
                        // viewClassNames={'admin-view'}
                        // className={'my-calendar'}
                        height={props?.fromDashboard && 320}
                        ref={calendarRef}
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        // dayCellContent={props?.fromDashboard &&( () => '')}
                        selectable={true}
                        // validRange={selectedBatchDateRange}
                        // select={(info) => {
                        //   handleDateClick(info)
                        // }}
                        //weekends={false}
                        initialView={calendarView}
                        headerToolbar={{
                          start: 'heading',
                          center: '',
                          end: 'prev title next filter ',
                        }}
                        customButtons={{
                          heading: {
                            text: props?.fromDashboard && (
                              <h5 style={{ color: '#212121' }}>Schedule</h5>
                            ),
                          },
                          filter: {
                            text: (
                              <Form.Select
                                aria-label="Default select example"
                                value={calendarView}
                                onChange={(e) => {
                                  changeCalendarView(e?.currentTarget?.value);
                                }}
                              >
                                <option value="dayGridMonth">Month</option>
                                <option value="timeGridWeek">Week</option>
                                <option value="timeGridDay">Day</option>
                              </Form.Select>
                            ),
                          },
                        }}
                        dayMaxEvents={2} // set maximum number of events per day to 3
                        eventLimitText={function (eventCnt) {
                          return `+${eventCnt} more`;
                        }}
                        eventLimitClick="popover"
                        dateClick={handleDateClick}
                        editable={true}
                        events={scheduleEvents}
                        allDaySlot={false}
                        eventClick={handleEventClick}
                        eventContent={renderEventContent}
                        onDayRender={onDayRender}
                      />
                    </div>
                  </Box>
                </CardBox>
              </Box>
            </Box>
          </Col>
        </Col>
      </Row>
      {/* </Container> */}

      <Modal
        show={`${showAddScheduleForm ? 'show fade' : ''}`}
        // show={true}
        className="admin-schedule-modal"
        onHide={onCloseForm}
        backdrop="static"
        animation={true}
      // fullscreen={true}
      >
        <Modal.Body>
          <h3 className="linetextschedule">SCHEDULE</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="mb-3 mt-4">
              <Col lg={3}>
                <Form.Label className="mt-2">Course</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Group controlId="course">
                  <Select
                    options={selectedBatchCourses}
                    onChange={(selected) => {
                      console.log("///////////////////hello", selected)
                      setSelectedTopic(null)
                      setSelectedCourse(selected);
                      getTopicsWithCourse(selected?.id);
                      setValue('course', selected?.slug);
                    }}
                    value={selectedCourse}
                    isClearable={true}
                    getOptionLabel={(option) => option.slug}
                    getOptionValue={(option) => option.id}
                    placeholder="Please select"
                  />
                  {selectedCourse == null && (
                    <p className="invalid-feedback">{errors.course?.message}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label className="mt-2">Topic</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Group controlId="topic">
                  <Select
                    options={selectedCourseTopics}
                    onChange={(selected) => {
                      setSelectedTopic(selected);
                      setSelectedChapter(selected?.chapter_id);
                      setValue('topic', selected?.title);
                      if (selected === null) {
                        // setTimeEnd("18:00")
                        //setEditScheduleTopicId(null)
                        // setEditSchedule(false)
                        setSelectedCourseTopics()
                      }
                    }}
                    value={selectedTopic}
                    isClearable={true}
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                  //{...register('topic', { required: true })}
                  />
                  {selectedTopic == null && (
                    <p className="invalid-feedback">{errors.topic?.message}</p>
                  )}
                  {selectedCourse && !selectedTopic && selectedCourseTopics?.length == 0 && (
                    <p className="invalid-feedback">{'All the topics under selected course are scheduled'}</p>
                  )}

                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label className="mt-2">Trainer</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Group controlId="trainer">
                  <Select
                    name="trainer"
                    options={trainers}
                    onChange={(selected) => {
                      setSelectedTrainer(selected);
                      setValue(
                        'trainer',
                        `${selected?.first_name} ${selected?.last_name}`
                      );
                      if (selected === null) {
                        setSelectedTrainer(null);
                      }
                    }}
                    value={selectedTrainer}
                    isClearable={true}
                    getOptionLabel={(option) => {
                      return (
                        `${toTitleCase(option?.first_name)} ${toTitleCase(
                          option?.last_name
                        )}` ?? null
                      );
                    }}
                    getOptionValue={(option) => option.id}

                  //{...register('trainer', { required: true })}
                  />
                  {selectedTrainer == null && (
                    <p className="invalid-feedback">
                      {errors.trainer?.message}
                    </p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label className="mt-2">Date</Form.Label>
              </Col>
              <Col lg={9}>
                <Form.Group controlId="date">
                  <Controller
                    control={control}
                    name="date"
                    render={() => (
                      <>
                        <DatePicker
                          selected={selectedDate}
                          value={new Date(selectedDate)}
                          minDate={presentDay}
                          // minDate={subtractFromDate(new Date(), { years: 60 })}
                          // maxDate={subtractFromDate(new Date(), { years: 18 })}
                          //className="form-control"
                          onChange={(date) => {
                            console.log(
                              'zzz',
                              moment(date).format('YYYY-MM-DD')
                            );
                            if (isSameDay(date, new Date())) {
                              const currentTime = new Date();
                              const currentHour = currentTime.getHours();
                              // Disable hours before the current hour
                              const disabledHours = Array.from(
                                { length: currentHour },
                                (_, index) => index
                              );
                              // Update the time picker with disabled hours
                              setTimePickerDisabledHours(disabledHours);
                            } else {
                              setTimePickerDisabledHours([]);
                            }
                            setSelectedDate(date);
                            setValue('date', date);
                            setValue('date', moment(date).format('YYYY-MM-DD'));
                          }}
                          dateFormat="yyyy/MM/dd"
                          yearDropdownItemNumber={100}
                          scrollableYearDropdown={true}
                          showYearDropdown
                          showMonthDropdown
                          showPopperArrow={false}
                          customInput={
                            <div className="input-group">
                              <Form.Control
                                type="text"
                                value={moment(selectedDate).format(
                                  'YYYY/MM/DD'
                                )}
                                readOnly
                                style={{ backgroundColor: 'white' }}
                              />
                              <div className="input-group-append">
                                <span
                                  className="input-group-text"
                                  style={{ backgroundColor: 'white' }}
                                >
                                  <AddScheduleDatePickerIcon />
                                </span>
                              </div>
                            </div>
                          }
                        />
                      </>
                    )}
                  />

                  {/* {errors.date && <span className="text-danger">Date is required</span>} */}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <Form.Label className="mt-2">Time</Form.Label>
              </Col>
              <Col lg={9} className="d-flex gap-2">
                {/* <Row>
                <Col lg={5}> */}
                <Form.Group controlId="fromTime">
                  <Controller
                    control={control}
                    name="fromTime"
                    render={() => (
                      <div className="time_start">
                        <TimePicker
                          hour12Format
                          value={time_start}
                          eachInputDropdown
                          // fullTimeDropdown
                          manuallyDisplayDropdown={true}
                          onChange={(newtime_start) => {
                            console.log('////////////345', newtime_start);
                            setValue('time_start', newtime_start);
                            setTimeStart(newtime_start);
                            console.log('gggggggggg', getValues('time_start'));
                          }}
                          allowDelete
                          disabledHours={disableHours}
                        />
                      </div>
                    )}
                  />

                  {errors.time_start && (
                    <p className="invalid-feedback">
                      {errors.time_start?.message}
                    </p>
                  )}
                </Form.Group>

                {/* </Col>

                <Col lg={1}> */}
                <p className="mt-2 px-0 text-muted">to</p>
                {/* </Col> */}
                {/* <Col lg={5} className=""> */}
                <Form.Group controlId="toTime" >
                  <Controller
                    control={control}
                    name="toTime"
                    render={() => (
                      <div className="time_end">
                        <TimePicker
                          hour12Format
                          value={time_end}
                          eachInputDropdown
                          // fullTimeDropdown
                          manuallyDisplayDropdown={true}
                          onChange={(newtime_end) => {
                            console.log('////////////123', newtime_end);
                            setValue('time_end', newtime_end);
                            setTimeEnd(newtime_end);
                            console.log('eeeeeeeee', getValues('time_end'));
                          }}
                          allowDelete
                          disabledHours={disableHours}
                        />
                      </div>
                    )}
                  />
                  {errors.time_end && (
                    <p className="invalid-feedback">
                      {errors.time_end?.message}
                    </p>
                  )}
                </Form.Group>

                {/* </Col> */}
                {/* </Row> */}
              </Col>
            </Row>
            <ButtonToolbar
              style={{ display: 'flex', justifyContent: 'end' }}
              className="gap-3"
            >
              {uniqueScheduleId && (
                <Button
                  variant="outline-primary"
                  className="rounded-5 px-4 py-2"
                  disabled={isLoading}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Cancel
                </Button>
              )}

              <Button
                variant="outline-primary"
                className="rounded-5 px-4 py-2"
                disabled={isLoading}
                onClick={onCloseSchedule}
              >
                Close
              </Button>

              <Button
                variant="primary"
                className="rounded-5 px-4 py-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Save'}
              </Button>
            </ButtonToolbar>
          </Form>
        </Modal.Body>
      </Modal>
      <DeleteModal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        deleteData="schedule"
        deleteResponse={() => {
          handleCancel();
        }}
        type='Cancel'
      />
    </section>
  );
}
export default Fullcalender;
