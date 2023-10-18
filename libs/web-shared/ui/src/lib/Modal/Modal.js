import './Modal.css';
import {Button,Modal,ButtonToolbar,ButtonGroup,Row,Col,Spinner} from 'react-bootstrap';
import  { useState} from 'react';
import {Span,ExclamationIcon,RejectViewCrossIcon} from '@athena/web-shared/ui';
import { toast } from 'react-toastify';
import {apiRequest, useRouter } from '@athena/web-shared/utils';
export function Modals(props) {
  const router=useRouter();
  const [inputValue, setInputValue] = useState('');
  const [pending,setPending] = useState(false);
  let id;
  id=props.id;
console.log(props,"propssssssssssssssssssss");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
   
  const updateTopicStatus = async (value) => {
 
    //  const value = event.target.value;
    // console.log(value,"eeeeeeeeeeeeeeeeeeeeeeeeeee");
    //  setStatus(value);
    //console.log(status,"fffffffffffffffffffff");
      let data={};
      if(value === "Rejected"){
         data['status']=value;
         data['reason']=inputValue;
      }else{
        data['status']=value;
      }
      setPending(true);
      let statusUpdateResponse = await apiRequest(
        `api/courses/topics/${id}`,
        'POST',
        data
        );
        if(statusUpdateResponse){
          setPending(false);
          props.onHide();
          toast.success(`Topic ${value} successfully`);
          setInputValue('');
          router.navigate(`/app/managetopics`)

        }
  }
  const updateChapterStatus = async (value) => {
 
    //  const value = event.target.value;
    // console.log(value,"eeeeeeeeeeeeeeeeeeeeeeeeeee");
    //  setStatus(value);
    //console.log(status,"fffffffffffffffffffff");
      let data={};
      if(value === "Rejected"){
         data['status']=value;
         data['reason']=inputValue;
      }else{
        data['status']=value;
      }
      setPending(true);
      console.log(data['status'],"modalstatus");
      let statusUpdateResponse = await apiRequest(
        `api/courses/chapters/${id}`,
        'PUT',
        data
        );
        if(statusUpdateResponse){
          setPending(false);
          props.onHide();
          toast.success(`Chapter ${value} successfully`);
          setInputValue('');
          router.navigate(`/app/managechapter`)
        }
  }
  const updateCourseStatus = async (value) => {
   
    console.log('trackey', value);
    let data = {};
    if (value === "Approved") {
      data['status'] = value;
    } else {
      data['status'] = value;
      data['reason'] = "reason for reject"
    }
    let statusUpdateResponse = await apiRequest(
      `api/courses/tracks/${id}`, 'PUT', data
    )
    if (statusUpdateResponse.status == 'success') {
      toast.success(`Course ${value} successfully`);
      router.navigate(`/app/managecourse`);
    }
    else {
      toast.error(statusUpdateResponse.message)
    }
  }

  const updateTrackStatus = async (value) => {
    //  const value = event.target.value;
    // console.log(value,"eeeeeeeeeeeeeeeeeeeeeeeeeee");
    //  setStatus(value);
    //console.log(status,"fffffffffffffffffffff");
    let data = {};
    if (value === 'Rejected') {
      data['status'] = value;
      data['reason'] = inputValue;
    } else {
      data['status'] = value;
    }
    setPending(true);
    console.log(data['status'], 'modalstatus');
    let statusUpdateResponse = await apiRequest(
      `api/courses/tracks/${id}`,
      'PUT',
      data
    );
    if (statusUpdateResponse) {
      setPending(false);
      props.onHide();
      toast.success(`track ${value} successfully`);
      setInputValue('');
      router.navigate(`/app/managetrack`);
    }
  };
  console.log('props::::', props.type);
  console.log('inputValue', inputValue);


  
  const handleDelete = async (users) => {
    console.log('batchids', users);
    const user_id = users.map((x) => parseInt(x.id));
    console.log('user_id', user_id);
    setPending(true);
    if (props.type === 'Disable' || props.type === 'Enable' || props.type === 'Approve') {
      const Url = `api/users/[${user_id}]/${props.type === 'Disable'
          ? 'disable'
          : props.type === 'Enable'
            ? 'enable'
            : props.type === 'Approve'
              ? 'approve'
              : ''
        }`;
      console.log('UrlUrlUrlUrlUrl', Url);
      const disableresponse = await apiRequest(Url, 'DELETE');
      if (disableresponse.status === 'success') {
        setPending(false);
        props.onHide();
        toast.success(
          props.type === 'Disable'
            ? (user_id.length > 1 ? 'User disabled successfully!' : 'Users disabled successfully!')
            : props.type === 'Enable'
              ? (user_id.length > 1 ? 'User enabled successfully!' : 'Users enabled successfully!')
              : props.type === 'Approve'
                ? (user_id.length > 1 ? 'User approved successfully!' : 'Users approved successfully!')
                : props.type === 'Reject'
                  ? (user_id.length > 1 ? 'User rejected successfully!' : 'Users rejected successfully!')
                  : ''
        );
      } else {
        props.onHide();
        toast.error(disableresponse.message.message);
      }
    }
    // API call for delete particular client
    else if (props.type === 'Corporate') {
      // console.log("*******************");
      setPending(true);
      const deleteUrl = `api/users/clients/deleteclient/[${user_id}]`;
      const deleteResponse = await apiRequest(deleteUrl, 'DELETE');
      if (deleteResponse.status === 'success') {
        setPending(false);
        props.onHide();
        toast.success(
          user_id.length > 1
            ? 'Corporate groups deleted successfully!'
            : 'Corporate group deleted successfully!'
        );
      } else {
        props.onHide();
        toast.error(deleteResponse.message);
      }
    } else if (props.type == 'topic') {
      console.log('hello topic');
      let temp = true;
      let stat;
      setPending(true);
      if (users.length == 1) {
        stat = users.map((x) => x.status);
        console.log(stat, "statustopic");
        if (!stat?.includes('In Draft')&& !stat?.includes('Approved')) temp = false;
      }
      if (temp) {
        let data = {};
        data['ids'] = users.map((e) => e.id);
        let deleteTopicsResponse = await apiRequest(
          'api/courses/topics/deleteTopics',
          'DELETE',
          data
        );
        if (deleteTopicsResponse) {
          setPending(false);
          props.onHide();
          toast.success(
            user_id.length > 1
              ? 'Topics deleted successfully!'
              : 'Topic deleted successfully!'
          );
        }
      } else {
        props.onHide();
        toast.error(`You cannot delete  ${stat}  topic`);
        return null;
      }
    } else if (props.type == 'chapter') {
      let temp = true;
      let stat;
      setPending(true);
      if (users.length == 1) {
        stat = users.map((x) => x.status);
        if (!stat?.includes('In Draft')) temp = false;
      }
      if (temp) {
        let data = {};
        data['ids'] = users.map((e) => e.id);
        let deleteChaptersResponse = await apiRequest(
          'api/courses/chapters/deleteChapters',
          'DELETE',
          data
        );
        if (deleteChaptersResponse) {
          setPending(false);
          props.onHide();
          toast.success(
            user_id.length > 1
              ? 'Chapters deleted successfully!'
              : 'Chapter deleted successfully!'
          );
        }
      } else {
        props.onHide();
        toast.error(`you cannot delete  ${stat}  chapter`);
        return null;
      }
    } else if (props.type == 'batch') {
      let data = {};
      setPending(true);
      console.log('zzzzzzzzzz', users);
      data['ids'] = users.map((e) => e.id);
      console.log(data, 'data');
      const deleteresponse = await apiRequest(
        'api/batches/batches/delete/batch',
        'DELETE',
        data
      );
      if (deleteresponse?.status=="success") {
        setPending(false);
        props.onHide();
        toast.success(
          user_id.length > 1
            ? 'Batches deleted successfully!'
            : 'Batch deleted successfully!'
        );
      } else {
        props.onHide();
        toast.error(deleteresponse.message);
      }
    } else if (props?.type === 'technology' || props?.type == 'domain') {
      let id = props.delete[0].id;
      console.log('VV', props.delete[0].id);
      setPending(true);
      console.log('MM', id);
      try {
        let response = await apiRequest(
          `api/courses/domainTechnology/deleteDomainTechnology/${id}`,
          'DELETE'
        );
        setPending(false);
        console.log('result', response);
        if (response && response.status === 'success') {
          props.onHide();
          if (props?.type === 'technology') {
            toast.success('Technolgy deleted successfully!');
          } else {
            toast.success('Domain deleted successfully!');
          }
        } else {
          props.onHide();
          if (response.message === "This domain/technology can't be deleted") {
            if (props.buttonName === 'Add Technolgy') {
              toast.warn(`Sorry,this technology can't be deleted`);
            } else {
              toast.warn(`Sorry,this domain can't be deleted`);
            }
          }
        }
      } catch (error) {
        setPending(false);
        props.onHide();
        console.error(error);
      }
    } else if (props?.type === 'companies') {
      let id = props.delete[0].id;
      console.log('VV', props.delete[0].id);
      setPending(true);
      console.log('MM', id);
      try {
        let response = await apiRequest(
          `api/users/company/delete/${id}`,
          'DELETE'
        );
        setPending(false);
        console.log('result', response);
        console.log('RESTAT', response.status);
        props.onHide();
        if (response && response.status === 'success') {
          props.onHide();
          toast.success('Company deleted successfully!');
        }
      } catch (error) {
        setPending(false);
        props.onHide();
        console.error(error);
      }
    } else {
      setPending(true);
      const url = `api/users/[${user_id}]`;
      const deleteresponse = await apiRequest(url, 'DELETE');
      console.log('deleteresponse', deleteresponse);
      if (deleteresponse.status === 'success') {
        setPending(false);
        props.onHide();
        toast.success(
          user_id.length > 1
            ? 'Users deleted successfully!'
            : 'User deleted successfully!'
        );
      } else {
        // console.log("deleteresponse.message",deleteresponse.message);
        props.onHide();
        toast.error(deleteresponse.message);
      }
    }
  };
  return (
    <>
    <Modal {...props} backdrop="static" keyboard={false}>
      <div className="p-5">
        <Modal.Title className={props.type == 'RejectView' ? "d-flex gap-3 font-nn" : "d-flex gap-3 font-n"}>
        {props.type == 'RejectView' ? 
       <div className="d-flex">
            <button
             onClick={() => {
                    props.onHide(true);
                    setInputValue('')
                  }}
            className='reject-view-button me-0'>
               <RejectViewCrossIcon />
              </button>
          </div> : ('')}
         
          {props.type == 'RejectView'?(" "):( 
            <>
          <ExclamationIcon />
         
          {`Are you sure to  ${props.type == 'Disable' ? 'disable' : props.type == 'Enable' ? 'enable' : props.type == 'Approve' ? 'approve' : props.type == 'Reject' ? 'reject' : props.type == 'RejectView' ? 'reject' : props.type == 'statusReview' ? 'Review':props.type == 'chapterStatusReview' ? 'Review':'delete'
            } this ?`}
            </>
          )}
        </Modal.Title>
        <Modal.Body className="font-vv ms-4">

          {props.type == 'Disable'
            ? 'Disabling this will temporarily suspend the account, to enable contact Super Admin.'
            : props.type == 'Enable'
              ? 'Once enabled, the user will be able to access the system and perform actions.'
              : props.type == 'Approve'
                ? 'Once approved, the user will be added to the active user list.'
                : props.type == 'Reject'
                  ? 'Once rejected,the user will be moved to the inactive user list.'
                  : props.type !== 'RejectView' && props.type !=='statusReview'&& props.type !=='chapterStatusReview'
                  ? 'Deleting this will remove the data permanently from the system.'
                  : props.type ==='statusReview'
                  ?'once review this, the topic status will be Review In Progress'
                  : props.type ==='chapterStatusReview'
                  ?'once review this, the topic status will be Review In Progress'
                  :null}
          {props.type === 'RejectView' && 
            <div class="">
              <p className='input-text-reject mb-2'>Reason</p>
              <input value={inputValue} type='text' onChange={handleInputChange} placeholder='Enter Your Reason' class="input-modal-reject-msg input-reject-topicview" />
            </div>

          }
            
        </Modal.Body>
        <Row>
          <Col lg={12} className="btnxDelete mt-4">
            <ButtonToolbar aria-label="Toolbar with button groups">
              <ButtonGroup className="me-3" aria-label="First group">
                <Button
                  className={props.type == "RejectView"?("reject-btn-cancel-borderradius"):("radius-btn")}
                  variant="outline-secondary"
                  onClick={() => {
                    props.onHide(true);
                    setInputValue('')
                  }}
                  
                >
                 {props.type=="RejectView"?("Cancel"):("No")}
                </Button>
              </ButtonGroup>
              <ButtonGroup className="me-0" aria-label="Second group">
                <Button
                  className={props.type == "RejectView"?("reject-btn-borderradius"):("radiusss-btn")}
                  //  reject-btn-borderradius create-btn
                  disabled={pending}
                  onClick={() => {
                    // console.log('multideletelength', props.multidelete.length);
                    if (
                      props.multidelete?.length == 0 &&
                      props.delete.length > 0
                    ) {
                      console.log(
                        'wwwwwwwwwwww',
                        props.delete,
                        props.multidelete
                      );
                      handleDelete(props.delete);
                    } else if (
                      props.delete?.length == 0 &&
                      props.multidelete?.length > 0
                    ) {
                      console.log(
                        '2nddddddddd',
                        props.delete,
                        props.multidelete
                      );
                      handleDelete(props.multidelete);
                    } else if (props.multidelete?.length >= 1) {
                      handleDelete(props.multidelete);
                    }
                    else if(props.value =="Reject"){
                      if(props.valuetype == "topic"){
                    
                        updateTopicStatus("Rejected");
                      }else if(props.valuetype == "chapter"){
                        updateChapterStatus("Rejected")

                      }else if(props.valuetype == "course"){
                        updateCourseStatus("Rejected")                      }
                    }else if(props.valuetype == "topic"){
                      updateTrackStatus("Rejected")
                    }
                    else if (props.type === "statusReview") {
                      updateTopicStatus("Review In Progress")
                    }else if (props.type === "chapterStatusReview") {
                      updateChapterStatus("Review In Progress")
                    }
                  }}
                >
                  {pending ? (
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
                  <>{props.type=="RejectView"?("Reject"):("Yes")}</>
                )}
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
      </div>
    </Modal>
  </>
  );
}
export default Modals;
