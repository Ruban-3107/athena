import './CourseOffcanvas.css';
import { Button, Card, Col, Form, Offcanvas, Row } from 'react-bootstrap';
import SearchBar from '../SearchBar/SearchBar';
import { Box } from '@athena/web-shared/ui';
import DraggableComponent from '../DraggableComponent/DraggableComponent';
import { toast } from 'react-toastify';

export const CourseOffcanvas = (props) => {
  const { handleClose, show, course, handleSelectCourse, handleAddCourse, handleclearcourse, selectedcourselist, filterfunc } = props;
//   useEffect(() => {
//   console.log("kjhghjhkkhj")
// },[])
  const calculateDurationSum = (track) => {
    let topiccount = 0, chaptercount = 0, topicduration = 0;
    track?.track_chapters?.forEach((x) => {
      x?.chapter_topics?.forEach((y) => {
        topiccount++;
        topicduration = topicduration + Number(y.duration);
      })
      chaptercount++;
    })
    const a = Math.floor(topicduration / 60);
    const b = Math.floor(topicduration % 60);
    const trackdata = { chaptercount: chaptercount, topiccount: topiccount, topichours: a, topicminutes: b };
    return trackdata;
  }

  return (
    <Offcanvas show={show} placement="end" onHide={handleClose} className='course-offcanva' style={{ overflowX: 'hidden', width: '520px' }}>
      <Offcanvas.Header
        closeButton
        className="custom-close-button button">
        <Offcanvas.Title className='mt-4'>Explore Courses</Offcanvas.Title>
      </Offcanvas.Header>
      <Box className='px-3 mb-4'>
        <SearchBar
          onChange={(e) => {
            console.log("retttetetete");
            filterfunc(e.target.value)
          }}
            // onClear={handleClear}
            // filterText = { e.target.value }
            // value = { e.target.value }
            // defaultValue = { e.target.value }
        />
      </Box>
      <Offcanvas.Body className='course-off-body'>
        {course?.map((course, index) => (
          <DraggableComponent type="table-row1" item={course} renderElement={"div"} handleClose={handleClose}>
            <Box className='d-flex align-items-center gap-3 mb-3' key={course.id}>
              <Box>
                <Form.Check
                  className='coursecheck'
                  type="checkbox"
                  checked={selectedcourselist.includes(course)}
                  onChange={(e) => handleSelectCourse(course, e.target.checked)}
                />
              </Box>
              <Box className='w-100'>
                <Card className='cour-card'>
                  <Row className="align-items-center px-3">
                    <Col lg={3} className="px-1 py-1">
                      <img src={course.image_url} width="75px" height="75px" className='p-2 cour-img' />
                    </Col>
                    <Col lg={9} className="px-0">
                      <h5 className="couroff-title">{course.title}</h5>
                      <Box className="d-flex justify-content-between">
                        <h6 className='couroff-subtitle'>{course?.blurb}</h6>
                        <h6 className="couroff-subtitle me-2">
                          {calculateDurationSum(course).topichours > 0
                            ? calculateDurationSum(course).topichours + 'hrs'
                            : calculateDurationSum(course).topicminutes + 'mins'}
                        </h6>
                      </Box>
                    </Col>
                  </Row>
                </Card>
              </Box>
            </Box>
          </DraggableComponent>
        ))}

      </Offcanvas.Body>
      <Box className="d-flex justify-content-end mt-4 mb-4 me-3">
        <Button
          className="courseoff-btn px-4"
          variant="outline-primary"
          type="button"
          onClick={() => {
            handleclearcourse();
          }}
        >
          Cancel
        </Button>
        <Button
          className="courseoff-btn2 ms-2"
          variant="primary"
          type="button"
          onClick={() => {
            handleAddCourse();
            toast.success(`Added ${selectedcourselist.length} chapters`);
            handleClose();
          }}
        >
          Add Courses
        </Button>
      </Box>
    </Offcanvas>
  );
}
export default CourseOffcanvas;

