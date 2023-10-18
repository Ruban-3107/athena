import {
  Box,
  HeaderWithButton,
  HeaderComponent,
  Span,
  VideoModal,
  DocModal,
  BrowseCourseCardView,
  ButtonComponent,
  CourseContent,
  ExpandIcon,
  TickCircle,
} from '@athena/web-shared/ui';
import './CourseBrief.css';
import { useEffect, useRef, useState } from 'react';
import {
  apiRequest,
  useParams,
  useRouter,
} from '@athena/web-shared/utils';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';


export const CourseBrief = () => {

  const [CourseDetail, SetCourseDetail] = useState(null);
  const [viewButton, setViewButton] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [modifiedChap, setModifiedChap] = useState([]);
  const [modifiedChild, setModifiedChild] = useState([]);
  const viewerRef = useRef(null);
  const router = useRouter();

  const [pdfState, setPdfState] = useState({
    open: false,
    url: "",
    title: ""
  });
  const [videoState, setVideoState] = useState({
    open: false,
    url: "",
    title: ""
  });

  const params = useParams();
  const { id, courseId } = params;


  const getCourseDetail = async () => {
    let url;
    if (id && courseId) {
      url = `api/batches/user_tracks/${id}/${courseId}`;
    } else if (id && !courseId) {
      url = `api/batches/user_tracks/${id}`;
    }
    const CoursesDetailResponse = await apiRequest(url);
    console.log('CoursesDetailResponse', CoursesDetailResponse);
    if (id && courseId) {
      console.log('bothidncou');
      SetCourseDetail(CoursesDetailResponse?.value?.track?.children[0]);
      if (CoursesDetailResponse?.value?.track?.children[0]?.track_chapters) {
        getPositionedChapters(
          CoursesDetailResponse?.value?.track?.children[0].track_chapters,
          CoursesDetailResponse?.value?.track?.children[0].id
        );
      }
    } else if (id && !courseId) {
      console.log('onlyiddd');
      SetCourseDetail(CoursesDetailResponse?.value?.track);
      if (
        CoursesDetailResponse?.value?.track?.children &&
        CoursesDetailResponse?.value?.track?.children?.length > 0
      ) {
        console.log('idandchildren');
        getPositionedChildren(
          CoursesDetailResponse?.value?.track?.children,
          CoursesDetailResponse?.value?.track?.id
        );
      } else if (
        CoursesDetailResponse?.value?.track?.track_chapters &&
        CoursesDetailResponse?.value?.track?.track_chapters.length > 0
      ) {
        console.log('idandchapters');
        getPositionedChapters(
          CoursesDetailResponse?.value?.track?.track_chapters,
          CoursesDetailResponse?.value?.track?.id
        );
      }
    }
    setViewButton(CoursesDetailResponse?.value?.userTrack);

  };

  useEffect(() => {
    getCourseDetail();
  }, [id, courseId]);

  const onJoinCourse = async (id) => {
    // setIsDisabled(true);
    const joinCourseResponse = await apiRequest(
      `api/batches/user_tracks/join/track/${id}`,
      'POST'
    );
    console.log("rrrrrrrr", joinCourseResponse);
    if (joinCourseResponse?.status === 'success') {
      toast('You have successfully enrolled to this course');
      setViewButton(false);
      getCourseDetail();
    }
  };
  const handlecourseclick = (courseid) => {
    router.navigate(`/app/browse/${id}/course/${courseid}`);
  };

  const getPositionedChildren = async (children, id) => {
    let cou = JSON.parse(JSON.stringify(children));
    let couId = id;
    // let a = [],
    // b = [];
    console.log('yyyyyyyyyy', cou);
    for (const i of cou) {
      console.log('eeeeeeeeee', i);
      console.log(
        'dddddddd',
        Array.isArray(JSON.parse(i['position'])),
        typeof i['position'],
        JSON.parse(i['position'])
      );
      JSON.parse(i['position'])?.forEach((x) => {
        // console.log("sssssss",Object.keys(x))
        Object.keys(x).find((y) => {
          // console.log("ooooooo", y === couId)
          if (y === couId) {
            i['position'] = x[y];
            // a.push(i);
          }
        });
      });
      if (i && i.track_chapters) {
        for (const j of i.track_chapters) {
          // console.log('gggggggggggg', j);
          if (j && j.chapter_topics) {
            for (const k of j.chapter_topics) {
              console.log('__________', k, j.chapter_topics);
              console.log(
                'kkkkkkkkkkk',
                Array.isArray(JSON.parse(k['position'])),
                typeof k['position'],
                JSON.parse(k['position'])
              );
              JSON.parse(k['position'])?.forEach((x) => {
                // console.log("ttttttt", Object.keys(x))
                Object.keys(x).find((y) => {
                  // console.log("kkkkk", y === j.id)
                  if (y === j.id) {
                    k['position'] = x[y];
                    // b.push(j);
                  }
                });
              });
            }
          }
          JSON.parse(j['position']).forEach((x) => {
            // console.log("ttttttt", Object.keys(x))
            Object.keys(x).find((y) => {
              // console.log("kkkkk", y === j.id)
              if (y === i.id) {
                j['position'] = x[y];
                // b.push(j);
              }
            });
          });
        }
      }
    }

    console.log('1111111111111111111', cou);
    setModifiedChild(cou);
    // return cou;
  };

  const getPositionedChapters = async (chapters, id) => {
    let cou = JSON.parse(JSON.stringify(chapters));
    let couId = id;
    let a = [],
      b = [];
    console.log('yyyyyyyyyy', cou);
    for (const i of cou) {
      console.log('eeeeeeeeee', i);
      console.log(
        'dddddddd',
        Array.isArray(JSON.parse(i['position'])),
        typeof i['position'],
        JSON.parse(i['position'])
      );
      JSON.parse(i['position'])?.forEach((x) => {
        // console.log("sssssss",Object.keys(x))
        Object.keys(x).find((y) => {
          // console.log("ooooooo", y === couId)
          if (y === couId) {
            i['position'] = x[y];
            a.push(i);
          }
        });
      });
      if (i && i.chapter_topics) {
        for (const j of i.chapter_topics) {
          console.log('gggggggggggg', j);
          JSON.parse(j['position'])?.forEach((x) => {
            // console.log("ttttttt", Object.keys(x))
            Object.keys(x).find((y) => {
              // console.log("kkkkk", y === j.id)
              if (y === i.id) {
                j['position'] = x[y];
                b.push(j);
              }
            });
          });
        }
      }
    }

    console.log('1111111111111111111', cou);
    setModifiedChap(cou);
    // return cou;
  };

  const toggleFullscreen = () => {
    const docViewerContainer = document.querySelector('.pdf-css'); // Replace with the appropriate selector
  
    if (docViewerContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        docViewerContainer.requestFullscreen()
          .catch(error => {
            console.error('Error toggling fullscreen:', error);
          });
      }
    }
  };

  
  return (
    <>
      <Box className="cbrief mb-5">
        {CourseDetail && (
          <section>
            <Container className="px-xl-4 py-xl-2">
              <Row className="px-xl-2">
                <Col md={12}>
                  <div ref={viewerRef}>
                    {!videoState.open && !pdfState.open && (
                      <Box className="mt-4 position-relative">
                        <img src="assets/images/48 2.png" className="w-100" />
                        <h3 className="title-course px-xl-5">
                          {CourseDetail?.title}
                        </h3>
                      </Box>
                    )}
                    {videoState.open && (
                      <>
                        <h3 className="top-tit">{videoState.title}</h3>
                        <VideoModal renderElement={'div'} url={videoState?.url} />
                      </>
                    )}
                    {pdfState.open && (
                      <>
                        <h3 className="top-tit">{pdfState.title}</h3>
                        {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"> */}
                          <div className="pdf-css">
                            {pdfState.url != null ? (
                              // <Viewer
                              //   fileUrl={pdfState.url}
                              //   plugins={[
                              //     defaultLayoutPluginInstance
                              //   ]}
                              //   defaultScale={1.0}
                              //   initialPage={currentPage}
                              //   onPageChange={(page) => setCurrentPage(page)}
                              // />
                              <DocModal docState={pdfState}setdocState={setPdfState} />
                          ) : 
                          <h2 style={{textAlign:'center',color:'red'}}>No pdf found for this topic</h2>} 
                          </div>
                        {/* </Worker> */}
                      </>
                    )}
                    {pdfState.open && (
                      <div className="d-flex  mt-4 pt-3">
                        <Button
                          variant="outline-primary"
                          className="expand-btn px-4"
                          onClick={toggleFullscreen}
                        >
                          <ExpandIcon /> &nbsp;&nbsp;&nbsp;Expand
                        </Button>
                        <ButtonComponent
                          name="Mark as completed"
                          className="cmp-btn px-4 py-0"
                        />
                      </div>
                    )}
                  </div>

                  <Box className="">
                    <HeaderWithButton
                      title="Course Overview"
                      titleclass="hwb-view"
                      btnText="Join Course"
                      routeTo="Join Course"
                      btnClass="cbjoin px-4"
                      isButtonVisible={
                        viewButton == null && !courseId ? true : false
                      }
                      // isDisabled={isDisabled}
                      handleButtonClick={() => {
                        onJoinCourse(CourseDetail?.id);
                      }}
                    />

                    <p className="overview-txt mt-2 mb-4">
                      {CourseDetail?.blurb}
                    </p>
                  </Box>
                  <HeaderComponent title="Prerequisites" titleclass="hwb-view" />
                  <Box className="mt-2 mb-4">
                    <ul>
                      <li className="prerequis-list mb-2">
                        <TickCircle />
                        &nbsp;&nbsp;{CourseDetail?.prerequisites}
                      </li>
                      {/* <li className="prerequis-list mb-2">
                      <TickCircle />
                      &nbsp;&nbsp;CSS
                    </li> */}
                    </ul>
                  </Box>
                  {CourseDetail?.children?.length > 0 ? (
                    <>
                      <HeaderComponent
                        title="Table Content"
                        titleclass="hwb-view"
                      />
                      <Row xxl={6} xl={5} lg={4} md={3} sm={1} className="g-4">
                        {modifiedChild?.map((course) => (
                          <Col key={course.id} className="px-1">
                            <BrowseCourseCardView
                              cardContents={course}
                              clickEvent={() => {
                                handlecourseclick(course.id);
                              }}
                              browsecourse={true}
                              cardclass="p-2 rounded-3"
                              course={course}
                              chapterlength={course?.chaptersCount}
                              topiclength={course?.topicsCount}
                              courseDuration={course?.totalCourseDuration}
                            />
                          </Col>
                        ))}
                      </Row>
                    </>
                  ) : (
                    <>
                      <HeaderComponent title="Technology" titleclass="hwb-view" />
                      <Box className="mt-3 mb-4">
                        <Span className="tech-text px-2 py-2">
                          {CourseDetail?.technology_skill_track?.name}
                        </Span>{' '}
                        {/* <Span className="tech-text px-2 py-2 ms-3">Jquery</Span>{' '} */}
                      </Box>{' '}
                      <HeaderComponent title="Content" titleclass="hwb-view" />
                      <CourseContent
                        chapters={modifiedChap}
                        viewerRef={viewerRef}
                        viewButton={viewButton}
                        setPdfState={setPdfState}
                        setvideoState={setVideoState}
                      />
                    </>
                  )}
                </Col>{' '}
              </Row>{' '}
            </Container>{' '}
          </section>
        )}
      </Box>
    </>
  );
};
export default CourseBrief;
