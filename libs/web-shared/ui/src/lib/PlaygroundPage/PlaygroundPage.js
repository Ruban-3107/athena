import './PlaygroundPage.css';
import { useState, useEffect } from 'react';
import {
  Box,
  Editor,
  LeftArrow,
  RunIcon,
  MarkdownData as Instruction,
  Loader,
  TestCaseLoader,
} from '@athena/web-shared/ui';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  apiRequest,
  useParams,
  useRouter,
  useAuth,
  getFilteredbyStatus,
} from '@athena/web-shared/utils';

export function PlaygroundPage() {
  const params = useParams();
  const auth = useAuth();
  const router = useRouter();
  const { id } = params;
  const [exercise, setexercise] = useState(null);
  const [editorValues, seteditorValues] = useState('');
  const [loader, setloader] = useState(true);
  const [dataForRunTest, setDataForRunTest] = useState(null);
  const [activeTab, setActiveTab] = useState('instructions');
  const [isDisabled, setIsDisabled] = useState(false);
  const [resultLoader, setResultLoader] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [fileSubmitResult, setFileSubmitResult] = useState(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [testResultValue, setTestResultValue] = useState(null);

  useEffect(() => {
    if (id && auth && auth.user) {
      getOngingExercise();
    }
    // let timer = setTimeout(() => setloader(false), 2000);
    // return () => {
    //   clearTimeout(timer);
    // };
  }, [auth]);

  const getOngingExercise = async () => {
    const ongoingExerciseResponse = await apiRequest(
      // `api/courses/exercise/${auth && auth.user ? 'mine' : 'guest'}/${id}`
      `api/courses/exercise/mine/${id}`
    );
    setloader(false);
    setexercise(ongoingExerciseResponse);
  };

  useEffect(() => {
    if (exercise && exercise.solutionFiles) {
      seteditorValues(Object.values(exercise.solutionFiles)[0]);
    }
    if (
      exercise &&
      exercise.solution &&
      exercise.solution.uuid &&
      exercise.submission &&
      exercise.submission.uuid &&
      !isTestRunning
    ) {
      checkExistingResults(exercise.solution.uuid, exercise.submission.uuid);
    }
  }, [exercise]);

  const checkExistingResults = async (solutionId, SubmisionId) => {
    setIsDisabled(true);
    setResultLoader(true);
    // setTestResult(null);
    const exististingResultResponse = await apiRequest(
      `api/courses/solutions/${solutionId}/submissions/${SubmisionId}/runtest`
    );
    if (exististingResultResponse) {
      setActiveTab('result');
      setResultLoader(false);
      setTestResult(exististingResultResponse);
      if (exististingResultResponse['status'] === 'pass') {
        setIsSubmitDisabled(false);
      }
    } else {
      setActiveTab('instructions');
      setTestResult(null);
      setResultLoader(false);
      setIsSubmitDisabled(true);
    }
  };

  useEffect(() => {
    if (dataForRunTest && exercise) {
      const interval = setInterval(() => {
        getTestResults(dataForRunTest, exercise);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dataForRunTest]);

  const getTestResults = async (dataForRunTest, exercise) => {
    if (dataForRunTest && exercise) {
      const testResultResponse = await apiRequest(
        `api/courses/solutions/${exercise.solution.uuid}/submissions/${dataForRunTest.uuid}/runtest`
      );
      if (testResultResponse) {
        setResultLoader(false);
        setDataForRunTest(null);
        setTestResult(testResultResponse);
        setTestResultValue(testResultResponse);
        if (testResultResponse['status'] == 'pass') {
          setIsSubmitDisabled(false);
        }
      } else {
        setIsEmptyResult(true);
      }
      // setTimeout(() => {
      //   setTestResult(testResultResponse ? testResultResponse : null);
      //   setDataForRunTest(null);
      //   setResultLoader(false);
      //   setIsDisabled(false);
      // }, 120000);
    }
  };

  useEffect(() => {
    if (isEmptyResult) {
      const timer = setTimeout(() => {
        setTestResult(testResultValue ? testResultValue : null);
        setDataForRunTest(null);
        setResultLoader(false);
        setIsDisabled(false);
        setIsEmptyResult(false);
      }, 120000);
      return () => clearTimeout(timer);
    }
  }, [isEmptyResult]);

  const OnEditerInputChanges = (value) => {
    if (value) {
      seteditorValues(value);
      if (resultLoader) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
      setIsSubmitDisabled(true);
    } else {
      seteditorValues('');
      setIsDisabled(true);
      setIsSubmitDisabled(true);
    }
  };

  const handleEditorSubmit = async () => {
    if (editorValues) {
      setDataForRunTest(null);
      setIsDisabled(true);
      setActiveTab('result');
      setResultLoader(true);
      setTestResult(null);
      let data = {
        solution_id: exercise.solution.uuid,
        exercise_id: exercise.exercise.id,
        slug: exercise.exercise.slug,
        files: [
          {
            filename: Object.keys(exercise?.solutionFiles)[0],
            filecontent: editorValues,
          },
        ],
      };
      const submitResponse = await apiRequest(
        `api/courses/solutions/${exercise.solution.uuid}/submissions`,
        'POST',
        data
      );
      if (submitResponse) {
        setDataForRunTest(submitResponse);
        setFileSubmitResult(submitResponse);
        getOngingExercise();
        setIsTestRunning(true);
      } else {
        setDataForRunTest(null);
        setFileSubmitResult(null);
      }
    }
  };

  const OnClickSubmit = async () => {
    // try {
    setIsSubmitDisabled(true);
    // setResultLoader(true);
    const submitResponse = await apiRequest(
      `api/courses/solutions/${exercise.solution.uuid}/submissions/${
        fileSubmitResult && fileSubmitResult.uuid
          ? fileSubmitResult.uuid
          : exercise.submission.uuid
      }/submit`
    );
    console.log('ssssssss', submitResponse);
    if (submitResponse) {
      // setResultLoader(false);
      toast('You have successfully Submitted', {
        onClose: () =>
          router.navigate(`/app/browse/${exercise.exercise.track_id}`),
      });

      // setTimeout(() => {

      // }, 0);
    } else {
      toast('Something went wrong, Please try after sometimes');
      setIsSubmitDisabled(false);
    }
    // } catch (err) {
    //   if (dataForRunTest)
    //   setIsSubmitDisabled(false);
    //   setResultLoader(false);
    //   toast("Please try Again");
    // }
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {exercise ? (
            <Box id="page-editor">
              <Box className="editor-header">
                <LinkContainer to={`/app/browse/${exercise.exercise.track_id}`}>
                  <a className="close-btn">
                    <LeftArrow /> &nbsp; Back to challenges
                  </a>
                </LinkContainer>
                <div className="title">
                  <div className="track">{exercise?.track?.title}</div>
                  <div className="divider">/</div>
                  <div className="exercise">{exercise?.exercise.title}</div>
                </div>
                <Box className="options"></Box>
              </Box>
              <Box className="split-pane">
                <Box className="--split-lhs">
                  <div className="tabs">
                    <Box className="c-tab">
                      {Object.keys(exercise?.solutionFiles)[0]}
                    </Box>
                  </div>
                  <Editor
                    value={editorValues}
                    language={exercise?.track?.slug}
                    valueChanges={(value) => OnEditerInputChanges(value)}
                    isEditable={!resultLoader}
                  />
                  <footer className="lhs-footer gap-3">
                    <Button
                      variant="dark"
                      className="btn-shadow f-600"
                      onClick={() => {
                        handleEditorSubmit();
                      }}
                      disabled={isDisabled}
                    >
                      <RunIcon /> &nbsp; Run Tests
                    </Button>
                    <Button
                      disabled={isSubmitDisabled}
                      variant="gray-light"
                      className="f-600 enhanced"
                      onClick={() => {
                        OnClickSubmit();
                      }}
                    >
                      Submit
                    </Button>
                  </footer>
                </Box>
                <Box className="--split-rhs py-3">
                  <Tabs
                    defaultActiveKey="instructions"
                    activeKey={activeTab}
                    onSelect={(k) => {
                      if (k === 'result') {
                        if ((testResult && testResult.tests) || resultLoader) {
                          setActiveTab(k);
                        }
                      }
                      // if (k == "instructions" && !resultLoader) {
                      else setActiveTab(k);
                      // }
                    }}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab
                      eventKey="instructions"
                      title="Instructions"
                      className="px-3"
                    >
                      {/* <hr className="m-0" /> */}
                      {exercise?.instructionFiles?.introduction && (
                        <Instruction
                          data={exercise?.instructionFiles?.introduction}
                          className="ply-tc"
                        />
                      )}
                      {exercise?.instructionFiles?.instructions && (
                        <Instruction
                          data={exercise?.instructionFiles?.instructions}
                          className="ply-tc"
                        />
                      )}
                      {exercise?.instructionFiles?.hints && (
                        <Instruction
                          data={exercise?.instructionFiles?.hints}
                          className="ply-tc"
                        />
                      )}
                    </Tab>
                    {/* <Tab eventKey="test" title="Test">
                      <Box className='case-status failed px-3 py-2'><p className='m-0'>{respData.data.tests.tests[0]["status"]}</p></Box>
                      <Instruction
                        data={respData.data.tests.tests[0]["message"]}
                        className="ply-tc px-3"
                      />
                    </Tab> */}
                    <Tab eventKey="result" title="Results" className="results">
                      {resultLoader ? (
                        <Box className="p-3">
                          <TestCaseLoader />
                        </Box>
                      ) : (
                        <>
                          {testResult?.tests?.tests?.length ? (
                            <>
                              {/* <Box className="case-status failed px-3 py-2">
                                <p className="m-0">
                                  {respData.data.tests.tests[0]["status"]}
                                </p>
                              </Box>
                              <Instruction
                                data={respData.data.tests.tests[0]["message"]}
                                className="ply-tc px-3"
                              /> */}
                              {/* for failed add class failed instead of success */}
                              <Box
                                className={`case-status ${
                                  testResult.tests.status === 'fail'
                                    ? 'failed'
                                    : 'success'
                                } px-3 py-2`}
                              >
                                <p>
                                  {getFilteredbyStatus(
                                    testResult.tests.tests,
                                    'fail'
                                  ).length ===
                                  testResult?.tests?.tests.length ? (
                                    `${testResult?.tests?.tests?.length} TEST FAILURE`
                                  ) : testResult.tests.status === 'pass' ? (
                                    getFilteredbyStatus(
                                      testResult.tests.tests,
                                      'pass'
                                    ).length > 1 ? (
                                      'ALL TESTS PASSES'
                                    ) : (
                                      'ALL TEST PASSES'
                                    )
                                  ) : (
                                    <>
                                      {testResult &&
                                      testResult.tests &&
                                      testResult.tests.tests &&
                                      testResult.tests.tests.length
                                        ? getFilteredbyStatus(
                                            testResult.tests.tests,
                                            'fail'
                                          ).length
                                        : 0}{' '}
                                      /{' '}
                                      {testResult &&
                                      testResult.tests &&
                                      testResult.tests.tests &&
                                      testResult.tests.tests.length
                                        ? Object.keys(testResult.tests.tests)
                                            .length
                                        : 0}{' '}
                                      {getFilteredbyStatus(
                                        testResult.tests.tests,
                                        'fail'
                                      ).length > 1
                                        ? 'TESTS FAILED'
                                        : 'TEST FAILED'}
                                    </>
                                  )}
                                </p>
                              </Box>
                              <Box className="p-3 noselect ">
                                <details className="tests-group c-details">
                                  <summary className="tests-group-summary">
                                    <div className="--summary-inner">
                                      {/* for failed <img src="https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/failed-check-circle-d316a5ef96f33f51765c3b64eaa25b7472c68358.svg" alt="" role="presentation" className="c-icon indicator"/> */}
                                      <img
                                        src={
                                          testResult.tests.status === 'fail'
                                            ? 'https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/failed-check-circle-d316a5ef96f33f51765c3b64eaa25b7472c68358.svg'
                                            : 'assets/images/passed.svg'
                                        }
                                        alt=""
                                        role="presentation"
                                        className="c-icon indicator"
                                      />{' '}
                                      {getFilteredbyStatus(
                                        testResult.tests.tests,
                                        'fail'
                                      ).length ===
                                      testResult?.tests?.tests.length ? (
                                        `${testResult?.tests?.tests?.length} TEST FAILURE`
                                      ) : testResult.tests.status === 'pass' ? (
                                        getFilteredbyStatus(
                                          testResult.tests.tests,
                                          'pass'
                                        ).length > 1 ? (
                                          'ALL TESTS PASSES'
                                        ) : (
                                          'ALL TEST PASSES'
                                        )
                                      ) : (
                                        <>
                                          {testResult &&
                                          testResult.tests &&
                                          testResult.tests.tests &&
                                          testResult.tests.tests.length
                                            ? getFilteredbyStatus(
                                                testResult.tests.tests,
                                                'fail'
                                              ).length
                                            : 0}{' '}
                                          /{' '}
                                          {testResult &&
                                          testResult.tests &&
                                          testResult.tests.tests &&
                                          testResult.tests.tests.length
                                            ? Object.keys(
                                                testResult.tests.tests
                                              ).length
                                            : 0}{' '}
                                          {getFilteredbyStatus(
                                            testResult.tests.tests,
                                            'fail'
                                          ).length > 1
                                            ? 'TESTS FAILED'
                                            : 'TEST FAILED'}
                                        </>
                                      )}
                                      <img
                                        src="https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/chevron-right-4edf20ec1116acf2e371e8ff03809451274a7b32.svg"
                                        alt=""
                                        role="presentation"
                                        className="c-icon --closed-icon"
                                      />
                                      <img
                                        src="https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/chevron-down-5ae28e42ee217bae38f4eb1c119cafd0301dd5f6.svg"
                                        alt=""
                                        role="presentation"
                                        className="c-icon --open-icon"
                                      />
                                    </div>
                                  </summary>
                                  {/* add class fail instead of pass for failed status in below tag */}
                                  {testResult?.tests?.tests?.length
                                    ? testResult.tests.tests.map(
                                        (test, index) => (
                                          <details
                                            className={`c-details c-test-summary ${
                                              test.status === 'fail'
                                                ? 'fail'
                                                : 'pass'
                                            }`}
                                            key={index}
                                          >
                                            <summary className="--summary">
                                              <div className="--summary-inner">
                                                <div className="--status">
                                                  <div className="--dot"></div>
                                                  <span>
                                                    {test.status === 'fail'
                                                      ? 'failed'
                                                      : 'Passed'}
                                                  </span>
                                                </div>
                                                <div className="--summary-details">
                                                  <div className="--summary-idx">
                                                    Test {index + 1}
                                                  </div>
                                                  <div className="--summary-name">
                                                    {/* Hello World &gt; Say Hi! */}
                                                    {test.name}
                                                  </div>
                                                </div>
                                                <img
                                                  src="https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/chevron-right-4edf20ec1116acf2e371e8ff03809451274a7b32.svg"
                                                  alt=""
                                                  role="presentation"
                                                  className="c-icon --closed-icon"
                                                />
                                                <img
                                                  src="https://d24y9kuxp2d7l2.cloudfront.net/assets/icons/chevron-down-5ae28e42ee217bae38f4eb1c119cafd0301dd5f6.svg"
                                                  alt=""
                                                  role="presentation"
                                                  className="c-icon --open-icon"
                                                />
                                              </div>
                                            </summary>
                                            <div className="--explanation">
                                              <div className="--info">
                                                <h3>Code Run</h3>
                                                <pre>
                                                  <code
                                                    className="javascript hljs language-javascript"
                                                    data-highlighted="true"
                                                  >
                                                    {/* <Instruction
                                                    data={test.test_code}
                                                    className="ply-tc px-3"
                                                  /> */}
                                                    <span className="hljs-title function_">
                                                      {test.test_code}
                                                    </span>
                                                    {/* <span className="hljs-title function_">
                                                    expect
                                                  </span>
                                                  (
                                                  <span className="hljs-title function_">
                                                    hello
                                                  </span>
                                                  ()).
                                                  <span className="hljs-title function_">
                                                    toEqual
                                                  </span>
                                                  (
                                                  <span className="hljs-string">
                                                    'Hello, World!'
                                                  </span>
                                                  ); */}
                                                  </code>
                                                </pre>
                                              </div>
                                              {test.status === 'fail' &&
                                              test.message ? (
                                                <div className="--info">
                                                  <h3>Test Failure</h3>
                                                  <pre>
                                                    <code
                                                      className="javascript hljs language-javascript"
                                                      data-highlighted="true"
                                                    >
                                                      <Instruction
                                                        data={test.message}
                                                        className="ply-tc"
                                                      />
                                                      {/* <span className="hljs-title function_">
                                                      {test.test_code}
                                                    </span> */}
                                                      {/* <span className="hljs-title function_">
                                                    expect
                                                  </span>
                                                  (
                                                  <span className="hljs-title function_">
                                                    hello
                                                  </span>
                                                  ()).
                                                  <span className="hljs-title function_">
                                                    toEqual
                                                  </span>
                                                  (
                                                  <span className="hljs-string">
                                                    'Hello, World!'
                                                  </span>
                                                  ); */}
                                                    </code>
                                                  </pre>
                                                </div>
                                              ) : null}
                                            </div>
                                          </details>
                                        )
                                      )
                                    : null}
                                </details>
                              </Box>
                            </>
                          ) : (
                            <>
                              {testResult &&
                              testResult.tests &&
                              testResult.tests.status === 'error' ? (
                                <>
                                  <Box className="case-status failed px-3 py-2">
                                    <p>AN ERROR OCCURRED</p>
                                  </Box>
                                  {testResult.tests.message ? (
                                    <div className="--info">
                                      <h5>
                                        We received the following error when we
                                        ran your code:
                                      </h5>
                                      <pre className="pt-1">
                                        <code
                                          dangerouslySetInnerHTML={{
                                            __html: testResult.tests.message,
                                          }}
                                        />
                                        {/* <code
                                          className="javascript hljs language-javascript"
                                          data-highlighted="true"
                                        >
                                          <span className="hljs-title function_">
                                            {testResult.tests.message}
                                          </span> */}
                                        {/* <Instruction
                                            data={testResult.tests.message}
                                            className="ply-tc"
                                          /> */}
                                        {/* <span className="hljs-title function_">
                                                      {test.test_code}
                                                    </span> */}
                                        {/* <span className="hljs-title function_">
                                                    expect
                                                  </span>
                                                  (
                                                  <span className="hljs-title function_">
                                                    hello
                                                  </span>
                                                  ()).
                                                  <span className="hljs-title function_">
                                                    toEqual
                                                  </span>
                                                  (
                                                  <span className="hljs-string">
                                                    'Hello, World!'
                                                  </span>
                                                  ); */}
                                        {/* </code>ss */}
                                      </pre>
                                    </div>
                                  ) : (
                                    <div className="--info">
                                      <p className="mt-3">
                                        OOPS..! Something went wrong. Please try
                                        after sometimes.
                                      </p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Box className="py-5 text-center">
                                  <img
                                    src="assets/images/no-data.svg"
                                    style={{ width: '200px' }}
                                  />
                                  <p className="mt-3">No results found</p>
                                </Box>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Tab>
                  </Tabs>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              <Box id="page-editor">
                <Box className="editor-header">
                  <LinkContainer to="/">
                    <a className="close-btn">
                      <LeftArrow /> &nbsp; Back
                    </a>
                  </LinkContainer>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
}

export default PlaygroundPage;

