import './HeaderComponent.css';
import { Navbar, Nav } from 'react-bootstrap';
import { Box,ButtonComponent } from '@athena/web-shared/ui';
import { useRouter } from '@athena/web-shared/utils';

export const HeaderComponent =(props) => {
  const {
    title,
    btnname,
    routeTo,
    isButtonVisible,
  } = props;
  const router = useRouter();
 
  const handleOnClick = (routeTo) => {
    if (routeTo == 'createbatch') {
      return router.navigate('/app/createbatch');
    } else if (routeTo == 'adduser') {
      return router.navigate('/app/adduser');
    } else if (routeTo == 'createcorporate') {
      return router.navigate('/app/createcorporate');
    } else if (routeTo == 'createtopic') {
      return router.navigate('/app/createtopics');
    } else if (routeTo == 'createchapter') {
      return router.navigate('/app/createchapter');
    }
    else if (routeTo == 'createtrack') {
      return router.navigate('/app/createtrack');
    }
    else if (routeTo == 'createcourse') {
      return router.navigate('/app/createcourse');
    }
    else if (routeTo == 'createexercise') {
      return router.navigate('/app/createexercise');
    }
  };
  return (
    <Box>
    <Navbar className="header-admin mb-2" bg="white" expand="lg">
      <Box>
       
        <h4>{title}</h4>
      </Box>
      <Box>
        <Nav className="ms-aut">
          {isButtonVisible && (
            <ButtonComponent
              variant="primary"
              size="lg"
              className="addUser-btny"
              name={btnname}
              onClick={() => handleOnClick(routeTo)}
            />
          )}
        </Nav>
      </Box>
    </Navbar>
  </Box>
  );
}
export default HeaderComponent;
