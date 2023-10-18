
import './AuthLayout.css';
import { Box,NavbarCustom } from '@athena/web-shared/ui';
import { Outlet } from '@athena/web-shared/utils';

export const AuthLayout = (props) => {
  return (
    <Box className="Auth-wrapper">
      <NavbarCustom app={props.app} />
      <Box className="Auth-form-wrapper">{<Outlet />}</Box>
    </Box>
  );
}
export default AuthLayout;
