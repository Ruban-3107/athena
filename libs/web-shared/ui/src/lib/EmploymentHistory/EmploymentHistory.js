import './EmploymentHistory.css';
import { Button, } from 'react-bootstrap';
import {
  Box,
  Span,
  EmploymentModal,
  PrivacyDropdown,
  EditIcon,
  DeleteIcon,
  DeleteModal,
  Avatar,
  EditIconLight,
  Modal
} from '@athena/web-shared/ui';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import { apiRequest } from '@athena/web-shared/utils';

export function EmploymentHistory(props) {
  const [EmploymentmodalShow, setEmploymentModalShow] = useState(false);
  const [employmentData, setEmploymentData] = useState(null);
  const [updateEmployment, setUpdateEmployment] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [show, setShow] = useState(false);
  const [pending,setPending]=useState(false)

  const handleClose = () => {
    setShow(false);
    props.getProfiledata();
  };

  const handleEmploymentHistoryDelete = async (id) => {
    setPending(true);
    const deleteEmploymentResponse = await apiRequest(
      `api/users/employmenthistory/emp/${id}`,
      'DELETE'
    );

    if (deleteEmploymentResponse) {
      setPending(false);
      handleClose();
      setDeleteItem(null);
      setUpdateEmployment(null);
      setEmploymentData(null);
      toast.success('Employment history deleted successfully!');
    }

  };


  return (
    <>
      <DeleteModal
        show={show}
        onHide={() => {
          handleClose();
          setDeleteItem(null);
        }}
        deleteResponse={() => {
          if (deleteItem?.job_title) {
            handleEmploymentHistoryDelete(deleteItem?.id);
          }
        }}
        deleteData={deleteItem?.job_title}
        type = 'EmploymentHistory'
        pending={pending}
      />
      {/* <Modals 
        show={show}
        onHide={() => {
          handleClose();
          setDeleteItem(null);
        }}
        deleteResponse={() => {
          if (deleteItem?.job_title) {
            handleEmploymentHistoryDelete(deleteItem?.id);
          }
        }}
        deleteData={deleteItem?.job_title}
        type = 'EmploymentHistory'
      /> */}
      <EmploymentModal
        show={EmploymentmodalShow}
        onHide={() => {
          setEmploymentModalShow(false);
          setUpdateEmployment(null);
          setEmploymentData(null);
          props.getProfiledata();
        }}
        employmentDetails={employmentData}
        UpdateEmployment={updateEmployment}
      />
      <Box>
        <Box className="d-flex justify-content-between align-items-center profile-sec">
          <button 
            onClick={() => {
              setEmploymentModalShow(true)}
            }
            type="button"
            className="emphistory-btn text-white"
            // name="+ Add Job History"
          >
            + Add Job History
          </button>
          {/* <PrivacyDropdown /> */}
        </Box>
        {props.profileData?.userProfilesUser?.user_employment_history &&
          props.profileData?.userProfilesUser?.user_employment_history.length
          ? props.profileData?.userProfilesUser?.user_employment_history.map(
            (employmentHistory, index) => (
              <Box className="mt-3 mt-md-5" key={index}>
                <ul className="job-list">
                  <li>
                    {/* <Span> */}
                      {/* <Avatar src="assets/images/job-placeholder.svg"
                        alt="placeholder"/> */}
                      {/* <img
                        src="assets/images/job-placeholder.svg"
                        alt="placeholder"
                      /> */}
                    {/* </Span> */}
                    <Span className="historyalign">
                      <Span className="profiles-title">
                        {employmentHistory.job_title}
                      </Span>
                      <br />
                      <Span className="font-1 text-grey">
                        <Span>{employmentHistory.company}</Span>
                        <br />
                        <Span>
                          <Moment format="MMM YYYY">
                            {employmentHistory.start_month}
                          </Moment>{' '}
                          -{' '}
                          <Moment format="MMM YYYY">
                            {employmentHistory.end_month}
                          </Moment>
                        </Span>
                        <br />
                        <Span>{employmentHistory.job_description}</Span>
                      </Span>
                      <ul className="cd-link-list mt-3">
                        <li>
                          <EditIconLight />
                          &nbsp; &nbsp;
                          <Link
                            className="view-more"
                            onClick={() => {
                              setEmploymentModalShow(true);
                              setUpdateEmployment(employmentHistory.id);
                              setEmploymentData(employmentHistory);
                            }}
                          >
                            Edit
                          </Link>
                        </li>
                        <li>
                          <DeleteIcon />
                          &nbsp; &nbsp;
                          <Link
                            className="view-more"
                            onClick={() => {
                              setShow(true);
                              setDeleteItem(employmentHistory);
                            }}
                          >
                            Delete
                          </Link>
                        </li>
                      </ul>
                    </Span>
                  </li>
                </ul>
              </Box>
            )
          )
          : null}
      </Box>
    </>
  );
}
export default EmploymentHistory;
