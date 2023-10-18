import './ChatGPT.css';
import { apiRequest, requireAuth } from '@athena/web-shared/utils';
import { useState, useRef, useEffect } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '@athena/web-shared/utils';
import { ChatBotIcon, ChatBotCloseIcon, UserProfilePictureicon } from '@athena/web-shared/ui';
import { MarkdownData as Instruction, Span } from '@athena/web-shared/ui';


export const ChatGPT = (props) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState([]);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputvalue, setInputValue] = useState('');
  const bottomRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, response]);

  const resetState = () => {
    setPrompt('');
    setResponse([]);
    setPending(false);
    setMessages([]);
  };

  const handleClose = () => {
    resetState();
    // any other close actions, e.g. close the modal, etc.
  };

  const auth = useAuth();
  console.log(auth, "auth");
  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("tempppppppppppp", prompt)
    setMessages([...messages, prompt]);
    setInputValue(prompt);
    let data1;
    data1 = { question: prompt };
    console.log(messages, "messages");
    console.log(prompt, "messagesprompt");

    console.log("tempppppppppppp123", data1)
    setPending(true);
    let res = await apiRequest('api/bot/botQuestionsAnswers', 'post', data1);
   console.log(res,"ressssssssssssssssssssssssssssssssssssssssss");
    if (res?.value && res?.value?.length > 0) {

      setResponse([...response, { message: prompt, response: res?.value }]);
    } else if (res?.value && typeof (res?.value) == "object") {
      setResponse([...response, { message: prompt, response: res?.value?.answer ? res?.value?.answer : res?.value }]);
    }

    setPending(false);


    setPrompt('');
  };
  const onClickButton = async (e, action) => {

    console.log("tempppppppppppp", e, action)
    setMessages([...messages, e]);
    let data1;
    if (action === "skip") {
      data1 = { questionToBot: e }
      console.log(data1, "data1");
    } else {
      data1 = { questionButton: e };
    }
    setPending(true);
    let res = await apiRequest('api/bot/botQuestionsAnswers', 'post', data1);
    if (res?.value && typeof (res?.value) == "string") {
      setResponse([...response, { message: e, response: res.value }]);
    } else {
      setResponse([...response, { message: e, response: res.value.answer }]);
    }
    setPending(false);
    setPrompt('');
  }

  console.log(response, "handleres");

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };



  return (
    <>

      <Container style={{ maxHeight: '100vh' }}>
        <div className='d-flex mb-4 ms-auto closehandle' onClick={() => handleClose()}>
          <ChatBotCloseIcon />
        </div>

        <div className="modal-dialo chatDialo" role="document">
          <div className="modal-body" >
            <Row className=' mb-4 d-flex align-items-center' >
              <Col lg={1} className='chatbot round-circle' >
                <div class="round-shape">
                  <ChatBotIcon />
                </div>
              </Col>
              <Col class="media mr-auto shadow ms-2" lg={10}>

                <div class="media-body h-100">
                  <div class="bg-white py-2 px-3 mb-2 boxshadow">
                    {console.log(auth?.user?.name, "nameeeeeeeeeeeeee")}
                    <Instruction data={`Hi, ${toTitleCase(auth?.user?.name)} what can i do for you?`} />
                  </div>
                </div>
              </Col>
              <Col lg={1}></Col>
            </Row>
            {console.log("messssssss", messages, "messssssssreeeeee", response)}
            {response.map((res, index) => (
              <>
                <Row class="media mb-3  d-flex align-items-center " >
                  <Col lg={1}></Col>
                  <Col lg={10} class="media-body ml-3 shadow">
                    <div class="bg-white px-2 py-2 boxshadow" style={{ width: 'fit-content', marginLeft: 'auto' }}>
                      <p class="text-small mb-0 text-muted">{res.message}</p>
                    </div>
                  </Col>
                  <Col lg={1} className=''>
                    <UserProfilePictureicon
                      firstLetter={`${toTitleCase(auth?.user?.name)} ${toTitleCase(
                        auth?.user?.name
                      )}`
                        .toString()
                        .charAt(0)
                        .toUpperCase()} color={`rgba(64, 169, 255, 0.5)`} />
                  </Col>

                </Row>
                <Row className=' d-flex  mt-4 mb-4' >

                  <Col lg={1} className=' rounded-circle '>
                    <div class="round-shape">
                      {console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")}
                      <ChatBotIcon />
                    </div>

                  </Col>
                  {console.log(res,"inputres")}
                  {typeof (res.response) === 'string' ? (
                    <Col lg={10} class="media mr-auto mb-3 shadow">
                      <div class="media-body boxshadow ">

                        <div class="bg-white px-2 py-2  rounded-circle d-flex flex-column" >

                          <Instruction data={res.response} />
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <Col lg={10} class="media mr-auto mb-3 ms-2  shadow">
                      <div class="media-body boxshadow" style={{ width: 'fit-content' }}>
                        <div class="">
                          <p>Are you looking for..?</p>
                        </div>

                        <div class="bg-white px-2 py-2 rounded-circle d-flex flex-column" >
                          {res.response.map((e, index) => (
                            <button
                              key={`button-${index}`}
                              className=" suggest mb-2"
                              onClick={(event) => {
                                event.preventDefault();
                                onClickButton(e, index)
                              }}
                            >
                              <Instruction data={e} />
                            </button>
                          ))}
                          <button key={`skip-button-${index}`}
                            className='  mt-2 skip-sugest'
                            onClick={(event) => {
                              event.preventDefault();
                              onClickButton(inputvalue, "skip", index)
                            }} >
                            skip suggestions
                          </button>

                        </div>
                      </div>
                    </Col>)
                  }



                  <div ref={bottomRef}></div>

                </Row>

              </>
            ))}
          </div>
        </div>




        <Row className='px-0'>
          <Col lg={1}></Col>
          <Col lg={10} className="input-gro">
            <form className="bg-light chatFormInput" onSubmit={handleSubmit} >
              <input type="text" aria-describedby="button-addon2" class="form-control py-4" value={prompt}

                onChange={(e) => setPrompt(e.target.value)} />
            </form>
          </Col>

          < Col lg={1} className="input-group-append ">

            <button id="button-addon2" variant="outline-light" onClick={handleSubmit} type="submit" className="px-3 rounded-pill border-0" style={{ boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)' }} disabled={pending}>
              {pending ? (
                <Span className=" d-flex justify-content-center">
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden={true}
                    className="align-baseline spinner"
                  >
                    <span className="sr-only">Loading</span>{' '}
                  </Spinner>

                </Span>
              ) :
                <i class="fa fa-paper-plane" style={{ color: "blue" }}></i>
              }
            </button>


          </Col>

        </Row>



      </Container >

    </>
  );
}
export default requireAuth(ChatGPT);
