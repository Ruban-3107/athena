import './PreferencePage.css';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  ButtonToolbar,
  ButtonGroup,
  Spinner
} from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest, useParams, useAuth, useRouter } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Span, CardBox } from '@athena/web-shared/ui';
import CheckboxGroup from 'react-checkbox-group';


const schema = yup.object().shape({
  about_me: yup.string().max(255).required('About me is required'),
});

export function PreferencePage(props) {
  const auth = useAuth();
  const router = useRouter();
  const [profileData, setprofileData] = useState(null);
  // const [preferenceEdit, setPreferenceEdit] = useState(false);
  const [pending, setPending] = useState(false);
  const PersonalDetailsRef = useRef(null);
  // const [preferData, setPreferenceData] = useState([]);
  // const [updatedPreferData, setUpdatedPreferData] = useState([]);
  const [switches, setSwitches] = useState([]);
  const [preference, setPreference] = useState([]);
  // const [isChecked, setIsChecked] = useState(false);
  // const [identifiedRole, setIdentifiedRole] = useState(false);

  console.log(auth, '########################');

  const {
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const handleEditClick = (value) => {
  //   if (value == 'Notification Settings') {
  //     setPreferenceEdit(true);
  //   }
  // };

  const handleeventclick = () => {
    router.navigate('/app/dashboard')
  };

  // useEffect(() => {
  //   if (preference) {
  // console.log(preference?.preferences,'inside effect');
  // const arrayofId = preference?.preferences
  // const isMatch = arrayofId?.every(id => switches.find(obj => obj.id === id));
  // console.log("isMatch",isMatch);
  // if(auth?.user?.role?.[0]?.['name'] === 'Super Admin'){
  //   setSwitches(switches);
  // }
  // else{
  //   const changedSwitches = switches.map(s => {
  //     if (s.id === preference?.id) {
  //       return { ...s, status: !s.status };
  //     }
  //     return s;
  //   });
  //   if(preference){
  //   for (const key in preference) {
  //     console.log("%%%%%%%%");
  //   if (key === 'preferences') {
  //     console.log("%%%%%%%%%%%%%%%%%%%");
  // console.log("dsadasdasdasda",preference.value[key])
  //   }
  // }
  // }
  // setSwitches(changedSwitches);
  // setSwitches(switches.filter((item) => item.status))
  // }
  // for (const key in profileData) {
  //   console.log(key.preferences, 'keyyyy');
  //   if (key === 'preferences') {
  //     console.log('switches', switches);
  // console.log("dsadasdasdasda",profileData?.value[key])
  //   // setselectedUserType(
  //   //   userType.find((e) => e.name === userData?.value[key])
  //   // );
  //   // setValue(
  //   //   'users_type',
  //   //   userType.find((e) => e.name === userData?.value[key])
  //   // );
  //   // setselectedUserType(userData?.value[key]);
  //   }
  // }
  //   }
  // }, [preference]);

  // useEffect(() => {

  // }, [profileData]);

  useEffect(() => {
    if (auth && auth.user) {
      getNotification();
    }
  }, [auth]);
console.log(auth?.user?.id,"userId");
  const getProfiledata = async () => {
    const getProfilesetdataResponse = await apiRequest(
      `api/users/profiles/${auth?.user
        ? parseInt(auth?.user?.id)
        : props && props?.user_id
          ? parseInt(props?.user_id)
          : ''
      }`
    );
    setprofileData(getProfilesetdataResponse);
    // setPreference(getProfilesetdataResponse);
    console.log("log", getProfilesetdataResponse?.preferences);


    // setPreferenceData(getProfilesetdataResponse.preferences ?? []);
    // setUpdatedPreferData(getProfilesetdataResponse.preferences ?? []);
    // console.log(getProfilesetdataResponse, 'getProfilesetdataResponse');
  };

  const getNotification = async () => {
    const getNotificationResponse = await apiRequest(
      `api/users/notificationPreference/get`
    );
    console.log('getNotificationResponse', getNotificationResponse);
    if(getNotificationResponse?.status === 'success'){
    const sortedSwitches = [...getNotificationResponse?.value]?.sort(
      (a, b) => a.id - b.id
    );
    setSwitches(sortedSwitches);
    }else{
       null
    }

    if (auth?.user?.role[0]?.name !== "Super Admin") {
      getProfiledata();
    }
  };

  // useEffect(() => {
  //   console.log("switches:::", switches)
  //   if (switches && switches.length) {
  //     const profilePreferences = profileData?.preferences;
  //     console.log(profilePreferences, 'profilePreferences');
  //     if (profilePreferences && switches) {
  //       console.log("switches111", switches);
  //       const updatedSwitches = switches?.map(swit => {
  //         console.log("idd", swit.id);
  //         console.log("answer", profilePreferences?.includes(swit.id));
  //         if (!profilePreferences?.includes(swit.id) && switches.filter((item) => !item.status)) {
  //           console.log("iddd", swit.status);
  //           return {
  //             ...swit,
  //             status: false,
  //           };
  //         } else {
  //           return swit;
  //         }
  //       });
  //       console.log("333333333333");
  //       console.log("updatedSwitches", updatedSwitches);
  //       setSwitches(updatedSwitches);
  //     }
  //   }
  // }, [switches])

  const handleSwitchChange = (id) => {
    const updatedSwitches = switches.map((s) => {
      if (s.id === id) {
        return { ...s, status: !s.status };
      }
      return s;
    });
    setSwitches(updatedSwitches);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {};
    setPending(true);
    if (auth?.user?.role?.[0]?.['name'] === 'Super Admin') {
      const selectedPreference = switches.filter((item) => item.status);
      const notSelectedPreference = switches.filter((item) => !item.status);
      data['enable_ids'] = selectedPreference.map(({ id }) => parseInt(id));
      data['disable_ids'] = notSelectedPreference.map(({ id }) => parseInt(id));
    } else {
      const selectedPreference1 = switches.filter((item) => item.status);
      // console.log("selectedPreference1",selectedPreference1)  notification_type;
      data = { preferences: selectedPreference1.map(({ id }) => id) };
    }
    console.log("data0997", data);
    const updateResponse = await apiRequest(
      auth?.user?.role?.[0]?.['name'] === 'Super Admin'
        ? `api/users/notificationPreference/update`
        : `api/users/profiles/preferences/${profileData?.user_id}`,
      // `api/users/notificationPreference/update`,
      // `api/users/profiles/preferences/${profileData.id}`,
      'PUT',
      data
    );
    if (updateResponse?.status === 'success') {
      getProfiledata();
      setPending(false);
      // setPreferenceEdit(false);
      // setPreferenceData(updateResponse.preferences ?? []);
      toast.success(`Preferences updated successfully!`);
      setPreference(updateResponse);
    }
    else{
     setPending(false);
      toast.error(updateResponse?.message);
    }
    window.scrollTo(0, 0);
  };

  return (
    <section className="bg-image">
      <Container>
        <Row>
          {/* <Col xl={3}>
            <Box className="sticky-wrapper">
              <WelcomeBackComponent />
              {auth?.user?.roles?.includes('trainer') ? (
                <QuickLinksTrainer profileData={profileData} />
              ) : (
                <QuickLinksLearner profileData={profileData} />
              )}
            </Box>
          </Col> */}
          <Col xl={11}>
            <div data-testid="edit_button">
              <Box className="position-relative mt-5">
                <div ref={PersonalDetailsRef}>
                  <h5>Notifications</h5>
                  <p className="text-muted">
                    Set your preference for notifications you get about your
                    activities and recommendations
                  </p>
                  <CardBox className="mt-5">
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        {switches.map((s) => (
                          // <div>
                          <Col xl={3}>
                            <Form.Check
                              type="switch"
                              key={s.id}
                              id={s.id}
                              className="prefer-check p-3"
                              label={s.notification_type}
                              checked={s.status}
                              onChange={() => handleSwitchChange(s.id)}
                            />
                            <p className="text-muted me-3">{s.description}</p>
                          </Col>
                          // </div>
                        ))}
                      </Row>

                      {/* <div>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          label="Whats app"
                          className="prefer-check"
                          checked={switches[0]}
                          onChange={() => handleSwitchChange(0)}
                          name="preferences"
                          // type="input"
                          ref={register('preferences')}
                        />
                        <p className="text-muted">
                          Notification will be sent through whatsapp
                        </p>
                      </div>
                      <div>
                        <Form.Check
                          type="switch"
                          name="preferences"
                          // type="input"
                          ref={register('preferences')}
                          id="custom-switch"
                          label="SMS"
                          className="prefer-check"
                          checked={switches[1]}
                          onChange={() => handleSwitchChange(1)}
                        />
                        <p className="text-muted">
                          Notification sent Through the your register mobile
                          number
                        </p>
                      </div>
                      <div>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          name="preferences"
                          // type="input"
                          ref={register('preferences')}
                          label="Mail"
                          className="prefer-check"
                          checked={switches[2]}
                          onChange={() => handleSwitchChange(2)}
                        />
                        <p className="text-muted">
                          Notification send to Through the your register mail
                          address
                        </p>
                      </div>
                      <div>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          name="preferences"
                          // type="input"
                          ref={register('preferences')}
                          label="InApp"
                          className="prefer-check"
                          checked={switches[3]}
                          onChange={() => handleSwitchChange(3)}
                        />
                      </div> */}
                    </Form>
                  </CardBox>

                  {/* {preferenceEdit ? ( */}
                  {/* <Box className="d-flex justify-content-end pt-4">
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
                        onClick={prefenceUpdate}
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
                    </Box> */}
                  {/* ) : (
                    ' '
                  )} */}
                  {/* </CardBox> */}
                </div>
              </Box>
              <Col lg={10} className="btnxNoticeUser">
                <ButtonToolbar aria-label="Toolbar with button groups">
                  {/* <ButtonGroup className="me-3" aria-label="First group">
                    <Button
                      className="can-btn space1 rounded-4 px-1"
                      type="button"
                      onClick={handleeventclick}
                      variant="outline-primary"
                    >
                      Cancel
                    </Button>
                  </ButtonGroup> */}
                  <ButtonGroup className="me-0" aria-label="Second group">
                    <Button
                      className="saveprofile rounded-4 px-5"
                      variant="outline-primary"
                      type="submit"
                      disabled={pending}
                      onClick={onSubmit}
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
                        <>Save</>
                      )}
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
export default PreferencePage;
