import './ManageTracks.css';
import { Box, Span,BrowseCourseCardView, ButtonComponent,SearchBar, Loader } from '@athena/web-shared/ui';
import React, { useState, useEffect } from 'react';
import { Col,  Row } from 'react-bootstrap';
import { apiRequest, useAuth, useRouter } from '@athena/web-shared/utils';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { statusTypes } from '@athena/web-shared/utils';
export const ManageTracks=(props)=> {
  const [courselist, setcourselist] = useState([]);
  const [foundCoureList, setFoundCourseList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isClearable, setIsClearable] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [filteredCourseList, setFilteredCourseList] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [disableButtonView, setDisableButtonView] = useState(false);
  const [disableDeleteButtonView, setDisableDeleteButtonView] = useState(false);
  const [view, setView] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userrole, setuserrole] = useState('');
  const auth = useAuth();
  const [buttonMessage, setButtonMessage] = useState('');

  useEffect(() => {
    if(auth && auth?.user){
      setuserrole(auth?.user?.role[0]?.name);
    }
  }, [auth?.user]);

  
  console.log("userRoleeeeeeeeeeeee",userrole);


  console.log(selectedStatus, 'ischeck');
  const router = useRouter();

  const getCourse = async () => {
    const coursedetailsresponse = await apiRequest(`api/courses/tracks/children`);
    console.log('ssss', coursedetailsresponse);
    if (coursedetailsresponse?.status === 'success') {
      setcourselist(coursedetailsresponse.value);
      setFilteredCourseList(coursedetailsresponse.value);
      setIsLoading(false);
    } else {
      setcourselist([]);
      setFilteredCourseList([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filterText !== '' || selectedStatus) {
      searchCourse();
    } else {
      getCourse()
    }
  }, [filterText, selectedStatus])

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);

    setIsCheck(courselist.filter((x)=>x.status!=="Published").map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };


  const searchCourse = async () => {
    let url;
    console.log(filterText, selectedStatus, filterText !== '', selectedStatus !== null)
    if (filterText !== '' && selectedStatus !== null || filterText === '' && selectedStatus !== null) {
      // data['searchkey'] = filterText;
      url = `api/courses/tracks/newSearchTracks/fetchTracks?searchKey=${filterText}&&status=${selectedStatus.name}`
    }
    else if (filterText !== '' && selectedStatus === null) {
      url = `api/courses/tracks/newSearchTracks/fetchTracks?searchKey=${filterText}`
    }
    console.log("yyyyyyyy", url);
    const searchedcoursesresponse = await apiRequest(
      url,
      'GET',
      // data
    );
    console.log("hhhhhhhhhhh", searchedcoursesresponse);
    const foundTracksData = searchedcoursesresponse?.value?.tracksData;
    setcourselist(foundTracksData);
    console.log('KAA', foundTracksData);
    // }
  };

  useEffect(() => {
    getCourse();
    setDisableButtonView(false);
    setDisableDeleteButtonView(false);
  }, []);

  const deleteCourses = async () => {
    let data = {};
    data['ids'] = isCheck;

    let deleteCoursesResponse = await apiRequest(
      'api/courses/tracks',
      'DELETE',
      data
    );

    if (deleteCoursesResponse) {
      toast.success('Courses deleted successfully');
      setIsCheck([]);
    }
    setIsCheck([]);
    getCourse();
  };

  const updateCourses = async () => {
    console.log('dddddddddd');
    let data = {};
    data['ids'] = isCheck;
    data['status'] = 'Published';
    console.log(data, 'data');
    let updateCoursesResponse = await apiRequest(
      'api/courses/tracks/status',
      'PUT',
      data
    );

    if (updateCoursesResponse) {
      toast.success('Courses updated successfully');
      setIsCheck([]);
    }
    setIsCheck([]);
    getCourse();
  };
  const handleStatusChange = (selected) => {
    console.log("hiiiiii track");
    console.log(selected,"selected");
    setSelectedStatus(selected);
  };



  useEffect(() => {
    let statusfiltered = courselist?.filter((x) => isCheck.includes(x.id));
    let statuses = statusfiltered.map((x) => x.status);
    if (isCheck.length > 0) {
      let bool1 = statuses.every((val, i, arr) => val === 'Pending Approval');
      let bool = statuses.every((val, i, arr) => val === 'In Draft'||'Pending Approval');
      let bool2 = statuses.every((val, i, arr) => val === 'Approved');
      if (bool2) {
        setDisableButtonView(bool2);
        setButtonMessage('Publish');
      }
      // setDisableButtonView(bool1);
      setDisableDeleteButtonView(bool);
    } else {
      setDisableButtonView(false);
      setDisableDeleteButtonView(false);
    }
  }, [isCheck]);

  const handlecheckchange = (e) => {
    const { id, checked } = e.target;
    console.log('fff', id, checked);
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
    console.log('fff', isCheck, selectedCourses);
  };

  const handlecardclick = (id) => {
    if (userrole == 'Job Architect' || userrole == 'Super Admin') {
      router.navigate(`/app/createtrack/${id}`)
    }
    // else {
    //   null
    // }
  }
console.log(courselist,'hfh')
  return (
    <>
    {isLoading ? (
      <Span className="d-flex align-items-center justify-content-center loader-text">
     <Loader/>
      </Span>
    ) : (
      <>
        <Box className="d-flex justify-content-end align-items-center">
          <Box className="button-box mr-2">
            {disableDeleteButtonView && (
              <ButtonComponent
                name="Delete"
                className="rounded-4 pos1 mr-2"
                onClick={() => {
                  deleteCourses();
                }}
              />
            )}
            {disableButtonView && (
              <ButtonComponent
              name={buttonMessage}
              className="rounded-4 pos2"
                onClick={() => {
                  if (buttonMessage == 'Publish') {
                  updateCourses('Published');
                } else if (buttonMessage == 'Approve') {
                  updateCourses('Approved');
                }
                }}
              />
            )}
          </Box>
          <Box className="mr-2 mt-1">

            <SearchBar
              placeholder="Search course"
              onChange={(e) => {
                console.log("rrrrrr", e.target.value);
                setFilterText(e.target.value);
              }}
              value={filterText}
            />
            {/* <FilterComponent/> */}
          </Box>
          <Box>
            <Select
              className="sort_course mt-1"
              // styles={ customStyles }
              placeholder="Status"
              isSearchable={true}
              isClearable={isClearable}
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
              value={selectedStatus}
              options={statusTypes}
              onChange={handleStatusChange}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
            />
          </Box>

        </Box>
        <Box>
          {view ? (<div className="form-check d-flex pl-5 pb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id={`checkbox-${""}`}
              checked={isCheckAll}
              onChange={handleSelectAll}
            />
            <label className="form-check-label ll ml-0 mt-0" htmlFor={`checkbox-${"id"}`}>Select All</label>
          </div>) : (<div className="form-check d-flex pl-5" />)}
        </Box>
        {courselist?.length>0?(
           <Box className="pl-3 pr-3">
           <Row xxl={6} xl={5} lg={4} md={3} sm={1} className="g-4">
               {courselist?.map((course) => (
               <Col
                 className="px-1"
                 
               >
                 <BrowseCourseCardView
                   cardContents={course}
                   clickEvent={() => { handlecardclick(course.id) }}
                   checkbox={true}
                   browsecourse={true}
                   status={course.status}
                   cardclass="p-2 rounded-3"
                   handleClick={handlecheckchange}
                   isChecked={isCheck.includes(course.id)}
                   course={course}
                   chapterlength={course.chaptersCount}
                   topiclength={course.topicsCount}
                   courseDuration={course.totalCourseDuration}
                 />
               </Col>
             ))}
           </Row>
         </Box>
        ):(
          <Box style={{ textAlign: 'center' }} className="mt-5">
          <img
            src="assets/images/nodataimage.png"
            width={'200px'}
            height={'250px'}
            alt="Nodata"
          />
          <h5 className="mb-3 mt-4 h5">No Courses to show</h5>
          <p className="fs-6 mb-3 text-secondary">
            Courses after added will be displayed here.
          </p>
        </Box>
        )}
       
      </>
    )}
  </>
  );
}
export default ManageTracks;
