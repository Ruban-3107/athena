
import './AuthFooter.css';
import { Link } from '@athena/web-shared/utils';
import { Span, Box } from '@athena/web-shared/ui';
export function AuthFooter(props) {
  console.log('Propssssssssss:', props);
  return (
    <Box className="AuthFooter-admin mt-2">
      {props.type === 'signup' && (
        <>
          <Span
            className="create-account-admin sign-in-txt mb-2"
            style={{ color: '#40A9FF' }}
          >
            {props.signinText}
            <Link
              to={props.signinPath}
              className="ms-1"
              style={{ color: '#40A9FF' }}
            >
              {props.signinAction}
            </Link>
          </Span>
          <Span className="create-account-adminBelow">
            By signing up, you agree to our
            <Link
              to={props.termsPath}
              className="ms-1"
              style={{ color: '#40A9FF' }}
            >
              {props.termspathtext}
            </Link>
            &nbsp;and
            <Link
              to={props.privacyPolicyPath}
              className="ms-1"
              style={{ color: '#40A9FF' }}
            >
              {props.privacypolicytext}
            </Link>
          </Span>
        </>
      )}

      {(props.type === 'signinwithotp' || props.type === 'signin') && (
        <>
          <Span className="signin-head">
            <Link
              to={
                props.type == 'signin'
                  ? props.signinwithotpPath
                  : props.signinPath
              }
              style={{ color: '#40A9FF' }}
            >
              {props.type == 'signin'
                ? props.signinwithotpAction
                : props.signinAction}
            </Link>
          </Span>
          <Span className="create-account-admin" style={{ color: '#40A9FF' }}>
            <Link
              to={props.signupPath}
              style={{ color: '#40A9FF' }}
              className="sign-in-txt"
            >
              Create new account?&nbsp; {props.signupAction}
            </Link>
          </Span>
          {/* <Span className="d-flex"> */}
          {/* <Form.Check type="checkbox" label="Remember me" /> */}
          {/* {props.forgotPassAction && (
              <Link to={props.forgotPassPath} className="ms-auto">
                {props.forgotPassAction}
              </Link>
            )} */}
          {/* </Span> */}
        </>
      )}

      {props.type === 'forgotpass' && (
        <Box className="text-center">
          {/* {props.signinText} */}
          <Span className="text-black">
            Back to&nbsp;{' '}
            <Link
              to={props.signinPath}
              className="forgotpassfoot-admin"
              style={{ color: '#40A9FF' }}
            >
              {props.signinAction}
            </Link>
          </Span>
          &nbsp;
        </Box>
      )}
    </Box>
  );
}
export default AuthFooter;
