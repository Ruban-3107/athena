
import './AppLayout.css';
import { Box, Sidebar, NavbarCustom } from '@athena/web-shared/ui';
import { requireAuth, Outlet } from '@athena/web-shared/utils';

export const AppLayout = (props) => {
  return (

    <Box className="main-wrapper">
      <NavbarCustom />
      <Box className="content-box">
        <Sidebar />
        <Box className="content-wrapper">{<Outlet />}</Box>
      </Box>
    </Box>

  );
}

export default AppLayout;
