import './Settings.css';
import { 
  Col, 
  Form,
  Button,
  Row,
  ButtonGroup,
  ButtonToolbar,
  Spinner,
  Tab, 
  Tabs,
  Nav,
} from 'react-bootstrap';
import { Box,Span, FormFieldRow } from '@athena/web-shared/ui';
import {
  ProfilePage,
  PreferencePage,
} from '@athena/web-shared/components';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiRequest,useRouter,useAuth } from '@athena/web-shared/utils';

export function Settings(props) {
  const pauth = useAuth();
  const router = useRouter();
  const [key, setKey] = useState('profile');
  const [pending,setPending] = useState(false);

  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log('error', errors);
  }, [errors]);

  const onSubmit = async (data) => {
    const ChangePasswordData = {};
    setPending(true)
    ChangePasswordData['old_password'] = data.old_password;
    ChangePasswordData['password'] = data.password;
    ChangePasswordData['confirm_password'] = data.confirm_password;
    console.log(ChangePasswordData, '@@@ChangePasswordData@@@');
    // setPending(true);
    
    const changepasswordResponse = await apiRequest(
      'api/auth/setPassword',
      'POST',
      ChangePasswordData
    )
    if (changepasswordResponse?.status === 'success') {
      setPending(false)
      toast.success('Password updated successfully!');
    } else {
      setPending(false)
      toast.error(changepasswordResponse?.message);
    }

    return changepasswordResponse;
  };

  const handleeventclick = () => {
    // router.navigate('/app/dashboard')
    reset();
 };

  return (
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="users-tab mt-1"
      activeKey={key}
      onSelect={(k) => {
        setKey(k);
      }}
    >
      {/* PROFILE TAB */}
      <Tab eventKey="profile" title="Profile" className="profile-tab">
        <ProfilePage />
      </Tab>

      {/* PASSWORD TAB */}
      <Tab eventKey="password" title="Password" className="password-tab">
        <div className="mt-3 px-3">
          <h5 className="text-dark">Password</h5>
          <p className="text-muted">
            Please enter your current password to change your password
          </p>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)} className='px-3 mt-4'>
          <Row class="mt-4">
            <Col lg={8}>
                  <Form.Group controlId="formCurrentPassword" className="mb-4">
                    <FormFieldRow
                      size="md"
                      size1="3"
                      size2="9"
                      label="Current Password :"
                      name="old_password"
                      type="password"
                      placeholder="Current Password"
                      error={errors.old_password}
                      inputRef={register('old_password', {
                        required: 'Please enter the current password',
                      })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword" className="mb-4">
                    <FormFieldRow
                      size="md"
                      size1="3"
                      size2="9"
                      name="password"
                      type="password"
                      label="New Password : "
                      placeholder="New Password"
                      error={errors.password}
                      inputRef={register('password', {
                        required: 'Please enter New Password',
                        minLength: {
                          value: 8,
                          message: 'Password must have at least 8 characters',
                        },
                        maxLength: {
                          value: 16,
                          message: 'Password should not exceed 16 characters',
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                          message:
                            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                        },
                      })}
                    />{' '}
                  </Form.Group>
                <Form.Group controlId="formConfirmPassword" className="mb-4">
                  <FormFieldRow
                    size="md"
                    size1="3"
                    size2="9"
                    name="confirm_password"
                    type="password"
                    label="Confirm Password: "
                    placeholder="Confirm Password"
                    error={errors.confirm_password}
                    inputRef={register('confirm_password', {
                      required: 'Please enter your password again',
                      validate: (value) => {
                        if (value === getValues().password) {
                          return true;
                        } else {
                          return "This doesn't match your password";
                        }
                      },
                    })}
                  />
                </Form.Group>
          </Col>
          </Row>

          <Box className="button-align d-flex justify-content-end">
          <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup
                      className="me-3 align-items-end"
                      aria-label="First group"
                    >
                    <Button
                      onClick={handleeventclick}
                      type="button"
                      variant="outline-primary"
                      className="me-3 rounded-5 px-5"
                    >
                      {' '}
                      Cancel
                    </Button>{' '}
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-5 px-5"
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
                    <>Save</>
                  )}
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
            {/* <ButtonComponent
              onClick={handleeventclick}
              type="button"
              variant="outline-primary"
              className="me-3 rounded-5 px-5"
              name="&nbsp;Cancel&nbsp;"
            />
            <ButtonComponent
              type="submit"
              variant="primary"
              className="rounded-5 px-5"
              name="&nbsp;Save&nbsp;"
            /> */}
            {/* </Col> */}
          </Box>
        </Form>
      </Tab>
      <Tab
        eventKey="notification"
        title="Notification"
        className="notification-tab"
      >
        <PreferencePage/>
      </Tab>
    </Tabs>
  );
}
export default Settings;
