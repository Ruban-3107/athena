import './AuthForm.css';
import { React, useState, useEffect, useRef } from 'react';
import { Form, Col,Button,Spinner } from 'react-bootstrap';
import { Box, Span, FormField,PasswordShowIcon, PasswordHideIcon } from '@athena/web-shared/ui';
import { AuthFooter } from '@athena/web-shared/components';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { apiRequest } from '@athena/web-shared/utils';
import {
  Link,
  useAuth,
  useLocation,
  useRouter,
  requireAuth,
} from '@athena/web-shared/utils';
import { useSearchParams, useParams } from 'react-router-dom';
import OTPInput, { ResendOTP } from 'otp-input-react';
// import { useRestrictCopyPaste } from "./useRestrictCopyPaste"

// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';

// const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

// export const basicSchema = yup.object().shape({
//   old_password:yup
//   .string()
//   .required('Please enter old password'),
//   password: yup
//     .string()
//     .matches(passwordRules, { message: "Please create a stronger password" }),
//   confirm_password:yup
//   .string()
//   .required('Please enter new password again')
// });

export function AuthForm(props) {
  const auth = useAuth();
  const router = useRouter();
  const location = useLocation();
  const [pending, setPending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  let [searchParams, setSearchParams] = useSearchParams();
  const [passwordShown, setPasswordShown] = useState(false);
  const [inputData, setInputData] = useState(false);
  const [signInvalue, setSignInValue] = useState('');
  const [verifyOtp, setverifyOtp] = useState(false);
  const [OTP, setOTP] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  // console.log("message",signInvalue);
  // if(typeof parseInt(message.length) ==='number'){
  //   console.log("##################");
  // }else{
  //   console.log("$$$$$$$$$$$$$$$$$$$$");
  // }
  // console.log('searchParams', searchParams.get('role'));
  // console.log('locationnn', location);
  const role = searchParams.get('ref');
  const token = searchParams.get('token');
  // const phoneInputRef = useRef(null);
  // useEffect(() => {
  //   setTimeout(() => {
  //     phoneInputRef.current.focus()
  //   })
  // },[])
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    reset,
    control,
    setError,
    setFocus,
    formState: { errors },
  } = useForm();

  // resolver: yupResolver(basicSchema)

  useEffect(() => {
    console.log(errors, ':::::::');
    console.log(phoneNumber, '::::::::::');
  }, [errors, phoneNumber]);
  useEffect(() => {
    if (token) {
      verifyPasswordResetToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (
      (props && props.type === 'signinwithotp') ||
      (props && props.type === 'signin')
    ) {
      if (isEmail) {
        setFocus('email');
      }
    }
  }, [setFocus, isEmail, props?.type]);

  const verifyPasswordResetToken = async (token) => {
    const tokenData = {};
    tokenData['token'] = token;
    const resetPasswordToken = await apiRequest(
      `api/auth/validateToken`,
      'POST',
      tokenData
    );
    console.log('resetPasswordToken::', resetPasswordToken);
    // return resetPasswordToken;
  };
  const togglePassword = () => {
    // When the handler is invoked
    // chnage inverse the boolean state passwordShown
    setPasswordShown(!passwordShown);
  };

  const submitHandlersByType = {
    signin: ({ phone_number, email, pass }) => {
      return auth.signin(email, pass, phone_number).then((user) => {
        console.log('userrrrrrrrrrrrr:', user);
        props.onAuth(user);
      });
    },
    signup: ({ email, firstname, lastname, phone_number, personal_email }) => {
      return auth
        .signup(email, firstname, lastname, phone_number, personal_email, role)
        .then((resp) => {
          console.log('resp::::', resp);
          if (resp.status === 'success') {
            props.onFormAlert({
              type: 'success',
              message:
                'Thanks for signing up! Please check your email to complete the process.',
            });
            setPending(false);
          }
          // Call auth complete handler
          // props.onAuth(user);
        });
    },
    forgotpass: ({ email }) => {
      return (
        auth
          // .sendPasswordResetEmail(email).then(() => {
          .forgotPassword(email)
          .then((response) => {
            console.log('@@@@@@response@@@@@@', response);
            if (response.status === 'success') {
              props.onFormAlert({
                type: 'success',
                message: response.message,
              });
              setPending(false);
            }
            // router.navigate('/auth/resetpassword');
          })
      );
    },
    resetpassword: ({ password, confirm_password }) => {
      return auth
        .resetPassword(password, confirm_password, token)
        .then((response) => {
          console.log('@@@@@@RESETPASSWORDRESPONSE@@@@@@', response);
          setPending(false);
          if (response.status === 'success') {
            props.onFormAlert({
              type: 'success',
              message: response.message,
            });
            props.onSetPassword();
          }
        });
    },
    setpassword: ({ old_password, password, confirm_password }) => {
      return auth
        .updatePassword(old_password, password, confirm_password)
        .then((resp) => {
          console.log('resp:::::::::', resp);
          setPending(false);
          if (resp.status === 'success') {
            // Show success alert message
            props.onFormAlert({
              type: 'success',
              message: resp.message,
            });
            props.onSetPassword();
          }
          // setTimeout(() => {
          //   props.onAuth(user);
          // }, 3000);
        });
    },
    signinwithotp: ({ email, phone_number }) => {
      if (!verifyOtp) {
        return auth
          .signInWithOtp(email, phone_number)
          .then((resp) => {
            console.log('resp:::::::::::::::', resp);
            // Show success alert message
            if (resp.status === 'success') {
              setPending(false);
              props.onFormAlert({
                type: 'success',
                message: 'OTP sent successfully!',
              });
              setverifyOtp(true);
              // setSignInValue(resp.value.result.token);
            }
          });
      } else {
        return auth.verifyotp(email, phone_number, OTP).then((resp) => {
          console.log('resp::::::::', resp);
          // if (resp.status === 'success') {
          setPending(false);
          props.onAuth(resp);
          // }
        });
      }
    },
  };
  // const handlePaste = (e) => {
  //   e.preventDefault();
  // };

  const onSubmit = ({
    email,
    pass,
    firstname,
    lastname,
    personal_email,
    phone_number,
    old_password,
    password,
    confirm_password,
  }) => {
    // Show pending indicator
    setPending(true);
    // Call submit handler for auth type
    submitHandlersByType[props.type]({
      email,
      pass,
      firstname,
      lastname,
      phone_number,
      old_password,
      personal_email,
      password,
      confirm_password,
    }).catch((error) => {
      setPending(false);

      // Show error alert message
      if (
        error.message ==
        'Thanks for signing up! Please check your email to complete the process.'
      ) {
        // reset({
        //   email: '',
        //   pass: '',
        //   firstname:'',
        //   lastname:'',
        //   setpassword: '',
        //   confirmPass:'',
        // });
        reset();
        setPhoneNumber('+91');
        props.onFormAlert({
          type: 'success',
          message: error.message,
        });
      } else {
          props.onFormAlert({
            type: 'error',
            message: error.message,
          });
      }
    });
  };
  const optionsByType = {
    signup: {
      title: 'Get yourself an account',
      buttonAction: 'Sign up',
      showFooter: true,
      requireauth: false,
      // signinText: 'Already have an account?',
      signinAction: 'Already have an account? Sign In',
      signinPath: '/auth/signin',
      showAgreement: true,
      termspathtext: 'Terms of use',
      termsPath: '/legal/terms-of-service',
      privacypolicytext: 'Privacy policies',
      privacyPolicyPath: '/legal/privacy-policy',
    },
    signin: {
      title: 'Welcome back',
      buttonAction: 'Sign in',
      showFooter: true,
      requireauth: false,
      signupAction: 'Sign Up',
      signupPath: '/auth/signup',
      signinwithotpAction: 'Sign In with OTP',
      signinwithotpPath: '/auth/signinwithotp',
      forgotPassAction: 'Forgot Password?',
      forgotPassPath: '/auth/forgotpass',
    },
    signinwithotp: {
      title: 'Welcome back',
      buttonAction: 'Get OTP',
      showFooter: true,
      requireauth: false,
      signupAction: 'Sign Up',
      signupPath: '/auth/signup',
      signinAction: 'Sign In with Password',
      signinPath: '/auth/signin',
    },
    forgotpass: {
      title: 'Get a new password',
      buttonAction: 'Reset password',
      showFooter: true,
      requireauth: false,
      signinText: 'Remember it after all?',
      signinAction: 'Sign In',
      signinPath: '/auth/signin',
      resetPasswordAction: 'Reset password',
      resetPasswordPath: '/auth/resetpassword',
    },
    setpassword: {
      title: 'Choose a new password',
      buttonAction: 'Set Password',
      requireauth: true,
    },
    resetpassword: {
      title: 'Reset your Password',
      buttonAction: 'Reset Password',
      showFooter: true,
      resetPasswordAction: 'Reset Password',
      passwordResetPath: '/auth/resetpassword',
    },
    verifyotp: {
      title: 'Welcome back',
      buttonAction: 'Verify OTP',
      requireauth: false,
      // showFooter: true,
      // signupAction: 'Sign up',
      // signupPath: '/auth/signup',
      // signinAction: 'Sign in with Password',
      // signinPath: '/auth/signin',
    },
  };
  const type = optionsByType[props.type] ? props.type : 'signup';
  // Get options object for current auth type
  const options = optionsByType[type];
  const resendOtp = async () => {
    const signIndata = {};
    const eMail = getValues().email;
    const phoneNumber = getValues().phone_number;
    if (eMail) {
      signIndata['input'] = eMail;
    } else {
      signIndata['input'] = phoneNumber;
    }
    console.log('Inputttttt', signIndata);
    const OTPResponse = await apiRequest('api/auth/sendOtp', 'POST', signIndata)
      .then((response) => {
        if (response.status === 'success') {
          setPending(false);
          props.onFormAlert({
            type: 'success',
            message: 'OTP resent successfully!',
          });
          setverifyOtp(true);
          // setSignInValue(resp.value.result.token);
        }
      })
      .catch((response) => {
        if (response.status === 'error') {
          props.onFormAlert({
            type: 'error',
            message: response.message,
          });
        }
      });
    return OTPResponse;
  };

  useEffect(() => {
    console.log('errorserrorserrors::', errors);
  }, [errors]);

  function handlePaste(event) {
    event.preventDefault();
  }

  // const handleBlur = (e) => {
  //   const pastedValue = e.clipboardData.getData("Text");
  //   console.log("pastedValue", pastedValue);
  //   const formattedValue = formatPhoneNumber(pastedValue) // format pastedValue using the library's formatPhoneNumber function
  //   setPhoneNumber(formattedValue);
  //   setImmediate(() => {
  //     // trigger onChange after the state is updated
  //     const event = new Event("input", { bubbles: true });
  //     const input = e.target;
  //     input.value = formattedValue;
  //     input.dispatchEvent(event);
  //   });
  // };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {' '}
      <span className="flaticon-eye" onClick={<PasswordShowIcon />}></span>{' '}
      <Box className="auth-form-admin">
        {' '}
        {['signup'].includes(props.type) && (
          <Form.Group controlId="formfirstname" className="mb-3">
            {' '}
            <FormField
              size="md"
              name="firstname"
              type="text"
              placeholder="Enter your first name"
              label="First Name*"
              error={errors.firstname}
              inputRef={register('firstname', {
                required: 'Please enter first name',
                pattern: {
                  value: /^(?!^\s+$)(?!.*\d)[\w\s]{3,50}$/,
                  message: 'Please enter valid name',
                },
              })}
            />{' '}
          </Form.Group>
        )}
        {['signup'].includes(props.type) && (
          <Form.Group controlId="formlastname" className="mb-3">
            {' '}
            <FormField
              size="md"
              name="lastname"
              type="text"
              placeholder="Enter your last name"
              label="Last Name*"
              error={errors.lastname}
              inputRef={register('lastname', {
                required: 'Please enter last name',
                pattern: {
                  value: /^(?!^\s+$)(?!.*\d)[\w\s]{3,50}$/,
                  message: 'Please enter valid name',
                },
              })}
            />{' '}
          </Form.Group>
        )}
        {['signup', 'forgotpass'].includes(props.type) && (
          <Form.Group controlId="formEmail" className="mb-3">
            {' '}
            <FormField
              size="md"
              name="email"
              type="email"
              placeholder="Enter your email"
              label={props.type === 'signup' ? 'Primary Email ID*' : 'Email'}
              error={errors.email}
              inputRef={register('email', {
                required: 'Please enter the email',
              })}
            />{' '}
          </Form.Group>
        )}
        {['signup'].includes(props.type) && (
          <Form.Group controlId="formEmail" className="mb-3">
            {' '}
            <FormField
              size="md"
              name="personal_email"
              type="email"
              placeholder="Enter your secondary email"
              label="Secondary Email ID"
              //error={errors.personalemail}
              inputRef={register('personal_email')}
            />{' '}
          </Form.Group>
        )}
        {['signup'].includes(props.type) ||
        (['signin', 'signinwithotp'].includes(props.type) && inputData) ? (
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number*</Form.Label>{' '}
            <Controller
              control={control}
              name="phone_number"
              rules={{
                // onChange: (e) => console.log('dsfdsfdsfds', e),
                required: 'Please enter mobile number',
                minLength: {
                  value: 12,
                  message: 'Invalid Mobile Number',
                },
              }}
              render={() => (
                <PhoneInput
                  buttonclassName={
                    errors?.phone_number?.message
                      ? 'phone-input-button-error is-invalid'
                      : ''
                  }
                  inputclassName={
                    errors?.phone_number?.message
                      ? 'error-field is-invalid'
                      : ''
                  }
                  inputProps={{
                    title: 'phonenumber',
                    id: 'phone_number',
                    name: 'phone_number',
                    autoFocus: isMobile ? true : false,
                  }}
                  // ref={phoneInputRef}
                  country={'in'}
                  onlyCountries={['in']}
                  disableSearchIcon={true}
                  disableDropdown={true}
                  value={phoneNumber}
                  // onBlur={handleBlur}
                  countryCodeEditable={false}
                  onChange={(phone, data, event, formattedValue) => {
                    console.log('phone', phone);
                    setError('phone_number');
                    //setValue('email', '');
                    setIsEmail(false);
                    if (phone.length === 2) {
                      setError('phone_number', {
                        type: 'required',
                        message: 'Please enter a valid phone number',
                      });
                    }
                    // else if (phone.length >= 2 && phone.length <= 12) {
                    //   setError('phone_number', {
                    //     type: 'minLength',
                    //     message: 'invalid phone number',
                    //   });
                    // }
                    else if (phone.length < 5) {
                      if (props && props.type !== 'signup') {
                        setInputData(false);
                        setValue('email', phone);
                        setIsEmail(true);
                      }
                    }
                    setValue('phone_number', phone);
                    setPhoneNumber(phone);
                  }}
                  // inputProps={{
                  //   title: 'phonenumber',
                  //   id: 'phone_number',
                  // }}
                  // country={"us"}
                  // enableAreaCodes={false}
                  // // enableLongNumbers={false}
                  // // countryCodeEditable={true}
                  // // onlyCountries={['in']}
                  // // enableSearch={false}
                  // enableSearch={true}
                  // disableSearchIcon={true}
                  // disableDropdown={true}
                  // value={phoneNumber}
                  // countryCodeEditable={true}
                  // onChange={(phone, data, event, formattedValue) => {
                  //   setError('phone_number');
                  //   if (phone.length === 2) {
                  //     setError('phone_number', {
                  //       type: 'required',
                  //       message: 'Please enter a valid phone number',
                  //     });
                  //   } else if (phone.length >= 2 && phone.length < 12) {
                  //     setError('phone_number', {
                  //       type: 'minLength',
                  //       message: 'invalid phone number',
                  //     });
                  //   }
                  // setValue('phone_number', formattedValue);
                  // setPhoneNumber(formattedValue);
                  // }}
                />
              )}
            />{' '}
            {errors?.phone_number ? (
              <p className="error-required">
                {' '}
                {errors.phone_number.message ===
                'phone_number must be a valid phone number for region undefined'
                  ? 'Phone number is required'
                  : errors.phone_number.message}
              </p>
            ) : null}
          </Form.Group>
        ) : null}
        <Box className="sign-form">
          {' '}
          {['signin', 'signinwithotp'].includes(props.type) && !inputData ? (
            <Form.Group controlId="formEmail" className="mb-3">
              {' '}
              <FormField
                size="md"
                name="email"
                type="text"
                disabled={verifyOtp ? true : false}
                onpaste="return false"
                autocomplete="off"
                onChange={(event) => {
                  setIsMobile(false);
                  console.log("value99232",event.target.value);
                  if (event.target.value.length > 5) {
                    console.log("valuessss22",event.target.value);
                    if (!isNaN(event.target.value)) {
                      setInputData(true);
                      setIsMobile(true);
                      // setSignInValue(event.target.value),
                      setPhoneNumber('91' + event.target.value);
                    } else {
                      setValue('email', event.target.value);
                    }
                  }
                }}
                label="Email/Mobile Number"
                onPaste={handlePaste}
                placeholder="Enter your email or mobile number"
                error={errors.email}
                inputRef={register('email', {
                  required: 'Please enter the email or mobile number',
                  maxLength: {
                    value: 30,
                    message: 'Enter valid email address',
                  },
                  pattern: {
                    value:
                      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,3})+$/,
                    message: 'Enter valid email address',
                  },
                })}
                onKeyPress={(event) => {
                  if (event.which === 32) {
                    event.preventDefault();
                  }
                }}
              />{' '}
            </Form.Group>
          ) : null}
          {/* {['signin'].includes(props.type) && (
            <Form.Group controlId="formEmail" className="mb-3">
              {' '}
              <FormField
                size="md"
                name="email"
                type="text"
                autoComplete="off"
                label="Email/Mobile Number"
                placeholder="Enter your email or mobile number"
                error={errors.email}
                inputRef={register('email', {
                  required: 'Please enter the email or mobileno',
                })}
              />{' '}
            </Form.Group>
          )} */}
          {['signinwithotp'].includes(props.type) && verifyOtp ? (
            <Form.Group controlId="formEmail" className="mt-5 mb-3">
              {' '}
              <Col lg={12}>
                {' '}
                <h2 className="divider line one-line mt-4" contenteditable>
                  {' '}
                  Enter the OTP that has been sent
                </h2>{' '}
              </Col>{' '}
              <OTPInput
                className="align mt-4"
                value={OTP}
                onChange={setOTP}
                autoFocus
                OTPLength={4}
                otpType="number"
              />{' '}
              <ResendOTP
                className="buttonchange"
                onResendClick={resendOtp}
                maxTime={60}
              />{' '}
            </Form.Group>
          ) : null}
          {/* 'signup' */}
          {['setpassword'].includes(props.type) && (
            <Form.Group controlId="oldPass" className="mb-3">
              {' '}
              <FormField
                size="md"
                name="old_password"
                className="nobr"
                type="password"
                label="Old Password"
                placeholder="Enter your old password "
                error={errors.old_password}
                inputRef={register('old_password', {
                  required: 'Please enter Old password',
                })}
              />{' '}
            </Form.Group>
          )}
          {['signin'].includes(props.type) && (
            <Form.Group
              controlId="formPassword"
              className="mb-3 position-relative"
            >
              {' '}
              <FormField
                size="md"
                name="pass"
                className="nobr"
                type="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.pass}
                inputRef={register('pass', {
                  required: 'Please enter the password',
                })}
              />{' '}
            </Form.Group>
          )}
          {['setpassword', 'resetpassword'].includes(props.type) && (
            <Form.Group
              controlId="formPassword"
              className="mb-3 position-relative"
            >
              {' '}
              <FormField
                size="md"
                name="password"
                className="nobr"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                error={errors.password}
                inputRef={register('password', {
                  required: 'Please enter New password',
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
          )}
          {/* 'signup', 'setpassword' */}
          {['setpassword', 'resetpassword'].includes(props.type) && (
            <Form.Group controlId="formConfirmPass" className="mb-3">
              {' '}
              <FormField
                size="md"
                name="confirm_password"
                className="nobr"
                type="password"
                label="Confirm Password"
                placeholder="Enter your new password again"
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
              />{' '}
            </Form.Group>
          )}
        </Box>{' '}
        {options.forgotPassAction && (
          <Link
            to={options.forgotPassPath}
            className="d-flex justify-content-end forget-link"
          >
            {' '}
            {options.forgotPassAction}
          </Link>
        )}
        <Box className="d-flex mt-4 mb-3">
          {' '}
          <Button
            variant="primary"
            block={'true'}
            type="submit"
            disabled={pending}
            className="auth-signup-btn"
          >
            {' '}
            {!pending && (
              <span className="text-white">
                {verifyOtp ? 'Verify OTP' : props.buttonAction}
              </span>
            )}
            {pending && (
              <Span className="d-flex align-items-center justify-content-center">
                {' '}
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden={true}
                  className="align-baseline"
                >
                  {' '}
                  <span className="sr-only"></span>{' '}
                </Spinner>{' '}
                &nbsp; Loading...
              </Span>
            )}
          </Button>{' '}
        </Box>{' '}
        {options.showFooter && <AuthFooter type={type} {...options} />}
      </Box>{' '}
    </Form>
  );
}
export default AuthForm;

