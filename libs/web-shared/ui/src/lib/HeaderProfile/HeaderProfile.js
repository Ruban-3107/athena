import './HeaderProfile.css';
import { Box, EditIconLight, Span } from '@athena/web-shared/ui';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { InformationIcon } from '@athena/web-shared/ui';
export function HeaderProfile(props) {
  const { title, subtitle, className, btn, handleEditClick,titleclass } = props;

  const popover = (
    <Popover id="popover-basic">
      {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
      <Popover.Body>{subtitle}</Popover.Body>
    </Popover>
  );

  return (
    <Box className="d-flex align-items-center justify-content-between">
      <Box>
        {/* className={'wave-title' + (className ? ` ${className}` : '')} */}
        <div className="d-flex align-items-center">
        <h5 className={titleclass}>
          {title} &nbsp;&nbsp;&nbsp;
        </h5>
          {/* {subtitle ? (
            <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
              <h3>
                <InformationIcon />
              </h3>
            </OverlayTrigger>
          ) : (
            ''
          )} */}
        </div>
        {/* <p className="text-grey">{subtitle}</p> */}
        {/* <img src="./assets/images/wave.svg" /> */}
      </Box>
      {btn === 'edit' ? (
        <Button
          variant="none"
          className="f-16 d-flex align-items-center gap-3 text-info"
          onClick={() => {
            handleEditClick();
          }}
        >
          <EditIconLight />
          <Span className="text-info">Edit</Span>
        </Button>
      ) : (
        ''
      )}
    </Box>
  );
}
export default HeaderProfile;
