import './BrowseCourses.css';
import {
  SearchBar,
  Loader,
  Box,
  BrowseCourseCardView,
  Span,
} from '@athena/web-shared/ui';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiRequest, useRouter, requireAuth } from '@athena/web-shared/utils';
import { Col, Row } from 'react-bootstrap';

export const BrowseCourses = (props) => {
  const location = useLocation();
  const router = useRouter();
  const [listOfCourses, setListOfCourses] = useState([]);
  const [pending, setPending] = useState(true);
  const [filterText, setFilterText] = useState('');
  const courseType = location?.state?.courseType ?? '';
  // const query = new URLSearchParams(location.search).get('type');
  const getAvailableCourses = async () => {
    const availableCoursesResponse = await apiRequest(
      location?.pathname === '/app/mycourses'
        ? 'api/courses/user_tracks'
        : courseType
          ? `api/courses/tracks/soft/${courseType}/Published`
          : 'api/courses/tracks/status_type/Published'
    );
    if (
      location?.pathname !== '/app/mycourses' &&
      availableCoursesResponse.status === 'success'
    ) {
      console.log('dddddddddd', availableCoursesResponse);
      setListOfCourses(availableCoursesResponse.value);
      setPending(false);
    } else {
      console.log('dddddddddd', availableCoursesResponse);
      setListOfCourses(availableCoursesResponse);
      setPending(false);
    }
  };

  useEffect(() => {
    if (filterText.length>0) {
      searchCourse();
    } else {
      getAvailableCourses();
    }
  }, [filterText]);

  const convertToMin = (duration) => {
    let hours = Math.floor(duration / 60);
    let minutes = Math.floor(duration % 60);
    return {
      hours: hours,
      minutes: minutes,
    };
  };

  const modifyCourseObject = (data) => {
    let cdata = data?.map((x) => {
      let topicArray = [],
        array1 = [];
      for (const i of x.track_chapters) {
        for (const j of i.chapter_topics) {
          topicArray.push(j);
          array1.push(Number(j.duration));
        }
      }
      const initialValue = 0;
      const sumWithInitial = array1.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );
      return {
        id: x.id,
        title: x.title,
        subtitle: x.slug,
        image_url: x.image_url,
        courseDuration: convertToMin(sumWithInitial),
        chaplength: x.track_chapters.length,
        toplength: topicArray.length,
      };
    });
    return cdata;
  };

  const searchCourse = async () => {
    let data = {};
    if (filterText !== '') {
      data['searchkey'] = filterText;
      const searchedcoursesresponse = await apiRequest(
        `api/courses/tracks/search/searchTracks`,
        'POST',
        data
      );
      console.log('tyttytyt', searchedcoursesresponse);
      const foundTracksData = modifyCourseObject(
        searchedcoursesresponse?.value
      );
      setListOfCourses(searchedcoursesresponse?.value);
      console.log('KAA', foundTracksData);
    }
  };

  useEffect(() => {
    getAvailableCourses();
  }, [location.state]);

  const browsebyid = (id) => {
    router.navigate(`/app/browse/${id}`);
  };

  const handleClear = () => {
    if (filterText) {
      setFilterText('');
    }
  };
  console.log(filterText,"filtertect");
  return (
    <>
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <>
          <Box className="d-flex justify-content-between mt-5 mb-3">
            <h3 className="browse-head">
              {courseType == 'upskill'
                ? 'Upskill'
                : courseType == 'NGS'
                  ? 'Hands-on'
                  : courseType == 'softskill'
                    ? 'Soft Skills'
                    : courseType == 'certification'
                      ? 'Certifications'
                      : location.pathname == '/app/mycourses'
                        ? 'My Recent Courses'
                        : 'Courses'}
            </h3>
              <SearchBar
                onChange={(e) => setFilterText(e.target.value)}
                // onChange={filter}
                // onClear={handleClear}
                filterText={filterText}
                value={filterText}
                defaultValue={filterText}
              />
          </Box>
          <Box className="px-xl-4">
            <Row xs={1} md={2} lg={3} xl={6} className="g-4 p-2">
              {listOfCourses?.map((course, index) => (
                <Col key={course.id} className="p-2">
                  <BrowseCourseCardView
                    cardContents={course}
                    clickEvent={() => browsebyid(course.id)}
                    browsecourse
                    course={course}
                    searchtrue={filterText.length>0?true:false}
                  />
                </Col>
              ))}
            </Row>
          </Box>
        </>
      )}
    </>
  );
};
export default requireAuth(BrowseCourses);
