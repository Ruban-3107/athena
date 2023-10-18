import './Navbar.css';
import {
  AthenaLogo,
  ButtonComponent,
  BellIcon,
  BatchIcon,
  SettingSideBarIcon,
  Box, Span, SignoutIcon,
  Profilephotocomponent
} from '@athena/web-shared/ui';
import { useAuth, useRouter, apiRequest } from '@athena/web-shared/utils';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { createSearchParams, Link } from 'react-router-dom';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { useEffect, useState, useRef } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Spinner } from 'react-bootstrap/esm';
import { toast } from 'react-toastify';

export const NavbarCustom = () => {
  const auth = useAuth();
  const router = useRouter();
  const [user, setuser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState('');
  const [notificationData, setNotificationData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [Totalpage, setTotalpage] = useState(10);
  const scrollContainerRef = useRef(null);


  // useEffect(()=>{
  //   getNotifications();
  // },[])

  useEffect(() => {
    if (auth && auth.user) {
      setuser(auth.user);
      getNotifications();
      setInterval(() => {
        getNotifications();
      }, 300000);


    } else {
      setuser(false);
    }
  }, [auth, currentPage]);



  function templateCreated(getTemplate) {
    let temp;
    let start_at = getTemplate?.start_time?.split('T').join().slice(0, -5);
    let end_at = getTemplate?.end_time?.split('T').join().slice(0, -5);
    switch (getTemplate?.title) {
      case 'schedule created':
        temp = `${getTemplate?.topic} ${getTemplate?.title} for ${getTemplate?.batch_name} batch  at ${start_at} to ${end_at}`;
    }

    return temp;
  }

  const getNotifications = async () => {
    let data = {};
    setIsLoading(true);
    data['pageNo'] = currentPage;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let response = await apiRequest('api/users/notifications/get', 'POST', data);
    let notifyData = response?.value?.data;

    if (response?.status === "success") {
      setNotifications(response?.value?.notViewedCount >= 9 ? '9+' : response?.value?.notViewedCount)
      setNotificationData([...notificationData, ...notifyData])

    }
    setIsLoading(false);
  };
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = scrollContainerRef.current;

    const target = event.target;

    console.log("///////////////:::::/", notificationData.length)
    if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
      console.log(notifications, "nooooooooooo");
      if (currentPage < Totalpage) {
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        return null;
      }
    }
  };

  const bellIconClicked = async () => {
    console.log("bellIconClicked")
    setNotifications(0)

    if (notifications != 0) { //only call if new notification shows
      try {
        let viewresponse = await apiRequest('api/users/notifications/viewed', 'POST');
        if (viewresponse?.status === 'success') {
          console.log('success');
        } else if (viewresponse?.status === 'error') {
          console.log("viewresponse", viewresponse?.message)
          toast.error(viewresponse?.message)
        }

      } catch (error) {
        console.log("bellIcon error", error)
      }

    }


  }

  const signout = async () => {
    try {
      let signoutresponse = await apiRequest('api/users/signOut', 'POST');
      console.log('SignOut:::::', signoutresponse);
      if (signoutresponse?.status === 'success') {
        var token = localStorage.getItem('userData');
        if (token !== null) {
          console.log('Token exists:', token);
          localStorage.removeItem('userData');
          // setuser(false)
          window.location.reload();
          // Token exists in local storage
        } else {
          // Token does not exist in local storage
          console.log('Token does not exist');
        }
      }
    } catch (error) {
      console.log('err', error);
    }

  };
  return (
    <Navbar className="nav-custom-header" expand="lg">
      <Container fluid className="">
        <Navbar.Brand href="/app/dashboard">
          <AthenaLogo />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center ref-nav">
            {user === false ? (
              <>
                <Link
                  className="text-black text-decoration-underline nav-link pad-left"
                  to={{
                    pathname: '/auth/signup',
                    search: `?${createSearchParams({
                      ref: 'Trainer',
                    })}`,
                  }}
                >
                  Join as a Trainer
                </Link>

                <Nav.Link href="auth/signin" className="pad-left">
                  <ButtonComponent
                    type="button"
                    variant="primary"
                    size="lg"
                    className="nav-signin-btn"
                    name="Sign In"
                  />
                </Nav.Link>

                <Nav.Link href="auth/signup" className="">
                  <ButtonComponent
                    variant="primary"
                    size="lg"
                    className="nav-signup-btn"
                    name="Sign Up"
                  />
                </Nav.Link>
              </>
            ) : user?.isPasswordChanged ? (
              <>
                <Dropdown className="auth-dropdown">
                  <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                    <div
                      style={{ position: 'relative', display: 'inline-block' }}
                    >
                      <div onClick={() => bellIconClicked()}>
                        <BellIcon />
                      </div>
                      {notifications != 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            borderRadius: '50%',
                            // backgroundColor: 'red',
                            color: 'white',
                            fontSize: '10px',
                            padding: '2px 5px',
                            background:
                              'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
                          }}
                        >
                          {notifications}
                        </span>
                      )}
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    ref={scrollContainerRef}
                    className="notification-zindex notification-menu"
                  >
                    <h1 className="notification-title ms-4 pt-2 pb-1">
                      Notifications
                    </h1>
                    <hr />
                    <Box ref={scrollContainerRef} className={notificationData?.length > 0 ? "main-notificationbox" : "main-zeronotificationbox"} onScroll={handleScroll}>
                      {console.log(notificationData?.length, "length")}
                      {notificationData.length > 0 ? (
                        notificationData?.map((e) => (
                          <DropdownItem key={e.id}
                          >
                            <Box className={`d-flex flex-row notificationBox${isScrolled ? ' scrolled' : ''}`}>
                              <Box className="batchstyle me-2">
                                <Span className="">
                                  <BatchIcon />
                                </Span>
                                &nbsp;&nbsp;
                              </Box>
                              <Box>
                                {/* <h1 className="notificatio_title">{e?.notifications_for?.value?.title}</h1> */}
                                <p className="notification_para">{(e?.notifications_for)}</p>
                              </Box>
                            </Box>
                          </DropdownItem>
                        ))
                      ) : (
                        <p className='p-3 no-notificationtext'>You have no Notifications</p>
                      )}
                      {isLoading && <Span className="d-flex align-items-center justify-content-center loader-text">
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
                      }
                    </Box>
                  </Dropdown.Menu>
                </Dropdown>
                <Span className="">
                  <Navbar.Collapse
                    id="navbar-nav"
                    size="lg"
                    className="d-none d-lg-flex"
                  >
                    <Nav className="align-items-center ms-auto">
                      {/* {auth.user && ( */}
                      <>
                        {/* <Button variant="white" className="notification-btn p-0">
                    <NotificationIcon />
                  </Button> */}
                        <Dropdown className="auth-dropdown pe-0">
                          <Dropdown.Toggle
                            variant="transparent"
                            id="dropdown-basic"
                          >
                            <Profilephotocomponent className="ms-3 nav-prof" />
                            {/* <MoreVerticalIcon /> */}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <LinkContainer to="/app/setting">
                              <Dropdown.Item
                                active={false}
                                onClick={(e) => {
                                  router.navigate('/app/setting');
                                }}
                              >
                                <SettingSideBarIcon /> &nbsp;Settings
                              </Dropdown.Item>
                            </LinkContainer>
                            {/* <LinkContainer to="/app/preferences">
                          <Dropdown.Item
                            active={false}
                            onClick={(e) => {
                              router.navigate('/app/preferences');
                            }}
                          >
                            Preference
                          </Dropdown.Item>
                        </LinkContainer> */}

                            <Dropdown.Item active={false} onClick={signout}>
                              <SignoutIcon /> &nbsp;Signout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Box>{/* <Span><MoreVerticalIcon /></Span> */}</Box>
                      </>
                      {/* )} */}

                      {/* {!auth.user && (
                <Nav.Item>
                  <LinkContainer to="/auth/signin">
                    <Nav.Link active={false}>Sign in</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              )} */}
                    </Nav>
                  </Navbar.Collapse>
                </Span>
              </>
            ) : null}
            {/* } */}
            {/* <Nav.Link href="#link" className='pad-left'>
              <GlobeIcon />
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default NavbarCustom;
