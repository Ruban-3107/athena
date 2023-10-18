import './DashboardCard.css';
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Tooltip,
  OverlayTrigger,
  // Button,
} from 'react-bootstrap';
import {
  Box,
  Span,
  ClockIcon,
  UserIcon,
  BatchIcon,
  CourseIcon,
  TopicIcon,
  WelcomeBackComponent,
  Fullcalender,
  ChapterIcon,
  DatePickerIcon,
} from '@athena/web-shared/ui';

import ProgressComponent from '../ProgressComponent/ProgressComponent';
import {
  useEffect,
  useState,
  useRef,
  createContext,
} from 'react';
/// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { apiRequest } from '@athena/web-shared/utils';
import PerformanceChart from '../PerformanceChart/PerformanceChart';
import { Shimmer } from 'react-shimmer';

export const AdminDashContext = createContext();

export const DashboardCard = () => {
  ///////////////////////////////////////Admin Dashboard ///////////////////////////
  // const [dashData, setDashData] = useState({
  //   tabData: [],
  //   needAttention: [],
  //   adminNeedAttentionData: [],
  //   recentActivitiesData: [],
  //   adminPerformanceChartData: [],
  //   adminPieChartData: [],
  // });
  const [tabData, settabData] = useState([]);
  const [needAttentionData, setneedAttention] = useState([]);
  const [recentActivitiesData, setRecentActivities] = useState([]);
  const [PerformanceChartData, setPerformanceChartData] = useState([]);
  const [adminPieChartData, setadminPieChartData] = useState([]);
  const [performanceGraphView, setPerformanceGraphView] = useState('week');
  const [isLoading, setisLoading] = useState(false);
  const [isattentionShimmer, setisattentionShimmer] = useState(false);
  const [isRecentShimmer, setisRecentShimmer] = useState(false);
  const [needAttentionSize, setNeedAttentionSize] = useState(5);
  const [recentActivitiesSize, setRecentActivitiesSize] = useState(5);
  const [dateRange, setDateRange] = useState('week');

  const getTabsData = async () => {
    try {
      setisLoading(true)
      const { code, value: tabData } = await apiRequest(
        'api/reports/adminmetrics/adminTopTabsData',
        'GET'
      );
      settabData(tabData);
      setisLoading(false);
    } catch (error) {
      console.log('Top tabs data error', error);
    }
  };

  const getNeedAttentionData = async (needAttentionSize) => {
    try {
      const { code, value: needAttention } = await apiRequest(
        `api/reports/adminmetrics/adminNeedAttention?limit=${needAttentionSize}`,
        'GET'
      );
      setneedAttention(needAttention.adminNeedAttentionData);
    } catch (error) {
      console.log('need attention data error', error);
    }
  };

  const getRecentActivitiesData = async () => {
    try {
      const {
        code,
        value: { adminRecentActivitiesData },
      } = await apiRequest(
        `api/reports/adminmetrics/adminRecentActivities?limit=${recentActivitiesSize}`,
        'GET'
      );
      setRecentActivities(adminRecentActivitiesData);
    } catch (error) {
      console.log('recent activities data error', error);
    }
  };

  const getPieChartData = async () => {
    try {
      const {
        code,
        value: { adminPieChartData },
      } = await apiRequest(
        `api/reports/adminmetrics/adminPieChartData?dateRange=${dateRange}`,
        'GET'
      );
      setadminPieChartData(adminPieChartData);
    } catch (error) {
      console.log('pie chart data error', error);
    }
  };

  const getPerformanceChartData = async (performanceGraphView) => {
    try {
      const {
        code,
        value: { adminPerformanceChartData },
      } = await apiRequest(
        `api/reports/adminmetrics/adminPerformanceChart?view=${performanceGraphView}`,
        'GET'
      );
      setPerformanceChartData(adminPerformanceChartData);
    } catch (error) {
      console.log('performance data error', error);
    }
  };

  useEffect(() => {
    getPerformanceChartData(performanceGraphView);
  }, [performanceGraphView]);
  useEffect(() => {
    getPieChartData();
  }, [dateRange]);

  useEffect(() => {
    getNeedAttentionData(needAttentionSize);
    return () => {
      setisattentionShimmer(false);
    }
  }, [needAttentionSize]);

  useEffect(() => {
    getRecentActivitiesData(recentActivitiesSize);
    return () => {
      setisRecentShimmer(false);
    }
  }, [recentActivitiesSize]);

  const needAttentionScrollableRef = useRef(null);
  const recentActivitiesScrollableRef = useRef(null);


  useEffect(() => {
    getTabsData();
  }, []);

  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );
  const tabsData = [
    {
      title: 'Active Learners',
      count: !isLoading ? (
        tabData?.adminTopTabsData
          ?.filter((y) => {
            return y.type === 'Total Users';
          })
          .map((x) => x.count)
      ) : (
        <Spinner size="sm" animation="border" />
      ),
      tooltipMessage: 'Active Learners',
      icon: <UserIcon stroke={`#053979`} />,
      fontcolor: '#056584',
      background:
        'linear-gradient(68deg, rgba(238,248,248,1) 29%, rgba(204,226,233,1) 60%)',
    },
    {
      title: 'Ongoing Batches',
      count: !isLoading ? (
        tabData?.adminTopTabsData
          ?.filter((y) => {
            return y.type === 'Batches';
          })
          .map((x) => x.count)
      ) : (
        <Spinner size="sm" animation="border" />
      ),
      tooltipMessage: 'Ongoing batches',
      icon: (
        <BatchIcon
          // stroke={'#000000'}
          stroke={'#7c1258'}
        />
      ),
      fontcolor: '#7c1258',
      background:
        'linear-gradient(166deg, rgba(245,228,243,1) 23%, rgba(234,171,213,1) 67%)',
    },
    {
      title: 'Published Courses',
      count: !isLoading ? (
        tabData?.adminTopTabsData
          ?.filter((y) => {
            return y.type === 'Courses';
          })
          .map((x) => x.count)
      ) : (
        <Spinner size="sm" animation="border" />
      ),
      tooltipMessage: 'Published courses',
      icon: <CourseIcon fill={'#176C75'} stroke={'#176C75'} />,
      fontcolor: '#1d6f78',
      background:
        'linear-gradient(171deg, rgba(245,228,243,1) 7%, rgba(199,228,234,1) 59%)',
    },
    {
      title: `Pending Approval`,
      count: !isLoading ? (
        tabData?.adminTopTabsData
          ?.filter((y) => {
            return y.type === 'Pending Approval Courses';
          })
          .map((x) => x.count)
      ) : (
        <Spinner size="sm" animation="border" />
      ),
      tooltipMessage: 'Learning content',
      icon: <ClockIcon stroke={'#A36D0A'} fill={'rgb(166,114,17)'} />,
      fontcolor: '#a67211',
      background:
        'linear-gradient(177deg, rgba(254,252,210,1) 4%, rgba(248,210,130,1) 43%)',
    },
  ];

  const needAttention = needAttentionData
    ?.filter((object) => object.hasOwnProperty('needAttentionSubtitle'))
    .map((object, {index} ) => {
      let icon;
      if (object.needAttentionSubtitle.includes('Course')) {
        icon = <CourseIcon fill={'#818fa0'} stroke={'#818fa0'} />;
      } else if (object.needAttentionSubtitle.includes('Chapter')) {
        icon = <ChapterIcon />;
      } else if (object.needAttentionSubtitle.includes('Topic')) {
        icon = <TopicIcon />;
      } else {
        icon = <DatePickerIcon />;
      }
      console.log(index,"objjjjjjjjjjjj")
      return {
        id: index,
        ...object,
        icon,
       
         // generate a unique ID for mapping with key
      };
   
    });
  const recentActivities = recentActivitiesData
    ?.filter((object) => object.hasOwnProperty('recentActivitySubtitle'))
    .map((object, { index }) => ({
      id: index,
      ...object,
      // generate a unique ID for mapping with key
    }));

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
      title: 'New User registered',
      description:
        'Python Masterclass new registration under email id:vigneshengineer07@gmail.com.',
      image:
        'https://img.freepik.com/free-vector/online-archive-documents-base-data-storage-information-search-personal-records-access-base-user-with-magnifying-glass-cartoon-character-vector-isolated-concept-metaphor-illustration_335657-2860.jpg',
    },
  ];

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

  const handleNeedAttentionScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isBottomVisible = scrollTop + clientHeight >= scrollHeight - 1;

    if (isBottomVisible) {
      setNeedAttentionSize(needAttentionSize + 5);
    }
  };

  useEffect(() => {
    // Attach scroll event listeners
    window.addEventListener('scroll', handleNeedAttentionScroll);
    window.addEventListener('scroll', handleRecentActivitiesScroll);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleNeedAttentionScroll);
      window.removeEventListener('scroll', handleRecentActivitiesScroll);
    };
  }, []);

  const handleRecentActivitiesScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isBottomVisible = scrollTop + clientHeight >= scrollHeight - 1;

    if (isBottomVisible) {
      setRecentActivitiesSize(recentActivitiesSize + 5);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      window.addEventListener('scroll', handleRecentActivitiesScroll);
      return () =>
        window.removeEventListener('scroll', handleRecentActivitiesScroll);
    }, 2000);
  }, [recentActivitiesSize]);

  return (
    <Container fluid className="pr-xl-5">
      <Box className="mt-3">
        <WelcomeBackComponent wish={'Hello'} />
      </Box>
      <Row className="mt-4" xl={4} lg={3} md={3} sm={2} xs={1}>
        {tabsData.map((tab) => (
          <Col key={tab.id}>
            <Box
              className="color-grade rounded-4 px-4 py-2"
              style={{ background: tab.background }}
            >
              <h5 className="mt-2" style={{ color: tab.fontcolor }}>
                {tab.title}
              </h5>
              <Box className="d-flex justify-content-between mt-3">
                <OverlayTrigger
                  delay={{ show: 10, hide: 10 }}
                  placement="bottom"
                  overlay={renderTooltip(tab.tooltipMessage)}
                >
                  <h5 style={{ cursor: 'default', color: tab.fontcolor }}>
                    {tab.count}
                  </h5>
                </OverlayTrigger>

                <Span>{tab.icon}</Span>
              </Box>
            </Box>
          </Col>
        ))}
      </Row>
      <Row className="mt-4 pr-3" sm="auto">
        <Col lg={8}>
          <Box className="shadow rounded-4 py-3 mt-1 mb-3">
            <div
            // onClick={handleClick}
            >
              {' '}
              <Fullcalender fromDashboard={true} />
            </div>
          </Box>

          <Row>
            <Col lg={6} className="pr-0">
              <Box className="admin-card-over shadow rounded-4 h-100">
                <PerformanceChart
                  PerformanceChartData={PerformanceChartData}
                  setPerformanceGraphView={setPerformanceGraphView}
                />
              </Box>
            </Col>
            <Col lg={6}>
              <Box className="admin-card-over shadow rounded-4 h-100">
                <ProgressComponent
                  adminPieChartData={adminPieChartData}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </Box>
            </Col>
          </Row>
        </Col>
        <Col lg={4} className="mt-1 rounded-4 shadow" style={{}}>
          <Box className="h-100">
            <h5 className="p-3">Need Attention</h5>
            {!isattentionShimmer ? (
              <div
                className="scrollable-needAttention"
                ref={needAttentionScrollableRef}
                onScroll={handleNeedAttentionScroll}
              >
                {console.log(needAttention,"filterobj")}
                {needAttention?.slice(0, needAttentionSize).map((object) => (
                  <Box
                    className="row-border d-flex align-items-center flex-wrap ms-2 mt-3"
                    key={object.id}
                  >
                    <Span
                      className="pr-2 attention-line"
                      style={{ cursor: 'default' }}
                    >
                      {object.icon}
                    </Span>
                    &nbsp;&nbsp;{' '}
                    <Box>
                      <h6
                        className="mb-0"
                        style={{ cursor: 'default' }}
                      >{`Pending approval`}</h6>

                      <OverlayTrigger
                        delay={{ show: 500, hide: 10 }}
                        placement="top"
                        overlay={renderTooltip(object.needAttentionSubtitle)}
                      >
                        <p
                          className="description-font text-muted"
                          style={{ cursor: 'default' }}
                        >
                          {object.needAttentionSubtitle.slice(0, 42) + '...'}
                        </p>
                      </OverlayTrigger>
                    </Box>
                  </Box>
                ))}
              </div>
            ) : (
              attention.map((object) => (
                <Box
                  className=" row-border d-flex  flex-wrap ms-2 mt-3"
                  key={object.id}
                >
                  <Span
                    className="my-1 pr-2 attention-line"
                    style={{ cursor: 'default' }}
                  >
                    <Shimmer width={24} height={24} />
                  </Span>
                  &nbsp;&nbsp;{' '}
                  <Box>
                    <h6 className="mb-0" style={{ cursor: 'default' }}>
                      <Shimmer className="my-1" width={280} height={16} />
                    </h6>

                    <p
                      className=" description-font text-muted"
                      style={{ cursor: 'default' }}
                    >
                      <Shimmer className="my-1" width={280} height={16} />
                    </p>
                  </Box>
                </Box>
              ))
            )}

            <hr />
            <h5 className="p-3">Recent Activities </h5>

            {!isRecentShimmer ? (
              <div
                className="mb-4 scrollable-recentActivities"
                ref={recentActivitiesScrollableRef}
                onScroll={handleRecentActivitiesScroll}
              >
                {recentActivities
                  ?.slice(0, recentActivitiesSize)
                  .map((recent) => (
                    <Card className="rounded-3 shadow-sm mt-2" key={recent.id}>
                      <Box className="color-grad rounded-4 px-2">
                        <Box className="d-flex align-items-center py-2">
                          <Span style={{ cursor: 'default' }}>
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
                          </Span>{' '}
                          <Box className="ms-2" style={{ cursor: 'default' }}>
                            <h6 className="">{recent.title}</h6>

                            <OverlayTrigger
                              delay={{ show: 500, hide: 10 }}
                              placement="top"
                              overlay={renderTooltip(
                                recent.recentActivitySubtitle
                              )}
                            >
                              <p
                                className="description-font text-muted"
                                style={{ cursor: 'default' }}
                              >
                                {recent.description
                                  ? recent.description.slice(0, 65) + '...'
                                  : recent.recentActivitySubtitle.slice(0, 65) +
                                  '...'}
                              </p>
                            </OverlayTrigger>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  ))}
              </div>
            ) : (
              recent.map((x) => (
                <Card className="rounded-3 shadow-sm mt-2" key={x.id}>
                  <Box className="color-grad rounded-4 px-2">
                    <Box className="d-flex align-items-center py-2">
                      <Span>
                        <Shimmer className="my-1" width={65} height={65} />
                      </Span>
                      <Box className="ms-2">
                        <h6 className="my-1">
                          <Shimmer className="my-1" width={240} height={16} />
                        </h6>
                        <h6 className="my-1">
                          <Shimmer className="my-1" width={240} height={16} />
                        </h6>{' '}
                        <h6 className="">
                          <Shimmer className="my-1" width={200} height={16} />
                        </h6>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        </Col>
      </Row>
    </Container>
  );
}
export default DashboardCard;
