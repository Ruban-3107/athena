import { Row, Card, CardGroup, Col, Container } from 'react-bootstrap';
import './TrainerDashboard.css';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import {
  Fullcalender,
  BatchIcon,
  ChapterIcon,
  CourseIcon,
  DatePickerIcon,
  TopicIcon,
  UserIcon,
  Box, 
  ClockIcon, 
  Span
} from '@athena/web-shared/ui';

import { Shimmer } from 'react-shimmer';
import { useRouter } from '@athena/web-shared/utils';

export function TrainerDashboard(props) {
  const router = useRouter();

  const trainerTabs = [
    {
      icon: (
        <ClockIcon
          stroke={'#587E33'}
          fill={'#587E33'}
          style={{ position: 'relative' }}
        />
      ),
      data: `${Number(10).toLocaleString('en-US')} hrs`,
      title: 'Hours trained',
      backgroundColor:
        'linear-gradient(151.8deg, #CFFFAA 17.45%, #ECFFDD 97.41%)',
    },
    {
      icon: <UserIcon stroke={`#2E6A5C`} style={{ position: 'relative' }} />,
      data: `${Number(121).toLocaleString('en-US')}`,
      title: 'Learners trained',
      backgroundColor:
        'linear-gradient(135.23deg, #98CEC1 -5.16%, #E4F9F4 108.37%)',
    },
    {
      icon: (
        <CourseIcon
          fill={'#684261'}
          stroke={'#176C75'}
          style={{ position: 'relative' }}
        />
      ),
      data: `${Number(23).toLocaleString('en-US')}`,
      title: 'Topics created',
      backgroundColor:
        'linear-gradient(131.21deg, #B69797 -4.8%, #F1E0E0 100%)',
    },
    {
      icon: (
        <ClockIcon
          stroke={'#A33E3E'}
          fill={'#A33E3E'}
          style={{ position: 'relative' }}
        />
      ),
      data: `${Number(7).toLocaleString('en-US')}`,
      title: 'Schedule',
      backgroundColor:
        'linear-gradient(129.22deg, #FFBEBE 0%, #FDECEC 104.52%)',
    },
  ];

  /**Need attention wrapper*/
  const attention = [
    {
      id: 1,
      title: 'Pending Approval',
      description: 'User update for batch No: BA00118',
      image: <BatchIcon />,
    },
    {
      id: 2,
      title: 'Reschedule',
      description: 'Java Masterclass for batch No: BA00118',
      image: <DatePickerIcon />,
    },
    {
      id: 3,
      title: 'Pending Approval',
      description: 'Course update for Masterclass java 001',
      image: <CourseIcon />,
    },
    {
      id: 4,
      title: 'Pending Approval',
      description: ' Topic update by Rupesh kumar',
      image: <TopicIcon />,
    },
    {
      id: 5,
      title: 'Reschedule',
      description: 'React bootcamp for batch No: BA00118',
      image: <DatePickerIcon />,
    },
  ];

  /**Recent activities wrapper*/
  const recent = [
    {
      title: 'Batch No: 001 commenced',
      description:
        'Batch 001 java advanced course live class has commenced at 9:30AM',
      image:
        'http://3.111.254.104:4566/athena-submissions/C%3A%5CUsers%5CSANJEE~1%5CAppData%5CLocal%5CTemp%5C1d720c0d828146fd978fff201/java.png',
    },
    {
      title: 'Rupesh Kumar deactivated',
      description: 'Java trainer has deactivated his corporate account',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD7ztw89j-1QlfEsT6KNAMqNls4kwWOUI7Iw&usqp=CAU',
    },
    {
      title: 'Batch No: 002 commenced',
      description:
        'Batch 001 advanced main course live class has commenced at 3:30AM',
      image:
        'http://3.111.254.104:4566/athena-submissions/C%3A%5CUsers%5CSANJEE~1%5CAppData%5CLocal%5CTemp%5C1d720c0d828146fd978fff201/java.png',
    },
    {
      title: 'New User registered',
      description:
        'Python Masterclass new registration under email id:vigneshengineer07@gmail.com.',
      image:
        'https://img.freepik.com/free-vector/online-archive-documents-base-data-storage-information-search-personal-records-access-base-user-with-magnifying-glass-cartoon-character-vector-isolated-concept-metaphor-illustration_335657-2860.jpg',
    },
  ];

  const trainerCourses = [
    {
      id: 1,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?w=996&t=st=1690350067~exp=1690350667~hmac=4f04dab2d1289c05ea3b4ca249315f0c9451127ff6a497b71591d37ac0b8a0f6"
        />
      ),
        url:"https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg?w=996&t=st=1690350067~exp=1690350667~hmac=4f04dab2d1289c05ea3b4ca249315f0c9451127ff6a497b71591d37ac0b8a0f6",
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 2,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      url:"https://img.freepik.com/free-photo/learning-education-ideas-insight-intelligence-study-concept_53876-120116.jpg?w=1380&t=st=1690351310~exp=1690351910~hmac=509d0ed39e62dfe0b85172b0684bdd5bc8f2cfcee0b75c726ddea50b631de777",
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 3,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      url:"https://img.freepik.com/premium-vector/app-development-concept-with-programming-languages-desktop_23-2148690530.jpg",
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 4,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      url:"https://img.freepik.com/free-vector/flat-design-monogram-logo_23-2150588923.jpg?t=st=1690351389~exp=1690351989~hmac=6489e3dacc4f889acfa6775d9c226a6a332ff2a12f777599e01ba6fb15114825",
      status: 'Pending Approval',

      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 5,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      status: 'Pending Approval',
      url:"https://img.freepik.com/premium-vector/programmer-working-modern-flat-concept-web-banner-design-developer-creates-software_9209-8322.jpg?size=626&ext=jpg&ga=GA1.2.476822789.1672295766&semt=sph",
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 6,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 7,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
    {
      id: 8,
      title: 'JavaScript for Beginners Specialization',
      image: (
        <img
          className="m-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
          }}
          width="93.5%"
          height="120px"
          src="http://3.111.254.104:4566/athena-submissions/AI.jfif"
        />
      ),
      status: 'Pending Approval',
      description:
        'this is a sample course just to demonstrate how UI looks like',
    },
  ];

  return (
    <Container>
      <Row className="mt-4 mb-2">
        <h5>Getting Started</h5>
      </Row>
      <Row>
        <Col lg={8}>
          <Box className="shadow rounded-3 px-4 py-3 mt-1">
            <h5>Analytics</h5>

            <CardGroup
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              {trainerTabs.map((train, index) => (
                <Box
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    alert('Hi');
                  }}
                  className="m-1"
                >
                  {' '}
                  <Card
                    className=""
                    style={{
                      width: '160px',
                      height: '100%',
                      border: '1px solid white',
                      background: train.backgroundColor,
                    }}
                  >
                    <Box className="m-3">
                      <Box
                        style={{ padding: '1px', width: '40%', height: '40%' }}
                      >
                        <CircularProgressbarWithChildren value={66}>
                          <div
                            style={{
                              background: 'white',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '73%',
                              height: '70%',
                              borderRadius: '50%',
                              padding: '8px',
                            }}
                          >
                            {train.icon}
                          </div>
                        </CircularProgressbarWithChildren>
                      </Box>

                      <h5 className="mt-3">{train.data}</h5>

                      <Box>
                        <h6
                          style={{ fontSize: '15px', lineHeight: '0.3' }}
                          className=""
                        >
                          {train.title}
                        </h6>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </CardGroup>
          </Box>
          <Box className="shadow rounded-3 py-3 mt-4 mb-3">
            <div>
              <Fullcalender fromDashboard={true} />
              <Span
                style={{
                  marginTop: '20px',
                  marginRight: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: '#0396FF',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.navigate(`/app/calendar`);
                }}
              >
                {`View all->`}
              </Span>
            </div>
          </Box>
        </Col>
        <Col lg={4}>
          <Box className="shadow rounded-3 px-4 py-3 mt-1">
            <h5>Need Attention</h5>

            <div className="scrollable-trainerNeedAttention">
              {attention.map((attention) => (
                <Box
                  className="row-border d-flex align-items-center flex-wrap ms-2 mt-3"
                  key={attention.id}
                >
                  <Span
                    className="pr-2 attention-line"
                    style={{ cursor: 'default' }}
                  >
                    <CourseIcon fill={'black'} stroke={'black'} />
                  </Span>
                  &nbsp;&nbsp;{' '}
                  <Box>
                    <h6 className="mb-0" style={{ cursor: 'default' }}>
                      {attention.title}
                    </h6>

                    <p
                      className="description-font text-muted"
                      style={{ cursor: 'default' }}
                    >
                      {attention.description}
                    </p>
                  </Box>
                </Box>
              ))}
            </div>

            <hr />
            <h5>Recent Activities</h5>

            <div className="scrollable-trainerRecentActivities">
              {recent.map((recent) => (
                <Card className="rounded-3 shadow-sm mt-2" key={recent.id}>
                  <Box className="color-grad rounded-4 px-2">
                    <Box className="d-flex align-items-center py-2">
                      <Span>
                        <img
                          className="recent-imag rounded-3"
                          width="65px"
                          height="65px"
                          src={
                            recent.image
                              ? recent.image
                              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD7ztw89j-1QlfEsT6KNAMqNls4kwWOUI7Iw&usqp=CAU'
                          }
                        ></img>
                      </Span>
                      <Box className="ms-2">
                        <h6 className="my-1">{recent.title}</h6>
                        <p
                          className="description-font text-muted"
                          style={{ cursor: 'default' }}
                        >
                          {recent.description}
                        </p>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </div>
          </Box>
        </Col>{' '}
        <Col lg={8}> </Col>
      </Row>

      <Box className="mt-3">
        <Box className="shadow rounded-4 px-3 py-3 mt-1 mb-3">
          <h5>Courses</h5>
          <CardGroup
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              justifyContent: 'space-evenly',
            }}
          >
            {trainerCourses
              .map((course) => (
                <Box
                  className="shadow"
                  style={{ borderRadius: '10px', cursor: 'pointer' }}
                >
                  <Card
                    style={{
                      border: 'none',
                    }}
                  >
                    <p
                      className="mt-1 me-2"
                      style={{
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {course.status}
                    </p>
                    <img
                      className="m-2"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '10px',
                      }}
                      width="93.5%"
                      height="120px"
                      src={course.url}
                    />
                    <p className="m-2" style={{ fontSize: '12px' }}>
                      {course.title}
                    </p>
                  </Card>
                </Box>
              ))
              .slice(0, 5)}
          </CardGroup>
          <Span
            style={{
              marginTop: '20px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'flex-end',
              color: '#0396FF',
              cursor: 'pointer',
            }}
            onClick={() => {
              router.navigate(`/app/managecourse`);
            }}
          >
            {`View all->`}
          </Span>
        </Box>
      </Box>
    </Container>
  );
}
export default TrainerDashboard;
