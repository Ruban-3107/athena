import './ManageCourses.css';
import { Box, Span, BrowseCourseCardView, ButtonComponent, SearchBar, Loader } from '@athena/web-shared/ui';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Col, Form, Row } from 'react-bootstrap';
import { apiRequest, statusTypes, useAuth, useRouter } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
export const ManageCourses = (props) => {
  const [courselist, setcourselist] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isClearable, setIsClearable] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isCheck, setIsCheck] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [disableButtonView, setDisableButtonView] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('');
  const [disableDeleteButtonView, setDisableDeleteButtonView] = useState(false);
  const [filteredCourseList, setFilteredCourseList] = useState([]);

  const router = useRouter();
  const [pending, setPending] = useState(true);
  const [userrole, setuserrole] = useState('');

  const auth = useAuth();
  useEffect(() => {
    if (auth && auth?.user) {
      setuserrole(auth.user?.role[0].name);
    }
  }, [auth.user]);

  const getCourse = async () => {
    const coursedetailsresponse = await apiRequest(`api/courses/tracks/chapters`);
    console.log('ssss', coursedetailsresponse);
    if (coursedetailsresponse?.status === 'success') {
      setcourselist(coursedetailsresponse.value);
      setPending(false);
      setFilteredCourseList(coursedetailsresponse?.value);
    } else {
      setcourselist([]);
      setPending(false);
      setFilteredCourseList([]);
    }
  };

  useEffect(() => {
    if (filterText !== '' || selectedStatus) {
      searchCourse();
    } else {
      getCourse()
    }
  }, [filterText, selectedStatus])
  useEffect(() => {
    console.log(courselist, 'ccc')
  }, [courselist])

  const searchCourse = async () => {

    let url;
    console.log(filterText, selectedStatus, filterText !== '', selectedStatus !== null)
    if (filterText !== '' && selectedStatus !== null || filterText === '' && selectedStatus !== null) {
      // data['searchkey'] = filterText;
      url = `api/courses/tracks/get/newSearchCourses/fetchCourses?searchKey=${filterText}&&status=${selectedStatus.name}`
    }
    else if (filterText !== '' && selectedStatus === null) {
      url = `api/courses/tracks/get/newSearchCourses/fetchCourses?searchKey=${filterText}`
    }
    const searchedcoursesresponse = await apiRequest(
      url,
      'GET',
      // data
    );
    const foundTracksData = searchedcoursesresponse?.value?.coursesData;
    console.log("searchedcoursesresponse::::::", searchedcoursesresponse?.value?.coursesData)
    setcourselist(searchedcoursesresponse?.value?.coursesData);
    setPending(false);
    setFilteredCourseList(searchedcoursesresponse?.value?.coursesData);
    //console.log('KAA', foundTracksData);

  };
  useEffect(() => {
    getCourse();
    setDisableButtonView(false);
    setDisableDeleteButtonView(false);
  }, []);

  const deleteCourses = async () => {
    let data = {};
    data['ids'] = isCheck;

    let deleteCoursesResponse = await apiRequest(
      'api/courses/tracks',
      'DELETE',
      data
    );

    if (deleteCoursesResponse) {
      toast.success('Courses deleted successfully');
      setIsCheck([]);
    }
    setIsCheck([]);
    getCourse();
  };

  const updateCourses = async (trackStatus) => {
    console.log('dddddddddd');

    let data = {};
    data['ids'] = isCheck;

    data['trackStatus'] = trackStatus;

    console.log(data, 'dataaa');
    let updateCoursesResponse = await apiRequest(
      'api/courses/tracks/status',
      'PUT',
      data
    );

    if (updateCoursesResponse) {
      toast.success('Courses updated successfully');
      setIsCheck([]);
    }
    setIsCheck([]);
    getCourse();
  };
  const newCourseList = courselist?.map((course) => {
    const trackChapters = course.track_chapters;
    const chaptersCount = trackChapters.length;
    const { totalDurationInMinutes, topicsCount } = trackChapters.reduce(
      (acc, trackChapter) => {
        const topics = trackChapter.chapter_topics;
        const topicsDuration = topics.reduce((durationAcc, topic) => {
          const [hours, minutes] = topic.duration.includes(':')
            ? topic.duration.split(':').map(Number)
            : [0, Number(topic.duration)];
          const totalMinutes = hours * 60 + minutes;
          return durationAcc + totalMinutes;
        }, 0);
        return {
          totalDurationInMinutes: acc.totalDurationInMinutes + topicsDuration,
          topicsCount: acc.topicsCount + topics.length,
        };
      },
      { totalDurationInMinutes: 0, topicsCount: 0 }
    );


    const totalCourseDurationHours = `${Math.floor(
      totalDurationInMinutes / 60
    )}`;
    const totalCourseDurationMins = `${Math.floor(
      totalDurationInMinutes % 60
    )}`;

    const totalCourseDuration = {
      hours: totalCourseDurationHours,
      minutes: totalCourseDurationMins,
    };

    return {
      chaptersCount,
      topicsCount,
      totalChapterDuration: `${Math.floor(totalDurationInMinutes / 60)}hrs ${totalDurationInMinutes % 60
        }mins`,
      totalCourseDuration,
      // totalCourseDurationHours,
      // totalCourseDurationMins,
      ...course,
    };
  });

  console.log('ddd', newCourseList);

  const handleStatusChange = (selected) => {
    setSelectedStatus(selected);
  };

  useEffect(() => {
    let statusfiltered = courselist?.filter((x) => isCheck.includes(x.id));
    let statuses = statusfiltered.map((x) => x.status);
    if (isCheck.length > 0) {
      let bool1 = statuses.every((val, i, arr) => val === 'Pending Approval');
      let bool2 = statuses.every((val, i, arr) => val === 'Approved');
      let bool = statuses.every((val, i, arr) => val === 'In Draft' || 'Pending Approval'
      );
      console.log("Happy", bool1);

      // If combination of courses of different statuses selected//
      let pendingAndApproved;

      // if (bool1) {
      //   setDisableButtonView(bool1);
      //   setButtonMessage('Approve');
      // } else
      if (bool2) {
        setDisableButtonView(bool2);
        setButtonMessage('Publish');
      }

      setDisableDeleteButtonView(bool);
    } else {
      setDisableButtonView(false);
      setDisableDeleteButtonView(false);
    }
  }, [isCheck]);

  const handlecheckchange = (e) => {
    const { id, checked } = e.target;
    console.log('fff', id, checked);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
      setSelectedCourses(courselist?.filter((x) => isCheck.includes(x.id)));
    }
    console.log('fff', isCheck, selectedCourses);
  };

  const handlecardclick = (id) => {
    if (userrole == 'Job Architect' || userrole == 'Super Admin') {
      router.navigate(`/app/createcourse/${id}`)
    }
    else {
      null
    }
  }
  return (
    <>
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <>
          <Box className="d-flex justify-content-end align-items-center mb-5">
            <Box className="button-box mr-2">
              {disableDeleteButtonView && (
                <ButtonComponent
                  name="Delete"
                  className="rounded-4 pos1 mr-2"
                  onClick={() => {
                    deleteCourses();
                  }}
                />
              )}
              {disableButtonView && (
                <ButtonComponent
                  name={buttonMessage}
                  className="rounded-4 pos2"
                  onClick={() => {
                    if (buttonMessage == 'Publish') {
                      updateCourses('Published');
                    } else if (buttonMessage == 'Approve') {
                      updateCourses('Approved');
                    }
                  }}
                />
              )}
            </Box>
            <Box className="mr-2 mt-1">
              <SearchBar
                placeholder="Search course"
                onChange={(e) => {
                  console.log('rrrrrr', e.target.value);
                  setFilterText(e.target.value);
                }}
                value={filterText}
              />
              {/* <FilterComponent/> */}
            </Box>
            <Box>
              <Select
                className="sort_course mt-1"
                // styles={ customStyles }
                placeholder="Status"
                isSearchable={true}
                isClearable={isClearable}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                value={selectedStatus}
                options={statusTypes}
                onChange={handleStatusChange}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </Box>
          </Box>
          <Box className="pl-3 pr-3">
            <Row xxl={6} xl={5} lg={4} md={3} sm={1} className="g-4">
              {newCourseList?.map((course) => (
                <Col
                  key={course.id}
                  className="px-1"
                >
                  <BrowseCourseCardView
                    clickEvent={() => { handlecardclick(course.id) }}
                    cardContents={course}
                    checkbox={true}
                    browsecourse={true}
                    status={course.status}
                    cardclass="p-2 rounded-3"
                    handleClick={handlecheckchange}
                    isChecked={isCheck.includes(course.id)}
                    course={course}
                    chapterlength={course.chaptersCount}
                    topiclength={course.topicsCount}
                    courseDuration={course.totalCourseDuration}
                    checkdisabled={course?.status === 'Published'}
                  />
                </Col>
              ))}
            </Row>
          </Box>
        </>
      )
      }
    </>
  );
}
export default ManageCourses;
