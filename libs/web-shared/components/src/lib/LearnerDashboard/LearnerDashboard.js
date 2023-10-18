import { useState, useContext, useMemo, useEffect } from 'react';
import './LearnerDashboard.css';
import {
  AdminDashContext,
  LearnerDashContext,
} from '../../../../../../apps/web/src/app/pages/Dashboard';
import {
  Button,
  Card,
  CardGroup,
  Col,
  Container,
  Row,
  Tab,
  Tabs,
  Tooltip,
  OverlayTrigger,
  Popover,
  Spinner,
} from 'react-bootstrap';
import {
  Fullcalender,
  AssessmentsTabsIcon,
  CareerpathTabsIcon,
  CertificationsTabsIcon,
  CircleLearnerIcon,
  HandsonTabsIcon,
  SoftskillTabsIcon,
  UpskillTabsIcon,
  ImageComponent
} from '@athena/web-shared/ui';
import { Box, Span } from '@athena/web-shared/ui';
import { CircularProgressbar } from 'react-circular-progressbar';
import { apiRequest, useAuth, useRouter } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';

export function LearnerDashboard(props) {
  /**Logged In user*/
  const auth = useAuth();
  const router = useRouter();
  const userId = Number(auth?.user?.id);
  const [loading, isLoading] = useState(false);
  const [continueLearning, setContinueLearning] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [continueImgLoading, setContinueImgLoading] = useState(false);

  ///////Temporarily generating random values for list//////////
  ////////////////////Top Tabs/////////////////////////////////
  /**Toptabs*/
  const learnerTabs = [
    {
      id: 1,
      title: 'Soft-skill',
      routeTo: 'softskill',
      backgroundColor:
        'linear-gradient(167.93deg, rgba(248, 216, 246, 0.34) -2.93%, rgba(255, 46, 238, 0.34) 69.54%)',
      icon: <img src="assets/images/softskillSVG.svg" />,
    },
    {
      id: 2,
      title: 'Up-skill',
      routeTo: 'upskill',
      backgroundColor:
        'linear-gradient(167.93deg, rgba(201, 188, 276, 0.34) 5.31%, rgba(59, 0, 183, 0.34) 69.54%)',
      icon: <img src="assets/images/upskillSVG.svg" />,
    },
    {
      id: 3,
      title: 'Hands-on',
      routeTo: 'NGS',
      backgroundColor:
        'linear-gradient(167.93deg, rgba(140, 221, 239, 0.34) -2.93%, rgba(0, 116, 150, 0.34) 69.54%)',
      icon: <img src="assets/images/handsonSVG.svg" />,
    },
    {
      id: 4,
      title: 'Certifications',
      routeTo: 'certification',
      backgroundColor:
        ' linear-gradient(167.93deg, rgba(214, 255, 128, 0.34) 24.24%, rgba(102, 148, 6, 0.34) 69.54%)',
      icon: <img src="assets/images/certificationsSVG.svg" />,
    },
    {
      id: 5,
      title: 'Career-path',
      // routeTo: 'careerpath',
      backgroundColor:
        'linear-gradient(167.93deg, rgba(264, 215, 176, 0.34) 21.82%, rgba(210, 78, 3, 0.34) 73.5%, rgba(210, 78, 3, 0.34) 69.54%)',
      icon: <img src="assets/images/careerpathSVG.svg" />,
    },
    {
      id: 6,
      title: 'Assessments',
      // routeTo: 'assessments',
      backgroundColor:
        'linear-gradient(167.93deg, rgba(255, 255, 255, 0.34) -2.93%,  rgba(2, 126, 153, 0.34)  69.54%)',
      icon: <img src="assets/images/assessmentsSVG.svg" />,
    },
  ];
  ////////////////////Top Tabs//////////////////////////////////

  ////////////////////Continue Learning//////////////////////////////////

  /**Continue Learning Fallback Values*/
  const continueLearningSample = [];

  for (let i = 1; i <= 20; i++) {
    let continueLearningDataObject = {
      id: i,
      imageUrl: 'assets/images/java.png', // Add your logic to generate a random image here
      title: `Java Fundamentals ${i}`,
      totalChapters: Math.floor(Math.random() * 100),
      totalTopics: Math.floor(Math.random() * 200),
      completedPercentage: `${Math.floor(Math.random() * 100)}`,
      color: '#0d6efd',
    };

    continueLearningSample.push(continueLearningDataObject);
  }

  /**Continue Learning*/
  const fetchContinueLearning = async () => {
    try {
      const {
        code,

        value: { userContinueLearning },
      } = await apiRequest(
        `api/reports/learnermetrics/continueLearning?userId=${userId}&limit=${5}`
      );

      setContinueLearning(userContinueLearning);
    } catch (error) {
      console.log('continue learning api error', error);
      toast.error('Something went wrong, using fallback values');
      setContinueLearning(continueLearningSample);
    }
    console.log('AAATH', continueLearning);
  };

  useEffect(() => {
    fetchContinueLearning();
  }, []);

  ////////////////////Continue Learning//////////////////////////////////
  ////////////////////Upcoming Sessions//////////////////////////////////
  const upcoming = [];

  for (let i = 1; i <= 20; i++) {
    let trainerName = Math.random() < 0.5 ? 'KAMAL HASSAN' : 'JOHN WICK';
    let upcomingSessionDataObject = {
      id: i,
      image: 'assets/images/java.png',
      title: `Chapter ${i}`,
      subtitle: `JavaScript exercise ${i}`,
      trainerName: trainerName,
      time: `From 9:00AM to 10:30AM`,
      date: `02/03/2023`,
      color: '#EB760C',
    };

    if (i === 1) {
      upcomingSessionDataObject = {
        id: i,
        image: 'assets/images/react.png',
        title: `Chapter ${i}`,
        subtitle: `JavaScript exercise ${i}`,
        trainerName: trainerName,
        time: `From 9:00AM to 10:30AM`,
        date: `Today`,
        color: '#0267B2',
      };
    }

    upcoming.push(upcomingSessionDataObject);
  }

  const fetchUpcomingSessions = async () => {
    try {
      const {
        code,

        value: { userUpcomingSessions },
      } = await apiRequest(
        `api/reports/learnermetrics/upcomingSessions?userId=${userId}&limit=${5}`
      );

      setUpcomingSessions(userUpcomingSessions);
    } catch (error) {
      console.log('continue learning api error', error);
      toast.error('Something went wrong, using fallback values');
      setUpcomingSessions(upcoming);
    }
    console.log('AAATH', upcomingSessions);
  };

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  ////////////////////Upcoming Sessions//////////////////////////////////

  ////////////////////My Courses//////////////////////////////////
  const myCourses = [];

  for (let i = 1; i <= 20; i++) {
    let courseType = Math.random() < 0.5 ? 'Completed' : 'Ongoing';
    let courseTitle =
      Math.random() < 0.5 ? 'How to manage stress' : 'Deep Learning with R';
    let trainerName = Math.random() < 0.5 ? 'KAMAL HASSAN' : 'TOM CRUISE';

    let myCoursesDataObject = {
      id: i,
      image:
        'http://3.111.254.104:4566/athena-submissions/C%3A%5CUsers%5CSANJEE~1%5CAppData%5CLocal%5CTemp%5C1d720c0d828146fd978fff201/java.png',
      title: `${courseTitle.toUpperCase()} ${i}`,
      trainerName: `${trainerName.toUpperCase()}`,
      progress: Number(Math.floor(Math.random() * 100)),
      linkTo: `View course ${i}`,
      courseType: courseType,
    };

    myCourses.push(myCoursesDataObject);
  }

  const fetchCompletedCourses = async () => {
    try {
      const {
        code,

        value: { userCompletedCourses },
      } = await apiRequest(
        `api/reports/learnermetrics/completedCourses?userId=${userId}&limit=${5}`
      );

      setCompletedCourses(
        userCompletedCourses.map((x) => {
          return {
            ...x,
            trainerName: 'Kamal Hassan',
            linkTo: 'https://www.google.com',
          };
        })
      );
    } catch (error) {
      console.log('continue learning api error', error);
      toast.error('Something went wrong, using fallback values');
      setCompletedCourses(myCourses);
    }
    console.log('AAATH', completedCourses);
  };

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  ////////////////////My Courses//////////////////////////////////

  const renderTooltip = (name) => (
    <Popover id="datatable-popover">
      <Popover.Body style={{ fontWeight: 'bold' }}>{name}</Popover.Body>
    </Popover>
  );

  return (
    <Container>
      <Box className="mt-3">
        <h5>{`Getting started`}</h5>
      </Box>

      <Box className="mt-4">
        <CardGroup
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          {learnerTabs.map((learn, index) => (
            <Box
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                if (learn.routeTo) {
                  router.navigate('/app/browse', {
                    state: { courseType: learn.routeTo },
                  });
                }
              }}
              className="m-1"
              key={index} 
            >
              <Card
                className=""
                style={{
                  width: '170px',
                  border: '1px solid white',
                  background: learn.backgroundColor,
                }}
              >
                <div className="mt-3 d-flex justify-content-center align-items-center">
                  {learn.icon}
                </div>
                <h6 className="pt-2 d-flex justify-content-center">
                  {learn.title}
                </h6>
              </Card>
            </Box>
          ))}
        </CardGroup>
      </Box>
      <Row className="mt-4" sm="auto">
        <Col lg={8}>
          <Box className="shadow rounded-4 py-3 mt-1">
            <div>
              <Fullcalender fromDashboard={true} />
            </div>
          </Box>

          <Box className="shadow rounded-4 py-3 mt-3 mb-3">
            <h5 className="py-2 p-4">Completed Courses</h5>
            <Box style={{ height: '280px' }}>
              {completedCourses.length == 0 ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    width="230px"
                    height="230px"
                    src="assets/images/NothingToShowWrapper.svg"
                  />
                  <h6>Nothing to show</h6>
                  <p className="text-secondary" style={{ fontSize: '12px' }}>
                    Courses you have completed will be listed here
                  </p>
                </div>
              ) : (
                <div className="scrollable-mycourses">
                  {completedCourses
                    .map((mycourse) => (
                      <Box
                        className="align-items-center mt-3 mx-3"
                        style={{
                          width: '96%',
                          height: '88px',
                          cursor: 'pointer',
                          border: '1px solid #D9D9D9',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <Row xs="auto" className="mr-auto">
                          <Col xs="auto" className="mr-auto">
                            <img
                              style={{ borderRadius: '50%' }}
                              width="60px"
                              height="60px"
                              src={upcoming[0].image}
                            />
                          </Col>{' '}
                          <Col xs="auto" className="mr-auto">
                            <h6
                              className="d-flex justify-content-center"
                              style={{
                                marginTop: '15px',
                                fontSize: '14px',
                                textAlign: 'start',
                                lineHeight: '1.2',
                              }}
                            >
                              {`${mycourse.title}`}
                            </h6>
                            <p
                              style={{
                                fontSize: '12px',
                                textAlign: 'start',
                                lineHeight: '0.1',
                              }}
                              className="d-flex justify-content-start text-secondary"
                            >
                              {mycourse.trainerName}
                            </p>
                          </Col>
                          <Col
                            xs="auto"
                            style={{ marginTop: '12px' }}
                            className="mr-auto"
                          ></Col>
                          <Col
                            xs="auto"
                            className="mr-auto d-flex align-items-center"
                          >
                            <Button
                              style={{
                                fontSize: '12px',
                                paddingInline: '30px',
                                background: '#40A9FF',
                                borderRadius: '12px',
                                border: 'none',
                              }}
                              onClick={() => {
                                alert(mycourse.linkTo);
                              }}
                            >
                              View Course
                            </Button>
                          </Col>
                        </Row>
                      </Box>
                    ))}
                </div>
              )}
            </Box>
          </Box>
        </Col>
        <Col lg={4} className="mt-1 rounded-4 shadow">
          <h5 className="py-4 px-1">Continue Learning</h5>
          {continueLearningSample.length === 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img
                width="230px"
                height="230px"
                src="assets/images/NothingToShowWrapper.svg"
              />
              <h6>Nothing to show</h6>
              <p className="text-secondary" style={{ fontSize: '12px' }}>
                Courses you are currently learning will be listed here
              </p>
            </div>
          ) : (
            <div className="scrollable-continueLearning mx-2">
              {continueLearning.length > 0 && continueLearning?.map((continueLearn) => (
                <Box
                  className="row-border align-items-center"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                  }}
                  key={continueLearn.id}
                >
                  <Span className="mt-2">
                    <ImageComponent image_url={continueLearn.image_url} />
                  </Span>
                  <Box className="ms-2 mt-1">
                    <div style={{ fontSize: '14px', cursor: 'default' }}>
                      {continueLearn.title}
                    </div>
                    <Box
                      className=""
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}
                    >
                      <div
                        className="text-primary"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          fontSize: '10px',
                          cursor: 'default',
                        }}
                      >
                        {continueLearn.totalChapters} Chapters
                        <CircleLearnerIcon
                          className="mx-2 "
                          width="9"
                          height="9"
                          fill={continueLearn.color}
                        />
                        {continueLearn.totalTopics} Topics
                      </div>
                    </Box>
                  </Box>
                  <Span
                    className="col-4 pr-2 d-flex flex-wrap justify-content-end align-items-flex-end"
                    style={{
                      cursor: 'default',
                    }}
                  >
                    <Box className="justify-content-end align-items-end">
                      <CircularProgressbar
                        className=""
                        value={continueLearn.completedPercentage}
                        text={`${continueLearn.completedPercentage}%`}
                        styles={{
                          root: { width: '50px' },
                          path: { stroke: '#0055FF' },
                          text: { fontWeight: 'bold', fill: '#000000' },
                        }}
                      />
                    </Box>
                  </Span>
                </Box>
              ))}
            </div>
          )}

          <hr />
          <h5 className="py-4 px-1">Upcoming Sessions</h5>

          {upcoming.length === 0 ? (
            <div
              style={{
                margin: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img
                width="230px"
                height="230px"
                src="assets/images/NothingToShowWrapper.svg"
              />
              <h6>Nothing to show</h6>
              <p className="text-secondary" style={{ fontSize: '12px' }}>
                Training schedules listed for you will be listed here
              </p>
            </div>
          ) : (
            <div className="scrollable-upcoming mx-2">
              {upcomingSessions.length > 0 && upcomingSessions?.map((upcoming) => (
                <Box
                  className="align-items-center mt-2"
                  style={{
                    width: '98%',
                    height: '46%',
                    cursor: 'pointer',
                    border: '1px solid #D9D9D9',
                    padding: '15px',
                    borderRadius: '8px',
                  }}
                >
                  <Row>
                    <Col xs="auto">
                      <CircleLearnerIcon
                        width="16"
                        height="16"
                        fill={upcoming.color}
                      />
                    </Col>
                    <Col className="mr-auto" style={{ fontSize: '14px' }}>
                      <Row
                        xs="auto"
                        className="mr-auto"
                        style={{ fontSize: '14px' }}
                      >
                        {upcoming.title}
                      </Row>
                      <Row
                        xs="auto"
                        className="mt-1 mr-auto text-secondary"
                        style={{ fontSize: '12px' }}
                      >
                        {upcoming.subtitle}
                      </Row>
                    </Col>
                    <Col xs="auto">
                      <OverlayTrigger
                        delay={{ show: 10, hide: 10 }}
                        placement="top-end"
                        overlay={renderTooltip(`${upcoming.trainerName}`)}
                      >
                        <img
                          style={{ borderRadius: '50%' }}
                          width="40"
                          height="40"
                          // src={upcoming.image}
                          src="assets/images/avatar.png"
                        />
                      </OverlayTrigger>
                    </Col>
                  </Row>

                  <Row
                    style={{
                      marginTop: '20px',
                    }}
                    className="ms-3 mr-auto"
                  >
                    <Col
                      xs="auto"
                      className="mr-auto"
                      style={{ fontSize: '12px', color: upcoming.color }}
                    >
                      {upcoming.time}
                    </Col>

                    <Col
                      xs="auto"
                      style={{
                        fontSize: '12px',
                        color: upcoming.color,
                      }}
                    >
                      {upcoming.date}
                    </Col>
                  </Row>
                </Box>
              ))}
            </div>
          )}
        </Col>
        <Col lg={8} className="mt-2"></Col>
      </Row>
    </Container>
  );
}
export default LearnerDashboard;