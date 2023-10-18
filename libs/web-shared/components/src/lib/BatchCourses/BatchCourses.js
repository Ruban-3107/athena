import './BatchCourses.css';
import { Box, BrowseCourseCardView } from '@athena/web-shared/ui';
import { Col, Row } from 'react-bootstrap';
import { SearchBar } from '@athena/web-shared/ui';
import { useEffect, useState, useContext } from 'react';
// import { courseContext } from 'libs/admin-web-shared/components/src/lib/CreateBatch/CreateBatch';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { apiRequest } from '@athena/web-shared/utils';
import {
  useFormContext,
  useForm,
  Controller,
  useFormState,
} from 'react-hook-form';
import { toast } from 'react-toastify';

 export const BatchCourses = (props) => {
   const [isCheckAll, setIsCheckAll] = useState(false);
   const [isCheck, setIsCheck] = useState([]);
   const [selectedcourses, setSelectedcourses] = useState([]);
   const [coursedata, setcoursesdata] = useState([]);
   const [foundcoursedata, setFoundcoursesdata] = useState([]);
   const [filterText, setFilterText] = useState('');
   const [view, setView] = useState(true);

   // const coursecontext = useContext(courseContext);

   const methods = useFormContext();

   useEffect(() => {
     if (isCheck) {
      console.log("rrrrrrrrrrrr",methods.getValues());
       methods.setValue('courses_selected', isCheck);
       // coursecontext?.handle(isCheck)
     }
   }, [isCheck]);

   useEffect(() => {
     console.log("uiuiuiui", props?.clearsearch, filterText === '');
     // if (clearsearch) {
     setFilterText('');
     // }
   }, [props?.clearsearch]);
   // useEffect(() => {
   //   setIsCheck(coursecontext?.course);
   // }, [coursecontext?.course])

   useEffect(() => {
     getcourses();
   }, []);

   const convertToMin = (duration) => {
     let hours = duration / 60;
     let minutes = duration % 60;
     return {
       hours: hours,
       minutes: minutes,
     };
   };

   const modifyCourseObject = (data) => {
     let cdata = data?.map((x) => {
       let topicArray = [],
         array1 = [];
       for (const i of x.track_chapters) {
         for (const j of i.chapter_topics) {
           topicArray.push(j);
           array1.push(Number(j.duration));
         }
       }
       const initialValue = 0;
       const sumWithInitial = array1.reduce(
         (accumulator, currentValue) => accumulator + currentValue,
         initialValue
       );
       return {
         id: x.id,
         title: x.title,
         subtitle: x.slug,
         image_url: x.image_url,
         courseDuration: convertToMin(sumWithInitial),
         chaplength: x.track_chapters.length,
         toplength: topicArray.length,
       };
     });
     return cdata;
   };

   const getcourses = async () => {
     const courseresponse = await apiRequest(
       'api/courses/tracks/status_type/Published',
       'GET'
     );
     console.log('courseresponse', courseresponse);
     if (courseresponse?.status === 'success') {
       const finalData = modifyCourseObject(courseresponse?.value);
       setcoursesdata(finalData);
       setFoundcoursesdata(courseresponse?.value);
     } else {
       toast.error(courseresponse?.message.message);
     }
   };

   const handleSelectAll = (e) => {
     setIsCheckAll(!isCheckAll);

     setIsCheck(foundcoursedata.map((li) => li.id));
     if (isCheckAll) {
       setIsCheck([]);
     }
   };

   // useEffect(() => {
   //   console.log("qqqqqq",isCheckAll, isCheck.length, coursedata.length);
   //   if (isCheck.length == coursedata.length) {
   //     setIsCheckAll(true);
   //   }
   //   else {
   //     setIsCheckAll(false);
   //   }
   // }, [isCheck, isCheckAll])
   useEffect(() => {
     if (filterText) {
       searchCourse();
     } else {
       getcourses();
     }
   }, [filterText]);

   const searchCourse = async () => {
     let data = {};
     if (filterText !== '') {
       data['searchkey'] = filterText;
       const searchedcoursesresponse = await apiRequest(
         `api/courses/tracks/search/searchTracks`,
         'POST',
         data
       );
       console.log('tyttytyt', searchedcoursesresponse);
       const foundTracksData = modifyCourseObject(
         searchedcoursesresponse?.value
       );
       setFoundcoursesdata(foundTracksData);
       console.log('KAA', foundTracksData);
     }
   };

   // const filter = (e) => {
   //   const keyword = e.target.value;
   //   if (keyword !== '') {
   //     setView(false);
   //     const results = coursedata.filter((course) => {
   //       return (
   //         course.title?.toLowerCase()?.includes(keyword.toLowerCase()) ||
   //         course.subtitle?.toLowerCase()?.includes(keyword.toLowerCase())
   //       );
   //     });
   //     setFoundcoursesdata([...results]);
   //   } else {
   //     setView(true);
   //     setFoundcoursesdata([...coursedata]);
   //   }
   // };

   const handleClick = (e) => {
     console.log('wwwwwwwww', e);
     const { id, checked } = e.target;
     setIsCheck([...isCheck, id]);
     console.log(e.target.id, e.target.checked, 'is checked id handleclick');
     if (!checked) {
       setIsCheck(isCheck.filter((item) => item !== id));
       setIsCheckAll(false);
     }
     console.log('sssssssss', isCheck);
   };

   const handleClear = () => {
     if (filterText) {
       // setResetPaginationToggle(!resetPaginationToggle);
       setFilterText('');
     }
   };
   const catalog = foundcoursedata?.map((e) => {
     return (
       <Col className="p-1">
         <BrowseCourseCardView
           checkbox
           cardContents={e}
           chapterlength={e.chaplength}
           topiclength={e.toplength}
           courseDuration={e.courseDuration}
           browsecourse
           cardclass="p-2"
           handleClick={handleClick}
           isChecked={isCheck.includes(e.id)}
         />
       </Col>
     );
   });

   return (
     <>
       <Row>
         <Box className="d-flex justify-content-between align-items-center">
           {view ? (
             <div className="form-check d-flex pl-5">
               <input
                 className="form-check-input"
                 type="checkbox"
                 id={`checkbox-${''}`}
                 checked={isCheckAll}
                 onChange={handleSelectAll}
               />
               <label
                 className="form-check-label ll ml-0 mt-0"
                 htmlFor={`checkbox-${'id'}`}
               >
                 Select All
               </label>
             </div>
           ) : (
             <div className="form-check d-flex pl-5" />
           )}
           <SearchBar
             onChange={(e) => setFilterText(e.target.value)}
             // onChange={filter}
             // onClear={handleClear}
             filterText={filterText}
             value={filterText}
             defaultValue={filterText}
           />
         </Box>
       </Row>
       {foundcoursedata?.length > 0 ? (
         <Row xs={1} md={3} lg={4} xl={6} className="mt-4 g-4">
           {catalog}
         </Row>
       ) : (
         <CustomNoData />
       )}
     </>
   );
}
export default BatchCourses;

const CustomNoData = (props) => {
  return (
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
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};