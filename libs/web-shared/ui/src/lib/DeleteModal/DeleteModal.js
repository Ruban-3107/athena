import './DeleteModal.css';
import {
  Button,
  Modal,
  ButtonToolbar,
  ButtonGroup,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import {
  Span,
  ExclamationIcon
} from '@athena/web-shared/ui';
import { useState, useEffect } from 'react';


export function DeleteModal(props) {
  console.log(props, 'props.deleteResponse');
  return (
    <Modal {...props} backdrop="static" keyboard={false}>
      <div className="p-5">
        <Modal.Title className={props.type === 'Certificate' || 'EmploymentHistory' ? "d-flex gap-3 font-n" : "d-flex gap-3 font-nn"}>
          <ExclamationIcon />
          {`Are you sure to  ${props.type == 'Disable' ? 'disable' : props.type == 'Enable' ? 'enable' : props.type == 'Approve' ? 'approve' : props.type == 'Reject' ? 'reject' : props.type == 'Cancel' ? 'cancel' : 'delete'
            } this ?`}
        </Modal.Title>
        {props.deleteData !== 'schedule' &&
          (<Modal.Body className="font-vv ms-4">
            {props.type == 'Disable'
              ? 'Disabling this will temporarily suspend the account, to enable contact Super Admin.'
              : props.type == 'Enable'
                ? 'Once enabled, the user will be able to access the system and perform actions.'
                : props.type == 'Approve'
                  ? 'Once approved, the user will be added to the active user list.'
                  : props.type == 'Reject'
                    ? 'Once rejected,the user will be moved to the inactive user list.'
                    : 'Deleting this will remove the data permanently from the system.'}
          </Modal.Body>)
        }
        <Row>
          <Col lg={12} className="btnxDelete mt-4">
            <ButtonToolbar aria-label="Toolbar with button groups">
              <ButtonGroup className="me-3" aria-label="First group">
                <Button
                  className="radius-btn"
                  variant="outline-secondary"
                  onClick={() => {
                    props.onHide(true);
                  }}
                >
                  No
                </Button>
              </ButtonGroup>
              <ButtonGroup className="me-0" aria-label="Second group">
                <Button
                  className="radiusss-btn"
                  type='submit'
                  onClick={
                    props.type === 'Certificate' || 'EmploymentHistory'
                      ?
                      props.deleteResponse
                      :
                      null

                    // if (props.multidelete?.length == 0 && props.delete.length > 0) {
                    //   handleDelete(props.delete);
                    // } else if (props.delete?.length == 0 && props.multidelete?.length > 0) {
                    //   handleDelete(props.multidelete);
                    // }else if(props.multidelete.length >=1){
                    //   handleDelete(props.multidelete);
                    // }
                  }
                >
                  {props.pending ? (
                    <Span className="d-flex align-items-center justify-content-center">
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden={true}
                        className="align-baseline"
                      >
                        <span className="sr-only"></span>
                      </Spinner>
                      &nbsp; Loading...
                    </Span>
                  ) : (
                    <>Yes</>
                  )}
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
export default DeleteModal;


// import './delete-modal.css';
// import { useState, useEffect } from 'react';
// import {Modal, Button} from 'react-bootstrap';


// export function DeleteModal(props) {
//   return (
//     <Modal {...props}>
//     <Modal.Header closeButton>
//     </Modal.Header>
//     <Modal.Body>
//       <p>{`Are you sure?  Do you want to delete this '${props.deleteData}'`}</p>
//     </Modal.Body>
//     <Modal.Footer>
//     <Button variant="primary" onClick={props.deleteResponse}>
//         Yes
//       </Button>
//       <Button variant="secondary" onClick={props.onHide}>
//         No
//       </Button>
//     </Modal.Footer>
//   </Modal>
//   );
// }
// export default DeleteModal;
