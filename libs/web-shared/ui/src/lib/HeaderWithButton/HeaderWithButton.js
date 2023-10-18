import './HeaderWithButton.css';
import { Button, OverlayTrigger, Popover, NavLink } from 'react-bootstrap';
import { Box, Span } from '@athena/web-shared/ui';
import { useRouter } from '@athena/web-shared/utils';
export const HeaderWithButton =(props)=> {
  const {
    title,
    subtitle,
    btnText,
    routeTo,
    isButtonVisible,
    isDisabled,
    handleButtonClick,
    btnClass,
    size,
    isviewAll,
  } = props;
  const router = useRouter();
  const popover = (
    <Popover id="popover-basic">
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <Popover.Body>{subtitle}</Popover.Body>
    </Popover>
  );

  const handleOnClick = (routeTo) => {
    if (routeTo == 'browse') {
      return router.navigate('/app/browse');
    } else if (routeTo == 'Join Course') {
      handleButtonClick();
    } else if (routeTo == 'User Courses') {
      return router.navigate('/app/mycourses');
    } else if (routeTo == 'statistics') {
      return router.navigate('/app/statistics');
    } else if (routeTo == 'contributions') {
      return router.navigate('/app/contributions');
    } else if (routeTo == 'managecourse') {
      return router.navigate('/app/managecourses');
    } else if (routeTo == 'schedule') {
      return router.navigate('/app/calendar');
    }
  };
  return (
    <Box className="d-flex justify-content-between align-items-center mt-5">
    <Box>
      {/*className="wave-title" */}
      <div className="d-flex justify-content-start">
        <h3 className={props.titleclass}>{title} &nbsp;&nbsp;&nbsp;</h3>
        {/* <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
          <p className="mt-1">
            <InformationIcon />
          </p>
        </OverlayTrigger> */}
      </div>

      {/* <p className="mb-1 text-grey w-95">{subtitle}</p> */}

      {/* <img src="./assets/images/wave.svg" /> */}
    </Box>
    {isviewAll && (
      <NavLink
        style={{ fontSize: 'large', color: '#648ad8' }}
        onClick={() => handleOnClick(routeTo)}
      >
        {btnText}&nbsp;&nbsp;&nbsp;&gt;
      </NavLink>
    )}

    {isButtonVisible && (
      <Box>
        <Button
          variant={props?.btnColor ? 'primary' : 'dark'}
          disabled={isDisabled}
          onClick={() => handleOnClick(routeTo)}
          size={size}
          className={btnClass}
        >
          {btnText}
        </Button>
      </Box>
    )}
  </Box>
  );
}
export default HeaderWithButton;
