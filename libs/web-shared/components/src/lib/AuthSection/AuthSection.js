import './AuthSection.css';
import { useState, useEffect } from 'react';
import { Auth } from '@athena/web-shared/components';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuth, useRouter } from '@athena/web-shared/utils';

export function AuthSection(props) {
  const auth = useAuth();
  const router = useRouter();
  console.log('auth', auth);

  useEffect(() => {
    if (props.type === 'setpassword' && auth && !auth.user) {
      router.navigate('/auth/signin');
    }
  }, [props.type]);

  // Options by auth type
  const optionsByType = {
    signup: {
      title: 'Get yourself an account',
      buttonAction: 'Sign Up',
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
      buttonAction: 'Sign In',
      showFooter: true,
      requireauth: false,
      signupAction: 'Sign Up',
      signupPath: '/auth/signup',
      signinwithotpAction: 'Sign I n With OTP',
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
      buttonAction: 'Reset Password',
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
      resetPasswordAction: 'Reset password',
      passwordResetPath: '/auth/forgotpass',
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

  return (
    <Container className="" style={{ height: '100%' }}>
      <Row
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100%' }}
      >
        <Col md={8} lg={6} xl={4}>
          <Auth
            type={type}
            buttonAction={options.buttonAction}
            providers={props.providers}
            afterAuthPath={props.afterAuthPath}
            key={type}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default AuthSection;

