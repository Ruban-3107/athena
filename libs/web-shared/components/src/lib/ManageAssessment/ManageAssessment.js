import './ManageAssessment.css';
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import {
  HeaderComponent,
  Box
} from '@athena/web-shared/ui';
import { DataTableComponent,SearchBar,  ButtonComponent,EditIcon,DeleteIcon,FilterIcon,  PrevIcon,NextIcon,  Modals,  Loader} from '@athena/web-shared/ui';
import { Button, Tooltip } from 'react-bootstrap';
import { Span, DataTableComponentTwo } from '@athena/web-shared/ui';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../../../../utils/src';

export function ManageAssessment(props) {
  const params = useParams();
  const { id } = params;


    const columns = [
      {
        name: 'Assessment ',
        selector: (row) => (
          <div className="d-flex justify-content-between">
            {/* <span onClick={() => {
              router.navigate(`/app/createtopics/${row.id}`);
            }}>
              {row.topicname}
            </span> */}
            {row?.title}
            
          </div>
        ),
        sortable: true,
      },
      {
        name: (
          <>
            {' '}
            Course
            <Dropdown drop="">
              {' '}
              <Dropdown.Toggle variant="white">
                {' '}
                <FilterIcon />{' '}
              </Dropdown.Toggle>{' '}
              <Dropdown.Menu>
                {' '}
                <Dropdown.Item
                  href=""
                  // onClick={() => {
                  //   setTopicType('all');
                  // }}
                >
                  {' '}
                  All
                </Dropdown.Item>{' '}
                {/* {topicTypeData.map((topicType, index) => ( */}
                  <React.Fragment >
                    <Dropdown.Item
                      href=""
                      // onClick={() => {
                      //   setTopicType(topicType.id);
                      // }}
                    >
                      {/* {' '}
                      {console.log(topicType.name, 'typename')}
                      {topicType.name} */}
                    </Dropdown.Item>{' '}
                  </React.Fragment>
                
              </Dropdown.Menu>{' '}
            </Dropdown>{' '}
          </>
        ),
        selector: (row) =>  row?.domainTechnology?.name,
        //sortable: true,
      },
      {
        name: (
          <>
            {' '}
            Status
            <Dropdown drop="">
              {' '}
              <Dropdown.Toggle variant="white">
                {' '}
                <FilterIcon />{' '}
              </Dropdown.Toggle>{' '}
              <Dropdown.Menu>
                {' '}
                <Dropdown.Item
                  href=""
                  onClick={() => {
                    // setDeliveryType('all');
                  }}
                >
                  {' '}
                  All
                </Dropdown.Item>{' '}
                {/* {deliveryTypeData.map((deliveryTypeData, index) => ( */}
                  <React.Fragment>
  
                    {/* {console.log(deliveryTypeData, "deliveryTypeData")} */}
                    <Dropdown.Item
                      href=""
                      // onClick={() => {
                      //   setDeliveryType(deliveryTypeData.id);
                      // }}
  
                    >
                      {' '}
                      {/* {deliveryTypeData.name} */}
                    </Dropdown.Item>{' '}
                  </React.Fragment>
                {/* ) */}
              </Dropdown.Menu>{' '}
            </Dropdown>{' '}
          </>
        ),
        selector: (row) => row?.status,
        //sortable: true,
      },
      
      {
        name: 'Action',
        id: 'action-name',
        selector: (row) => (
          <div className="d-flex justify-content-between">
          {/* <span
            onClick={() => {
              if (row.status == 'Published') {
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              } else if(row.status == "Approved" && rolesToCheck.includes(userrole)) {
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              }else if(row.status == "Review In Progress" && userrole =="Trainer"){
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              }else{
                  setModalShow(true);
                  setDeleteTopic(row);
                  setenablePublishButtonView(false);
                }
            }}
            className="btn p-2 ms-3"
          >
            {' '}
            <DeleteIcon />{' '}
          </span>{' '} */}
        </div>
        ),
        width: '7rem',
      },
    ];


 

  const checkStatus = ['Published', 'Approved'];
  const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];
  const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress'];
  const editpageApproveButtonStatus = [
    'Rejected',
    'Pending Approval',
    'Review In Progress',
  ];
  const [isEdit, setIsEdit] = useState(true);
  const [assessment,setAssessment]=useState('')

  const handleEdit = (value) => {
    setIsEdit(value);
  };

  const getAllAssement = async()=>{
    const getAssessment = await apiRequest('api/courses/assessments/getAllAssessment','GET') 
    if(getAssessment.status=='success'){
      console.log("getAssessment:",getAssessment.value)
      setAssessment(getAssessment.value)
    }
   }

  useEffect(()=>{

    getAllAssement()

  },[])

  return (
    <>
      <div className="d-flex  justify-content-end mt-5">
        <Button
          variant="primary"
          style={{borderRadius:"24px"}}
          className="f-16 d-flex align-items-center gap-3"
          onClick={() => {
            handleEdit(isEdit ? false : true);
          }}
        >
          <Span className="">
            {isEdit ? 'Edit Assessment' : 'Manage Assessment'}
          </Span>
        </Button>
      </div>

      <HeaderComponent title={'Manage Asssessment'} hidebreadcumb />
      <DataTableComponentTwo
       columns={columns}
       data={assessment}
       noDataComponent={<CustomNoData/>} />
    </>
  );
}

export default ManageAssessment;
const CustomNoData = () => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Assessment to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Added Assessment will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
}
