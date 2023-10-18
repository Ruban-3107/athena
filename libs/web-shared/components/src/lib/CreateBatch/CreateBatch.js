import './CreateBatch.css';
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import BatchDetails from '../BatchDetails/BatchDetails';
import Batchusers from '../BatchUsers/BatchUsers'
import Batchusersnew from '../BatchUsersNew/BatchUsersNew';

import BatchCourses from '../BatchCourses/BatchCourses';
import Stepper from 'bs-stepper';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  useFormState,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSearchParams } from 'react-router-dom';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { toast } from 'react-toastify';
import { Span } from '@athena/web-shared/ui';
import Spinner from 'react-bootstrap/Spinner';
import { create_batch_validations, useRouter, apiRequest } from '@athena/web-shared/utils';

const addBatchSchema = yup.object().shape({
  batch_name: yup
    .string()
    .required(create_batch_validations?.batch_name)
    .min(2, create_batch_validations?.batch_name_min)
    .max(20, create_batch_validations?.batch_name_max)
    .matches(/^\s*\S.*[a-zA-Z]{2,20}$/, create_batch_validations?.batch_name),
  description: yup
    .string()
    .required(create_batch_validations?.description)
    .min(10, create_batch_validations?.description_min)
    .max(250, create_batch_validations?.description_max)
    .matches(/^\s*\S.*[a-zA-Z,.]{10,250}$/, create_batch_validations?.description),
  corporate_group: yup
    .object()
    .shape({
      name: yup.string().max(255).required(create_batch_validations?.corporate_group),
    })
    .nullable()
    .required(create_batch_validations?.corporate_group),
  client_representative: yup.object().shape({
    name: yup.string().max(225).nullable(),
  }),
  training_facilitator: yup.object().shape({
    name: yup.string().max(225),
  }),
  // startdate_enddate: yup.date().nullable()
  start_date: yup.date().required(create_batch_validations?.start_date),
  end_date: yup.date().nullable(),
});
export const userContext = createContext();
export const userContexttwo = createContext();
export const courseContext = createContext();

export function CreateBatch() {
  const methods = useForm({

  });
  // const name = 'React';
  const stepperRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepColor, setStepColor] = useState(false);
  const [batchesData, setBatchesdata] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [usertwo, setUserTwo] = useState(null);

  // const [updatedUser, setUpdatedUser] = useState([]);
  const [verifyuser, setVerifyUser] = useState(null);
  const [selectedcourse, setSelectedcourse] = useState([]);

  const [editUserdata, setEditUserData] = useState([]);
  const [edittrack, setEditTrack] = useState([]);
  const [editstartdate, setEditStartDate] = useState(null);
  const [editenddate, setEditEndDate] = useState(null);
  const [steperror, setStepError] = useState(true);
  const [clearSearch, setClearSearch] = useState(false);
  // const [clearSearchtwo, setClearSearchTwo] = useState(false);
  const [clearuserdata, setClearUserData] = useState(false);
  const [stepButton, setStepButton] = useState({
    buttonOne: false,
    buttonTwo: true,
    buttonThree: true,
    buttonFour: true,
  });
  const [pending, setPending] = useState(false);

  const [initialUsers, setInitialUsers] = useState({ users: [], userobjs: [] });

  const id = searchParams.get('id');
  const router = useRouter();
  // const { errors } = useFormState();

  useEffect(() => {
    console.log("pppppp", clearSearch);
  }, [clearSearch])

  useEffect(() => {
    stepperRef.current = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: false,
    });
    const firstStepContent = document.querySelector('#test-l-1');
    firstStepContent.classList.add('active');
    console.log('eeeeeeeeeeeee', id);
    if (id) {
      getBatchByid();
    }
    console.log('lllllllllll', methods);
  }, []);

  useEffect(() => {
    if (batchesData) {
      for (const key in batchesData) {
        console.log('keyssssssss', key, batchesData[key]);
        methods.setValue(key, batchesData[key]);
        if (key === 'name') {
          methods.setValue('batch_name', batchesData[key]);
        } else if (key === 'client') {
          methods.setValue('corporate_group', {
            id: batchesData[key].id,
            name: batchesData[key].corporate_group,
          });
          // setCorporateGroup()
        } else if (key === 'client_rep_user') {
          methods.setValue('client_representative', {
            id: batchesData[key].id,
            name: batchesData[key].email,
          });
        } else if (key === 'train_fac_user') {
          methods.setValue('training_facilitator', {
            id: batchesData[key].id,
            name: batchesData[key].email,
          });
        } else if (key === 'createdAt') {
          methods.setValue('start_date', new Date(batchesData[key]));
          setEditStartDate(new Date(batchesData[key]));
        } else if (key === 'end_at') {
          methods.setValue('end_date', new Date(batchesData[key]));
          setEditStartDate(new Date(batchesData[key]));
        } else if (key === 'batch_learners_users') {
          let a = batchesData[key].map((x) => {
            return {
              id: x.id,
              emailid: x.email,
              fullname: x.first_name,
            };
          });
          setEditUserData(a);
          methods.setValue('initial_selected_users');
        } else if (key === 'user_tracks') {
          let b = batchesData[key].map((x) => x.track_id);
          setEditTrack(b);
        }
      }
      console.log('ddddddddd', methods.getValues());
    }
  }, [batchesData]);

  const properties = [
    {
      type: 'manual',
      name: 'batch_name',
      message: create_batch_validations?.batch_name,
    },
    {
      type: 'manual',
      name: 'description',
      message: create_batch_validations?.description,
    },
    {
      type: 'manual',
      name: 'corporate_group',
      message: create_batch_validations?.corporate_group,
    },
    {
      type: 'manual',
      name: 'start_date',
      message: create_batch_validations?.start_date,
    },
  ];

  const fixinitialusers = (userargs, userobjargs) => {
    console.log("iddddddddddddddd", userargs, userobjargs)
    setInitialUsers({ users: userargs, userobjs: userobjargs })
  }

  const getBatchByid = async () => {
    const batchresponse = await apiRequest(`api/batches/batches/${id}`, 'GET');
    console.log('batchresponse', batchresponse);
    if (batchresponse?.status === 'success') {
      setBatchesdata(batchresponse?.value?.batchData);
      // setFilteredUserData(batchData);
    } else {
      toast.error(batchresponse?.message.message);
    }
  };

  const clearUser = () => {
    console.log("camehereeee");
    // if (clearuserdata) {
    //   setClearUserData(false);
    //   setClearUserData(true);
    // }
    // else {
    setClearUserData(true);
    // }
  }

  // const handleUser = useCallback((data1, data2) => {
  //   console.log("datattt", data1, data2);
  //   if (data1 && JSON.stringify(data1) !== JSON.stringify(user)) {
  //     setUser(data1);
  //   }
  //   if (data2 && JSON.stringify(data2) !== JSON.stringify(verifyuser)) {
  //     setVerifyUser(data2);
  //   }
  //   console.log("userrrrrrrr:", user, verifyuser)
  // }, [user, verifyuser])

  // const handleUserOne = useCallback((data) => {
  //   console.log("updated--Use", data);
  //   if (data && JSON.stringify(data) !== JSON.stringify(usertwo)) {
  //     // setUser(data);
  //     setUserTwo(data);
  //   }
  // }, [usertwo])

  // const handleCourse = (data) => {
  //   console.log("ddddddddddd", data);
  //   setSelectedcourse(data);
  // }

  const onSubmitHandler = async (e) => {
    if (methods?.getValues('courses_selected')?.length > 0) {
      console.log('3232323232', methods.getValues(), methods);
      console.log('************', e);
      console.log('eeeeeeee', user, selectedcourse);
      let data = {};
      setPending(true);
      if (e) {
        data['name'] = e.batch_name;
        data['description'] = e.description;
        data['client_id'] = Number(e.corporate_group?.id);
        data['training_facilitator'] = Number(e.training_facilitator?.id);
        data['client_representative'] = Number(e.client_representative?.id);
        data['learners'] = e.final_users;
        data['tracks_assigned'] = e.courses_selected;
        data['started_at'] = e.start_date;
        data['end_at'] = e.end_date;
      }
      console.log('yuyiyyi', data);
      const createResponse = await apiRequest(
        `api/batches/batches`,
        'POST',
        data
      );
      console.log('createResponse', createResponse);
      if (createResponse?.status === 'success') {
        setPending(false);
        toast.success('Batch created successfully!');
        methods.reset();
        setUser([]);
        setVerifyUser([]);
        setSelectedcourse([]);
        setActiveStep(0);
        router.navigate('/app/managebatches');
      } else {
        toast.error(createResponse.message);
      }
    } else {
      toast.warn('Please select atleast one course');
    }
  };

  return (
    <div>
      <div id="stepper1" className="bs-stepper">
        <div className="bs-stepper-header">
          <div className="step" data-target="#test-l-1">
            <button className="step-trigger" disabled={stepButton?.buttonOne}>
              <span className="bs-stepper-label">Batch Details</span>
            </button>
          </div>
          <div className="line"></div>
          <div className="step" data-target="#test-l-2">
            <button className="step-trigger" disabled={stepButton?.buttonTwo}>
              <span className="bs-stepper-label">Add Users</span>
            </button>
          </div>
          <div className="line"></div>
          <div className="step" data-target="#test-l-3">
            <button className="step-trigger" disabled={stepButton?.buttonThree}>
              <span className="bs-stepper-label">Verify Users</span>
            </button>
          </div>
          <div className="line"></div>
          <div className="step" data-target="#test-l-4">
            <button className="step-trigger" disabled={stepButton?.buttonFour}>
              <span className="bs-stepper-label">Add Courses</span>
            </button>
          </div>
        </div>

        <div className="bs-stepper-content">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
              <div id="test-l-1" className="content">
                <div className="form-group">
                  <BatchDetails
                    data={{
                      start_date: editstartdate ?? null,
                      end_date: editenddate ?? null,
                    }} clearUser={() => { clearUser() }} userd={clearuserdata}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonprev"
                    onClick={() => {
                      methods.reset();
                      methods.setValue('corporate_group', null);
                      methods.setValue('client_representative', null);
                      methods.setValue('training_facilitator', null);
                      methods.setValue('start_date', null);
                      methods.setValue('end_date', null);
                      console.log('2323232', methods.getValues());
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonnext ms-2"
                    onClick={(e) => {
                      console.log(
                        '22222222',
                        stepperRef.current,
                        methods.getValues()
                      );
                      let emptyCheckArray = [];
                      properties.forEach(({ name, type, message }) => {
                        if (
                          (typeof methods.getValues(name) === 'string' &&
                            methods.getValues(name).length < (name == 'description' ? 10 : 2)) ||
                          methods.getValues(name) === undefined ||
                          methods.getValues(name) === null
                        ) {
                          console.log("errrrrrrrin batche")
                          methods.setError(name, { type, message });
                          emptyCheckArray.push(false);
                        } else {
                          methods.clearErrors(name);
                        }
                      });
                      if (emptyCheckArray.includes(false) && methods.formState.errors) {
                        e.preventDefault();
                      } else {
                        // setClearUserData(prevClearUserData => !prevClearUserData);
                        setActiveStep(activeStep + 1);
                        stepperRef.current.next();
                        setStepButton({
                          ...stepButton,
                          buttonOne: true,
                          buttonTwo: false,
                        });
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div id="test-l-2" className="content">
                <div className="form-group">
                  {/* <userContext.Provider value={{ handle: handleUser  }}> */}

                  {/* <userContext.Provider value={{ handle: (val1, val2) => { handleUser(val1, val2) } }}> */}
                  <Batchusers
                    clientId={methods.getValues().corporate_group?.id ?? null} clearsearch={clearSearch} clearData={clearuserdata} fixinitialusers={fixinitialusers}
                  />
                  {/* handle={handleUser} compname="addUser" */}
                  {/* </userContext.Provider> */}
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonprev"
                    onClick={() => {
                      stepperRef.current.previous();
                      setStepButton({
                        ...stepButton,
                        buttonOne: false,
                        buttonTwo: true,
                      });
                      setClearSearch(prevClearSearch => !prevClearSearch);
                      // setClearSearch(false);
                      // setClearSearch(true);
                    }}
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary batchbuttonnext ms-2"
                    onClick={(e) => {

                      methods.setValue('initial_selected_users', initialUsers.users);
                      methods.setValue('initial_selected_userObjects', initialUsers.userobjs);
                      if (
                        methods.getValues('initial_selected_users').length > 1
                      ) {
                        setVerifyUser(
                          initialUsers.userobjs
                          // methods.getValues('initial_selected_userObjects')
                        );
                        stepperRef.current.next();
                        setStepButton({
                          ...stepButton,
                          buttonTwo: true,
                          buttonThree: false,
                        });
                        // setClearSearch(true);
                        setClearSearch(prevClearSearch => !prevClearSearch);
                      } else {
                        e.preventDefault();
                        toast.warn('Please select atleast two users');
                      }
                    }}
                  >
                    Verify Users
                  </button>
                </div>
              </div>
              <div id="test-l-3" className="content">
                <div className="form-group">
                  {/* <userContexttwo.Provider value={{ handle: handleUser, selected: true }}> */}
                  {/* <Batchusersnew data={verifyuser}  second={(dat)=>handleUserOne(dat)} /> */}
                  {/* ()=>handleUser() selectuser={true} */}
                  {/* handleUserFunction={handleUser1} selected={true} */}
                  <Batchusersnew data={verifyuser} clearsearch={clearSearch} clearData={clearuserdata} />
                  {/* handle={handleUser} */}
                  {/* </userContexttwo.Provider> */}
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonprev"
                    onClick={() => {
                      stepperRef.current.previous();
                      setStepButton({
                        ...stepButton,
                        buttonTwo: false,
                        buttonThree: true,
                      });
                      // setClearSearch(true);
                      // setClearSearchTwo(prevClearSearchTwo => !prevClearSearchTwo);
                      setClearSearch(prevClearSearch => !prevClearSearch);
                      setClearUserData(false);
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonnext ms-2"
                    onClick={(e) => {
                      console.log('semiiiifinallll', methods.getValues());
                      // if (methods.getValues('final_users').length === 0) {
                      //   methods.setValue('final_users', methods.getValues('initial_selected_users'))
                      // }
                      if (methods.getValues('final_users').length > 1) {
                        stepperRef.current.next();
                        setStepButton({
                          ...stepButton,
                          buttonThree: true,
                          buttonFour: false,
                        });
                        // setClearSearch(true);
                        // setClearSearchTwo(prevClearSearchTwo => !prevClearSearchTwo);
                        setClearSearch(prevClearSearch => !prevClearSearch);
                      } else {
                        e.preventDefault();
                        toast.warn('Please select atleast two users');
                      }
                      console.log('finallll', methods.getValues());
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
              <div id="test-l-4" className="content">
                <div className="form-group">
                  {/* <courseContext.Provider value={{ handle: handleCourse, course: edittrack ?? null }}> */}
                  <BatchCourses clearsearch={clearSearch} />
                  {/* </courseContext.Provider> */}
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary batchbuttonprev"
                    onClick={() => {
                      setClearSearch(prevClearSearch => !prevClearSearch);
                      setVerifyUser(
                        methods.getValues('initial_selected_userObjects')
                      );
                      stepperRef.current.previous();
                      setStepButton({
                        ...stepButton,
                        buttonThree: false,
                        buttonFour: true,
                      });
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary batchbuttonnext ms-2"
                    disabled={pending}
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
                      <>Submit</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
export default CreateBatch;

