import './Auth.css';
import { useState } from 'react';
import { useRouter, useAuth,requireAuth } from '@athena/web-shared/utils';
import { AuthForm } from '@athena/web-shared/components';
import { Card } from 'react-bootstrap';
import { FormAlert } from '@athena/web-shared/ui';
import { Link } from "react-router-dom";

export function Auth(props) {
  const router = useRouter();
  const auth = useAuth();
  const [formAlert, setFormAlert] = useState(null);
  const [setpassword,setSetPassword] = useState(false);

  const handleAuth = (user) => {
    console.log('userssssssssssssss',user)
    if (user.isPasswordChanged && user?.role?.[0]?.['name'] === 'Client Representative'){
      router.navigate('/app/manageuser');
    }
    else if(user.isPasswordChanged) {
      router.navigate(props.afterAuthPath);
    }
    else {
      router.navigate('/auth/setpassword');
    }
  };

  const handleFormAlert = (data) => {
      setFormAlert(data);
  };

  const handlePasswordChangedSuccess = ()=>{
    setSetPassword(true);
  }

  return (
    <>
    {formAlert && (
      <FormAlert type={formAlert.type} message={formAlert.message} />
    )}
    {
    (!setpassword) ?
    <Card
      style={{
        boxShadow: ' 0px 0px 8px rgba(0, 0, 0, 0.25)',
        borderRadius: '14px',
      }}
      className="Auth-card"
    >
      <Card.Body className={props.type === 'signup' ? "Auth-card-body" : "Auth-card-body p-5"}>
        {[
          'signup',
          'signin',
          'forgotpass',
          'setpassword',
          'signinwithotp',
          'forgotpass',
          'resetpassword'
        ].includes(props.type) && (
          <>
            {/* {props.providers && props.providers.length && ( */}
            <>
              <h4 className="mb-3 mt-2">
                {props.type === 'signin'
                  ? 'Sign In'
                  : props.type === 'signup'
                  ? 'Sign Up'
                  : props.type === 'forgotpass'
                  ? 'Forgot Password'
                  : props.type === 'signinwithotp'
                  ? 'Sign In'
                  : props.type === 'setpassword'
                  ? 'Set Password'
                  : props.type === 'resetpassword'
                  ? 'Reset Password' 
                  : ' '
                  }
              </h4>
              {/* <AuthSocial
                buttonAction={props.buttonAction}
                providers={props.providers}
                showLastUsed={true}
                onAuth={handleAuth}
                onError={(message) => {
                  handleFormAlert({
                    type: 'error',
                    message: 'ddsds',
                  });
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="1"
                viewBox="0 0 30 1"
                className="mt-3 mt-md-5"
              >
                <rect id="line" width="30" height="1" fill="#c0bdcc" />
              </svg> */}

              {/* <small className="d-block my-3 f-14" style={{ color: '#7A86A1' }}>Or sign in using your email address</small> */}
              {/* <small className="d-block my-3 f-14" style={{ color: '#7A86A1' }}>
                {props.type == 'signin'
                  ? 'Or sign in using your email address'
                  : 'Or sign up using your email address'}
              </small> */}
            </>
            {/* )} */}
          </>
        )}
          <AuthForm
          type={props.type}
          buttonAction={props.buttonAction}
          onAuth={handleAuth}
          onFormAlert={handleFormAlert}
          onSetPassword={handlePasswordChangedSuccess}
        />
      </Card.Body>
    </Card>
    :
    
    <p className="text-center">Click
      <Link
      to={{ pathname:"/auth/signin" }} className="ms-1 me-1 a">
       here
      </Link>
    to Sign In
    </p>
    }
    </>
  );
}
export default Auth;

