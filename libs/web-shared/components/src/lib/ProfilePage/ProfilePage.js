import './ProfilePage.css';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ButtonToolbar,
  ButtonGroup,
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { apiRequest, useParams, useAuth, education } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   WelcomeBackComponent,
//   QuickLinksLearner,
//   QuickLinksTrainer,
// } from '@athena/web-shared/components';
import Spinner from 'react-bootstrap/Spinner';
import {
  Box,
  Span,
  FormField,
  HeaderComponent,
  CardBox,
  ProfileData,
  IndustryCertificate,
  SkillSet,
  EmploymentHistory,
  Avatar,
  Reactdropzone,
  HeaderProfile
} from '@athena/web-shared/ui';
import Select from 'react-select';


// const schema = yup.object().shape({
//   about_me: yup.string().max(255).required('About me is required'),
//   education: yup
//     .object()
//     .shape({
//       name: yup.string().required('Qualification is required'),
//     })
//     .nullable() // for handling null value when clearing options via clicking "x"
//     .required('Qualification is required'),
// });

export function ProfilePage(props) {
  // const userData = localStorage.getItem('userData')
  //   ? JSON.parse(localStorage.getItem('userData'))
  //   : null;
  const auth = useAuth();
  const [profileData, setprofileData] = useState(null);
  const [profileDataEdit, setProfileDataEdit] = useState(false);
  const [aboutMeEdit, setAboutMeEdit] = useState(false);
  const [skillSetEdit, setSkillSetEdit] = useState(false);
  const [existingSkillSet, setExistingSkillSet] = useState([]);
  const [pending, setPending] = useState(false);
  const [inputText, setInputText] = useState({ wordCount: 0 });
  const [wordLimit] = useState(50);
  const [isClearable, setIsClearable] = useState(true);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [selectedValue, setSelectedValue] = useState([]);
  const PersonalDetailsRef = useRef(null);
  const aboutMeRef = useRef(null);
  const industryCertificationsRef = useRef(null);
  const employementHistoryRef = useRef(null);
  const skillSetRef = useRef(null);
  const employmentHistoryRef = useRef(null);
  const params = useParams();
  const { id } = params;
  const [existingFile, setExistingFile] = useState(true);
  const [uploadFileData, setUploadFileData] = useState([]);
  const [errorMsgs, setErrorMsgs] = useState([]);

  console.log('authauthauth::', auth);

  // const education = [
  //   { id: 1, name: 'Doctorate/PhD' },
  //   { id: 2, name: 'Masters/Post-Graduation' },
  //   { id: 3, name: 'Under-Graduation' },
  //   { id: 4, name: '12th/Equivalent' },
  // ];

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm(
  //   {
  //   resolver: yupResolver(schema),
  // }
  );

  const handleEducationChange = (selected) => {
    console.log('SELECTEDEDU:::::::', selected);
    setValue('education', selected);
    setSelectedEducation(selected);
    console.log('selectedEducation::::::::::', selectedEducation);
  };

  const handleEditClick = (value) => {
    if (value === 'Personal details') {
      setProfileDataEdit(true);
    } else if (value === 'About me') {
      setAboutMeEdit(true);
    } else {
      setSkillSetEdit(true);
    }
  };

  const handleProfileCancel = () => {
    setProfileDataEdit(false);
  };

  const handleeventclick = () => {
    setAboutMeEdit(false);
    reset();
    if (profileData) {
      for (const key in profileData) {
        if (key === 'about_me') {
          //   setExistingSkillSet(profileData[key]['users_skillset']);
          //   setSelectedValue(
          //     Array.isArray(profileData[key]['users_skillset'])
          //       ? profileData[key]['users_skillset'].map((x) => x.id)
          //       : []
          //   );
          // } else {
          setValue(key, profileData[key]);
          setInputText({ wordCount: countWords(profileData[key]) });
        }
      }
    }
  };

  const handleskillsetclick = () => {
    setSkillSetEdit(false);
    reset();
    if (
      props.profileData &&
      props.profileData.user &&
      props.profileData.user.users_skillset
    ) {
      // for (const key in props.profileData) {
      //   if (key == 'users_skillset') {
      setExistingSkillSet(props.profileData.user.users_skillset);
      setSelectedValue(
        Array.isArray(props.profileData.user.users_skillset)
          ? props.profileData.user.users_skillset.map((x) => x.id)
          : []
      );
    }
  };

  useEffect(() => {
    if (auth && auth.user) {
      getProfiledata();
    }
  }, [auth]);

  const getProfiledata = async () => {
    const getProfilesetdataResponse = await apiRequest(
      `api/users/profiles/${
        auth?.user
          ? parseInt(auth?.user?.id)
          : props && props.user_id
          ? parseInt(props.user_id)
          : ''
      }`
    );
    setprofileData(getProfilesetdataResponse);
    console.log(getProfilesetdataResponse, 'getProfilesetdataResponse');
  };

  // const getSkillsetdata = async () => {
  //   const getSkillsetdataResponse = await apiRequest('api/users/skillset');
  //   setskillset(getSkillsetdataResponse);
  // };

  const countWords = (count) => {
    if (count?.length === 0) {
      return 0;
    } else {
      count = count?.replace(/(^\s*)|(\s*$)/gi, '');
      count = count?.replace(/[ ]{2,}/gi, ' ');
      count = count?.replace(/\n /, '\n');
      return count?.split(' ').length;
    }
  };

  // event handler
  const handleChange = (event) => {
    // setInputText(event.target.value);
    const count = event.target.value;
    setInputText({ wordCount: countWords(count) });
    setValue('about_me', event.target.value);
  };

  // const handleSkillsetChange = (e) => {
  //   setExistingSkillSet(e);
  //   setSelectedValue(Array.isArray(e) ? e.map((x) => x.id) : []);
  // };

  useEffect(() => {
    if (profileData) {
      for (const key in profileData) {
        if (key === 'about_me') {
          //   setExistingSkillSet(profileData[key]['users_skillset']);
          //   setSelectedValue(
          //     Array.isArray(profileData[key]['users_skillset'])
          //       ? profileData[key]['users_skillset'].map((x) => x.id)
          //       : []
          //   );
          // } else {
          setValue(key, profileData[key]);
          setInputText({ wordCount: countWords(profileData[key]) });
        }
        if (key === 'education') {
          console.log('education', profileData[key]);
          setValue(
            'education',
            education.find((e) => e.name === profileData[key])
          );
          setSelectedEducation(
            education.find((e) => e.name === profileData[key])
          );
        }
      }
    }
  }, [profileData]);

  // useEffect(() => {
  //   if (profileData) {
  //     for (const key in profileData) {
  //       if (key == 'users_skillset') {
  //         setExistingSkillSet(profileData[key]['users_skillset']);
  //         setSelectedValue(
  //           Array.isArray(profileData[key]['users_skillset'])
  //             ? profileData[key]['users_skillset'].map((x) => x.id)
  //             : []
  //         );
  //       }
  //     }
  //   }
  // }, [profileData]);

  useEffect(() => {
    console.log('errors::', errors);
  }, [errors]);

  useEffect(() => {
    if (id === 'personal-details') {
      PersonalDetailsRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    } else if (id === 'about-me') {
      aboutMeRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    } else if (id === 'skill-set') {
      skillSetRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    } else if (id === 'industry-certificate') {
      industryCertificationsRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    } else if (id === 'employment-history') {
      employmentHistoryRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [id]);

  const onSubmit = async (data) => {
    console.log('data', data);
    data['user_id'] = parseInt(auth?.user?.id);
    data['education'] = data['education'] ? data['education']['name'] : null;
    // if (data.years_of_experience === profileData.years_of_experience) {
    //   delete data['years_of_experience'];
    // }
    setPending(true);
    console.log('dataaaaaaaa', data);
    if (profileData) {
      const updateResponse = await apiRequest(
        `api/users/profiles/about_me/${profileData.user_id}`,
        'PUT',
        data
      );
      if (updateResponse) {
        getProfiledata();
        setPending(false);
        setAboutMeEdit(false);
        toast.success(`About Me details updated successfully`);
      } else {
        if (updateResponse.message && Array.isArray(updateResponse.message)) {
          console.log('@@@@@@@@@@');
          setErrorMsgs(updateResponse.message);
        } else {
          toast.error(
            updateResponse.message.message
              ? updateResponse.message.message
              : updateResponse.message
          );
          console.log('############');
        }
      }
      window.scrollTo(0, 0);
    }
  };

  const fileData = (data) => {
    console.log('uplodedData:::::::::::', data[0]);
    setUploadFileData(data);
  };

  const firstLetter = auth?.user?.first_name?.charAt(0).toUpperCase();
  console.log("firstLetterrrrrrrrrr",firstLetter);

  // const avatarStyle = {
  //   width: '30px',
  //   height: '30px',
  //   backgroundColor: '#007bff', // Customize the background color here
  //   color: '#fff',
  //   fontSize: '16px',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: '50%',
  // };

  // `https://place-hold.it/30x30?text=${firstLetter}`

  return (
      <section className="bg-image">
        <Container>
          <Row className="gx-5">
            {/* <Col xl={3}>
            <Box className="sticky-wrapper">
              <WelcomeBackComponent />
              {(auth?.user?.role?.[0]?.["name"] === "Trainer") ? (
                <QuickLinksTrainer profileData={profileData} />
              ) : (
                <QuickLinksLearner profileData={profileData} />
              )}
            </Box>
          </Col> */}
            <Col xl={12} className="p-4">
              <Box className="position-relative mt-5">
                <Box>
                  <Row>
                    <Col xl={3}>
                      <Col>
                        <Span className="d-flex">
                          <Avatar
                            className="image-border img-profilecover align-item-center"
                            src={profileData?.image_url? profileData?.image_url : 'https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?fit=300%2C300'}
                            style="text-bold"
                            alt="db"
                            pending={pending}
                          />
                          {/* {isLoading && (
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          )} */}
                          <Span className="iconset">
                            <Reactdropzone
                              name="profile_image"
                              fileData={fileData}
                              //dropboxclass="dropzone-boxsmalll dropzonewidtth"
                              // userdropzone={userdropzonelabel}
                              existingFile={existingFile}
                              dropboxclass="dropbox-picture"
                              profileData={profileData}
                              getProfiledata={getProfiledata}
                              fileType={'images'}
                            />
                          </Span>
                        </Span>
                        <h5 className="alignment1 text-dark">
                          Profile Picture
                        </h5>
                      </Col>
                    </Col>
                    <Col xl={9}>
                      <div className="details" ref={PersonalDetailsRef}>
                        <HeaderProfile
                          title="Personal Details"
                          subtitle="Information required for basic personal details like name,email"
                          btn="edit"
                          handleEditClick={() => {
                            handleEditClick('Personal details');
                          }}
                        />
                        <CardBox className="align8">
                          <ProfileData
                            profileData={profileData}
                            profileDataEdit={profileDataEdit}
                            handleProfileCancel={handleProfileCancel}
                            getProfiledata={getProfiledata}
                          />
                        </CardBox>
                      </div>
                    </Col>
                  </Row>

                  <div className="details mt-5" ref={aboutMeRef}>
                    <HeaderProfile
                      title="About"
                      subtitle="A little about why I'm here, my background, and motivations I have."
                      btn="edit"
                      handleEditClick={() => {
                        handleEditClick('About me');
                      }}
                    />
                    <CardBox className="align8">
                      <Form
                        onSubmit={handleSubmit(onSubmit)}
                        // className={aboutMeEdit ? 'text-hide' : 'input-hide'}
                      >
                        <Box>
                          <Row>
                            <Col xl={2}>
                              <div className="f-16">Qualification</div>
                            </Col>
                            <Col xl={7}>
                              {aboutMeEdit ? (
                                <Controller
                                  name="education"
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      placeholder="Select"
                                      {...field}
                                      isClearable={isClearable}
                                      hideSelectedOptions={false}
                                      value={selectedEducation}
                                      options={education}
                                      onChange={handleEducationChange}
                                      getOptionLabel={(option) => option.name}
                                      getOptionValue={(option) => option.id}
                                    />
                                  )}
                                />
                              ) : (
                                <Span className="text-grey f-14">
                                  {profileData && profileData.education
                                    ? profileData.education
                                    : '-'}
                                </Span>
                              )}
                              {errors.education &&
                                selectedEducation == null && (
                                  <p className="invalid-feedback">
                                    {errors.education?.message}
                                  </p>
                                )}
                            </Col>
                          </Row>
                        </Box>
                        <br />
                        <Box className="mt-3">
                          {aboutMeEdit ? (
                            <Row>
                              <Col xl={2}>
                                {/* <Form.Group controlId="exampleForm.ControlTextarea1">   */}
                                <div className="f-16">Biography</div>
                              </Col>
                              <Col xl={7}>
                                <FormField
                                  name="about_me"
                                  type={aboutMeEdit ? 'textarea' : 'text'}
                                  rows={6}
                                  error={errors.about_me}
                                  readOnly={aboutMeEdit ? false : true}
                                  inputRef={register('about_me')}
                                  onChange={handleChange}
                                />
                                {/* </Form.Group> */}
                              </Col>
                            </Row>
                          ) : (
                              <Row>
                                <Col xl={2}>
                                  {/* <Form.Group controlId="exampleForm.ControlTextarea1">   */}
                                  <div className="f-16">
                                    Biography
                                  </div>
                                </Col>
                                <Col xl={7}>
                                  <Span className="text-grey f-14">
                                    {profileData && profileData?.about_me
                                      ? profileData?.about_me
                                      : "-"}
                                  </Span>
                                </Col>
                              </Row>
                          )}
                        </Box>
                        {aboutMeEdit ? (
                          <div
                            style={
                              inputText?.wordCount > wordLimit
                                ? { color: '#FF0000' }
                                : { color: '#757575' }
                            }
                            className="font-14 mb-0 mt-2 d-flex justify-content-center"
                          >
                            {`You have reached the ${
                              inputText?.wordCount ?? 0
                            }/${wordLimit} words limit`}
                          </div>
                        ) : (
                          ''
                        )}

                        {errorMsgs && errorMsgs.length
                          ? errorMsgs.map((msg, index) => (
                              <p key={index} style={{ color: 'red' }}>
                                {msg}
                              </p>
                            ))
                          : null}

                        {aboutMeEdit ? (
                          <>
                            <br />
                            <Box className="d-flex justify-content-end mt-3">
                              <Col lg={10} className="btnxprofileUser">
                                <ButtonToolbar aria-label="Toolbar with button groups">
                                  <ButtonGroup
                                    className="me-3"
                                    aria-label="First group"
                                  >
                                    <Button
                                      className="can-btn space1 rounded-4 px-1"
                                      type="button"
                                      onClick={handleeventclick}
                                      variant="outline-primary"
                                    >
                                      Cancel
                                    </Button>
                                  </ButtonGroup>
                                  <ButtonGroup
                                    className="me-0"
                                    aria-label="Second group"
                                  >
                                    <Button
                                      className="saveprofile rounded-4 px-5"
                                      variant="outline-primary"
                                      type="submit"
                                      disabled={pending}
                                    >
                                      {pending ? (
                                        <Span className="d-flex align-items-center justify-content-center">
                                          <Spinner
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden={true}
                                            className="align-baseline"
                                          >
                                            <span className="sr-only"></span>
                                          </Spinner>
                                          &nbsp; Loading...
                                        </Span>
                                      ) : (
                                        <>Submit</>
                                      )}
                                    </Button>
                                  </ButtonGroup>
                                </ButtonToolbar>
                              </Col>
                            </Box>
                          </>
                        ) : (
                          ' '
                        )}
                      </Form>
                    </CardBox>
                  </div>

                  <div className="details mt-5" ref={industryCertificationsRef}>
                    <h5>Industry Certifications</h5>
                    <CardBox className="align8">
                      <IndustryCertificate
                        profileData={profileData}
                        getProfiledata={getProfiledata}
                      />
                    </CardBox>
                  </div>

                  <div className="details mt-5" ref={skillSetRef}>
                    <HeaderProfile
                      title="Skillset"
                      subtitle="A little about my collection of skills ."
                      btn="edit"
                      handleEditClick={() => {
                        handleEditClick('Skill set');
                      }}
                    />
                    <CardBox className="align8">
                      <SkillSet
                        profileData={profileData}
                        skillSetEdit={skillSetEdit}
                        getProfiledata={getProfiledata}
                        handleskillsetclick={handleskillsetclick}
                      />
                    </CardBox>
                  </div>
                  {(auth?.user?.role?.[0]?.["name"] === "Learner") ?
                  <div className="details mt-5" ref={employementHistoryRef}>
                    <h5>Employment History</h5>
                    <CardBox className="align8">
                      <EmploymentHistory
                        profileData={profileData}
                        getProfiledata={getProfiledata}
                      />
                    </CardBox>
                  </div>
                  : null}
                </Box>
              </Box>
            </Col>
          </Row>
        </Container>
      </section>
  );
}
export default ProfilePage;

{
  /* <HeaderComponent
                  title="About me"
                  subtitle="A little about why I'm here, my background, and motivations I have."
                  btn="edit"
                  handleEditClick={() => {
                    handleEditClick('About me');
                  }}
                /> */
}
{
  /* <CardBox className="boxShadow mt-3 mt-md-5">
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className={aboutMeEdit ? 'text-hide' : 'input-hide'}
                  >
                    <Box>
                      <h5 className="f-16 required">
                        Years of experience &nbsp;&nbsp;&nbsp;
                        <InfoIcon />
                      </h5>
                      <FormField
                        name="full_name"
                        type="text"
                        error={errors.full_name}
                        inputRef={register('full_name', {
                          required: 'Please enter a full name',
                        })}
                      />
                      <Span className="text-grey f-14">
                        {"7"}
                      </Span>
                    </Box>
                    <br/>
                    <Box>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <h5 className="f-16 required">
                        Biography &nbsp;&nbsp;&nbsp;
                        <InfoIcon />
                      </h5>
                      <FormField
                        name="about_me"
                        type="textarea"
                        rows={6}
                        error={errors.about_me}
                        readOnly={aboutMeEdit ? false : true}
                        inputRef={register('about_me')}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    </Box>
                    {aboutMeEdit ? (
                      <div
                        style={
                          inputText.wordCount > wordLimit
                            ? { color: '#FF0000' }
                            : { color: '#757575' }
                        }
                        className="f-14 mb-0 mt-2 d-flex justify-content-end"
                      >
                        {`You have reached the ${
                          inputText?.wordCount ?? 0
                        }/${wordLimit} words limit`}
                      </div>
                    ) : (
                      ''
                    )}

                    {aboutMeEdit ? (
                      <>
                        <br />
                        <Box className="d-flex justify-content-end mt-3">
                          <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={handleeventclick}
                          >
                            Cancel
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            variant="dark"
                            type="submit"
                            disabled={pending}
                          >
                            {pending ? (
                              <Span className="d-flex align-items-center justify-content-center">
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden={true}
                                  className="align-baseline"
                                >
                                  <span className="sr-only"></span>
                                </Spinner>{' '}
                                &nbsp; Loading...
                              </Span>
                            ) : (
                              <>Submit</>
                            )}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      ' '
                    )}
                  </Form>
                </CardBox> */
}

{
  /* <Box className="mt-7">
                <HeaderComponent
                  title="Completed courses"
                  subtitle="A list of Athena  courses that you’ve completed."
                />
                <CardBox className="boxShadow mt-3 mt-md-5">
                  <CompletedCourses />
                </CardBox>
              </Box> */
}

{
  /* <div className="mt-7" ref={employmentHistoryRef}>
                <HeaderComponent
                  title="Employment history"
                  subtitle="Demonstrate your clout by showing the community where you’ve worked."
                />
                <CardBox className="boxShadow mt-3 mt-md-5">
                  <EmploymentHistory
                    profileData={profileData}
                    getProfiledata={getProfiledata}
                  />
                </CardBox>
              </div> */
}

{
  /* <HeaderComponent
                  title="Personal details"
                  subtitle="Information required for official documents like certificates of completion"
                  btn="edit"
                  handleEditClick={() => {
                    handleEditClick('Personal details');
                  }}
                /> */
}
