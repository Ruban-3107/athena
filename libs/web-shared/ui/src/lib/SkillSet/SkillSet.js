import './SkillSet.css';
import { Button, Form, ListGroup, Row, Col,ButtonToolbar,ButtonGroup } from 'react-bootstrap';
import { Box, Span } from '@athena/web-shared/ui';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { apiRequest, useAuth } from '@athena/web-shared/utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Spinner from 'react-bootstrap/Spinner';

const schema = yup.object().shape({
  skillset: yup
    .array()
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Skill set is required'),
});
export function SkillSet(props) {
  const auth = useAuth();
  console.log('propss:::', props);
  const [skillset, setskillset] = useState([]);
  const [existingSkillSet, setExistingSkillSet] = useState([]);
  // const [selectedValue, setSelectedValue] = useState([]);
  const [pending, setPending] = useState(false);
  const [isClearable, setIsClearable] = useState(true);

  const {
    handleSubmit,
    register,
    getValues,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    console.log('errorsssssssssss::', errors);
  }, [errors]);

  useEffect(() => {
    getSkillsetdata();
  }, []);

  const getSkillsetdata = async () => {
    const getSkillsetdataResponse = await apiRequest('api/users/skillSet');
    setskillset(getSkillsetdataResponse?.value);
  };
  console.log('skillset', skillset);

  const handleSkillsetChange = (e) => {
    setValue('skillset', e);
    // setSelectedValue(Array.isArray(e) ? e.map((x) => x.id) : []);
    setExistingSkillSet(e);
    // setSelectedValue(Array.isArray(e) ? e.map((x) => x.id) : []);
    // console.log('selectedValue', selectedValue);
    console.log('existingSkillSet:::::::', existingSkillSet);
  };

  useEffect(() => {
    if (
      props.profileData &&
      props.profileData.user &&
      props.profileData.user.users_skillset
    ) {
      // for (const key in props.profileData) {
      //   if (key == 'users_skillset') {
      setExistingSkillSet(props.profileData.user.users_skillset);
      // setSelectedValue(
      //   Array.isArray(props.profileData.user.users_skillset)
      //     ? props.profileData.user.users_skillset.map((x) => x.id)
      //     : []
      // );
    }
    // }
    // }
  }, [props.profileData]);

  const onSubmit = async (data) => {
    data['user_id'] = parseInt(auth?.user?.id);
    data['skillset'] = data['skillset'].map((skillsetid) => skillsetid.id);
    setPending(true);
    if (props.profileData) {
      const updateResponse = await apiRequest(
        `api/users/profiles/${props.profileData.id}`,
        'PUT',
        data
      );
      if (updateResponse) {
        reset();
        props.getProfiledata();
        setPending(false);
        props.handleskillsetclick();
        toast.success(`Skill set details updated successfully`);
      }
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        // className={
        //   props.skillSetEdit ? 'text-hide' : 'input-hide'
        // }
      >
        <Row>
          <Col xl={2}>
            <div
              className='f-16'
            >
              Skills *
            </div>
          </Col>
          <Col xl={7}>
            {props.skillSetEdit ? (
              <Controller
                name="skillset"
                control={control}
                render={({ field }) => (
                  <Select
                    // styles={ customStyles }
                    // {...register('users_type')}
                    // className="dropdown"
                    placeholder="Please select"
                    {...field}
                    isMulti
                    isClearable={isClearable}
                    hideSelectedOptions={false}
                    value={existingSkillSet}
                    options={skillset}
                    onChange={handleSkillsetChange}
                    // getOptionLabel={(option) => option.name}
                    // getOptionValue={(option) => option.id}
                  />
                )}
              />
            ) : (
              <Box className="batch-wrapper mt-0">
                {props.profileData && props.profileData?.user?.users_skillset
                  ? props.profileData?.user?.users_skillset?.map(
                      (data, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Span className="ms-3 mt-3 design">
                              {data.label}
                              {/* <Span
                        className="remover"
                        onClick={() => handleremove(data)}
                      >
                      </Span> */}
                            </Span>
                          </React.Fragment>
                        );
                      }
                    )
                  : '-'}
              </Box>
            )}
          </Col>
        </Row>
        {props.skillSetEdit ? (
          <>
            <br />
            <Box className="d-flex justify-content-end mt-3">
              <Col lg={10} className="btnxprofileUser">
                <ButtonToolbar aria-label="Toolbar with button groups">
                  <ButtonGroup className="me-3" aria-label="First group">
                    <Button
                      className="can-btn space1 rounded-4 px-1"
                      type="button"
                      onClick={props.handleskillsetclick}
                      variant="outline-primary"
                    >
                      Cancel
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup className="me-0" aria-label="Second group">
                    <Button
                      className="saveprofile rounded-4 px-5"
                      // variant="outline-primary"
                      type="submit"
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
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </Box>
          </>
        ) : (
          ' '
        )}
      </Form>
    </>
  );
}
export default SkillSet;
