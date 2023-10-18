import './WelcomeBackComponent.css';
import { Box, Span,ProfilePhotoComponent} from '@athena/web-shared/ui';
import { useAuth } from '@athena/web-shared/utils';

export function WelcomeBackComponent(props) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const auth = useAuth();

  // const date = new Date();
  // const hour = date.getHours();
  return (
    <Box className="wB-wrapper mt-1">
      {/* <Box className="wB-inner"> */}
      {/* <ProfilePhotoComponent  /> */}
      {/* <Box> */}
      {/* <Span className="wB__welcomeMsg ms-4">Welcome back! John</Span> */}
      {!props?.wish ? (
        <Span className="wB__welcomeMsg ms-4 text-capitalize">
          Welcome back! {auth?.user?.name}
        </Span>
      ) : (
        <h5 className="text-capitalize">Hello {auth?.user?.name} </h5>
      )}

      {/* <h4 className="wB__name">{userData?.name}</h4> */}
      {/* </Box> */}
      {/* </Box> */}
    </Box>
  );
}
// {`Welcome Back, ${profileData?.full_name}`}
export default WelcomeBackComponent;
