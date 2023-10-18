import './UserProfileOffcanvas.css';
import { useState } from 'react';
import { Offcanvas,Card,Col,Row,Stack,  Form,OverlayTrigger,Tooltip,} from 'react-bootstrap';
import {HumanIcon,BookOpenIcon,  AdminRoleIcon, LearnerRoleIcon,TrainingFacilitatorRoleIcon,ClientRepresentativeRoleIcon,TrainerRoleIcon} from '@athena/web-shared/ui';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';
import { apiRequest } from '@athena/web-shared/utils';
export const UserProfileOffcanvas=(props)=> {
  const [rating, setRating] = useState(3);
  const handleRating = (rate, name) => setRating(rate);
  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );
  const handledisable = async (users) => {
    const disableUrl = `api/users/[${users.id}]/${(users.status === 'active') ? 'disable' : 'enable'}`;
    const disableresponse = await apiRequest(disableUrl, 'DELETE');
    if (disableresponse.status === 'success') {
      setDisable(true);
      toast.success(`User ${(users.status === 'in active') ? 'enabled' : 'disabled'} successfully!`);
      props.getuser();
      props.onHide();
    } else {
      toast.error(disableresponse.message.message);
    }
  };

  console.log("props.userData",props.userData);

  return (
    <>
    <Offcanvas {...props}>
      <Offcanvas.Body className='p-0'>
        {/* <Card className="border-0"> */}
        <div className="color"></div> {/* </Card> */}
        <Card className="border-0 cardy">
          <Card.Img
            className="image-border img-cover align-item-center"
            src="assets/images/3.jpg"
            alt="user"
          />
          <Card.Body>
            <Card.Title
              className="text-center font-a mb-1"
              style={{ textTransform: 'capitalize' }}
            >
              {props.userData?.fullname}
            </Card.Title>
            <Card.Text className="text-center mb-3">
              {props.userData?.roles &&
                props.userData?.roles.map((role, index) =>
                  role == 'learner' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Learner')}
                    >
                      <span className="me-2">
                        <LearnerRoleIcon />
                      </span>
                    </OverlayTrigger>
                  ) : role == 'admin' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Admin')}
                    >
                      <span className="me-2">
                        <AdminRoleIcon />
                      </span>
                    </OverlayTrigger>
                  ) : role == 'trainer' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Trainer')}
                    >
                      <span className="me-2">
                        <TrainerRoleIcon />
                      </span>
                    </OverlayTrigger>
                  ) : role == 'Job Architect' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Job Architect')}
                    >
                      <span className="me-2">
                        <JobArchitectRoleIcon />
                      </span>
                    </OverlayTrigger>
                  ) : role == 'training facilitator' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Training Facilitator')}
                    >
                      <span className="me-2">
                        <TrainingFacilitatorRoleIcon />
                      </span>
                    </OverlayTrigger>
                  ) : role == 'client representative' ? (
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip('Client Representative')}
                    >
                      <span className="me-2">
                        <ClientRepresentativeRoleIcon/>
                      </span>
                    </OverlayTrigger>
                  ) : (
                    ' '
                  )
                )}
            </Card.Text>
            <Card.Text className="d-flex justify-content-between personaldetail mt-3 mb-1">
              <div>
                <p className="text-muted">
                  <HumanIcon /> &nbsp;Developers Trained : 1,500
                  <br /> <BookOpenIcon /> &nbsp;Courses Instructed : 30
                </p>
              </div>
              <div>
                <p>
                  <Rating
                    onClick={handleRating}
                    ratingValue={rating}
                    size={20}
                    fillColor="#EFB90A"
                    readonly={true}
                    initialValue="3"
                    emptyColor="#F0F0F0"
                    className="foo"
                  />
                </p>
              </div>
            </Card.Text>
            <Card.Text className="d-flex justify-content-between personaldetail mt-3 mb-1">
              <div>
                <p>
                  {props.userData?.emailId}
                  <br /> <p className="text-info">{props.userData?.phone_number ? props.userData?.phone_number : `+91 9876543210`}</p>
                </p>
              </div>
              <div>
                <p>Athena ID: 000123</p>
              </div>
            </Card.Text>
            <Card.Title className="mb-3 mt-3 font-c">
              <b>Professional Details</b>
            </Card.Title>
            <Card.Text className="font-yy">
              <Stack>
                <Row className="mb-1">
                  <Col xs={8} md={8}>
                    Job Architect:
                  </Col>
                  <Col xs={4} md={4}>
                    3+ yrs
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col xs={8} md={8}>
                    Technical Training:
                  </Col>
                  <Col xs={4} md={4}>
                    10 yrs
                  </Col>
                </Row>
                <Row>
                  <Col xs={8} md={8}>
                    Solution Delivery:
                  </Col>
                  <Col xs={4} md={4}>
                    15+ yrs
                  </Col>
                </Row>
              </Stack>
            </Card.Text>
            <Card.Title className="mb-3 mt-3 font-c">
              <b>Personal Details</b>
            </Card.Title>
            <Card.Text className="personaldetail mb-5">
              <Stack>
                <Row>
                  <Col xs={8} md={8}>
                    <p>
                      <b>Languages Known</b> <br /> Tamil, English
                    </p>
                  </Col>
                  <Col xs={4} md={4}>
                    <p>
                      <b>State</b> <br /> Tamilnadu
                    </p>
                  </Col>
                </Row>
              </Stack>
            </Card.Text>
            <Card.Text className="d-flex">
              <Form.Label className='my-1' style={{ fontSize: 'small' }}>Enable/Disable :</Form.Label>
              <Form.Check
                type="switch"
                id="custom-switch"
                className="ms-2"
                disable={props.userData?.status == 'in active' ? true : false}
                defaultChecked={
                  props.userData?.status == 'active' ? true : false
                }
                onClick={() => {
                  handledisable(props.userData);
                }}
              />
            </Card.Text>
          </Card.Body>
        </Card>
      </Offcanvas.Body>
    </Offcanvas>
  </>
  );
}
export default UserProfileOffcanvas;
