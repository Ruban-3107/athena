import './EmploymentModal.css';
import { useState, useEffect } from 'react';
import { Form, Modal, Button, Container, Row, Col,ButtonToolbar,ButtonGroup  } from 'react-bootstrap';
import {
  FormField,
  Box,
  Span,
  CloseIcon,
  QuestionIcon,
} from '@athena/web-shared/ui';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiRequest, useAuth } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Spinner from 'react-bootstrap/Spinner';

const schema = yup
  .object()
  .shape({
    company: yup.string().required('Company is required'),
    job_title: yup.string().required('Job Title is required'),
    start_month: yup.date().required('Start Month is required'),
    end_month: yup.date().required('End Month is required'),
    job_description: yup.string().required('Job Description is required'),
  })
  .required();

export function EmploymentModal({ employmentData, ...props }) {
  // const userData = localStorage.getItem('userData')
  //   ? JSON.parse(localStorage.getItem('userData'))
  //   : null;
  const auth = useAuth();
  const { employmentDetails, UpdateEmployment } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pending, setPending] = useState(false);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [fullscreen, setFullscreen] = useState(true);

  const onSubmit = async (data) => {
    data['user_id'] = parseInt(auth.user?.id);
    setPending(true);
    if (UpdateEmployment) {
      const UpdateEmploymentResponse = await apiRequest(
        `api/users/employmenthistory/${UpdateEmployment}`,
        'PUT',
        data
      );
      if (UpdateEmploymentResponse) {
        props.onHide();
        reset();
        setStartDate('');
        setEndDate('');
        setPending(false);
        toast.success('Employment history updated successfully!');
      }
    } else {
      const CreateEmploymentResponse = await apiRequest(
        'api/users/employmenthistory',
        'POST',
        data
      );
      if (CreateEmploymentResponse) {
        props.onHide();
        reset();
        setStartDate('');
        setEndDate('');
        setPending(false);
        toast.success('Employment history added successfully!');
      }
    }
  };

  useEffect(() => {
    if (employmentDetails) {
      for (const key in employmentDetails) {
        if (key == 'start_month') {
          setValue(
            key,
            employmentDetails[key] ? new Date(employmentDetails[key]) : ''
          );
          setStartDate(
            employmentDetails[key] ? new Date(employmentDetails[key]) : ''
          );
        } else if (key == 'end_month') {
          setValue(
            key,
            employmentDetails[key] ? new Date(employmentDetails[key]) : ''
          );
          setEndDate(
            employmentDetails[key] ? new Date(employmentDetails[key]) : ''
          );
        } else {
          setValue(key, employmentDetails[key] ? employmentDetails[key] : '');
        }
      }
    }
  }, [employmentDetails]);

  useEffect(() => {
    console.log('errorssss', errors);
  }, [errors]);

  return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        fullscreen={fullscreen}
        className="sideNav-modal 18,2: modelContent{"
        backdrop="static"
        keyboard={false}
      >
        <Box className="p-36 d-flex align-items-center justify-content-between px-3 mt-4">
          <h6 className="f-18 fw-bold">Add Job History</h6>
          <Span
            onClick={() => {
              props.onHide();
              reset();
            }}
          >
            <CloseIcon />
          </Span>
        </Box>

        <Form onSubmit={handleSubmit(onSubmit)} className="custom-input">
          <Box className="p-36 pt-2 show-grid modal-cnt-wrapper mbg-color">
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Label className="required">Job Title *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="job_title"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="job_title"
                    type="text"
                    error={errors.job_title}
                    inputRef={register('job_title', {
                      required: 'Please enter a job_title',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label className="required">Company *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="company"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="company"
                    type="text"
                    error={errors.company}
                    inputRef={register('company', {
                      required: 'Please enter a company',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label className="required">Start Month *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="start_month"
                  className="mb-3 position-relative"
                >
                  <DatePicker
                    {...register('start_month', {
                      required: 'Please enter a start month',
                    })}
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      if (date > endDate) {
                        setEndDate('');
                      }
                      setValue('start_month', date);
                    }}
                    dateFormat="MM/yyyy"
                    placeholderText="MM/YYYY"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    maxDate={endDate ? endDate : new Date()}
                  />
                  {errors.start_month && (
                    <div className="text-left error-required">
                      {errors.start_month.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label className="required">End Month *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="end_month"
                  className="mb-3 position-relative"
                >
                  <DatePicker
                    {...register('end_month', {
                      required: 'Please enter an end month',
                    })}
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      setValue('end_month', date);
                    }}
                    dateFormat="MM/yyyy"
                    placeholderText="MM/YYYY"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    minDate={startDate}
                    maxDate={new Date()}
                  />
                  {errors.end_month && (
                    <div className="text-left error-required">
                      {errors.end_month.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label className="required">Job Description *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="job_description"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="job_description"
                    type="textarea"
                    rows={4}
                    error={errors.job_description}
                    inputRef={register('job_description', {
                      required: 'Please enter a description',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Box>
          <Box className="p-36 am-footer d-flex justify-content-between">
            <Col lg={10} className="btnxCertificate">
              <ButtonToolbar aria-label="Toolbar with button groups">
                <ButtonGroup className="me-3" aria-label="First group">
                  <Button
                    className="can-btn space1 rounded-4 px-1"
                    type="button"
                    onClick={() => (
                      reset(), 
                      props.onHide(), 
                      setStartDate(''), 
                      setEndDate('')
                    )}
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
        </Form>
      </Modal>
  );
}

