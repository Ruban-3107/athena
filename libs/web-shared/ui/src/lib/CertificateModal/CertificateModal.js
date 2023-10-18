import './CertificateModal.css';
import { useState, useEffect } from 'react';
import { Form, Modal, Button, Row, Col,ButtonToolbar,ButtonGroup } from 'react-bootstrap';
import {
  FormField,
  ImagePreview,
  Box,
  QuestionIcon,
  CloseIcon,
  CrossIcon,
  Span,
} from '@athena/web-shared/ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiRequest, useAuth } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const schema = yup
  .object()
  .shape({
    // provider : yup.string().min(3).max(15).label('Provider').required('Provider is required'),
    date_achieved: yup.mixed().required('Date achieved is required'),
    date_expires: yup.mixed(),
    certification_url: yup.string().url().nullable().optional(),
    // certificate_upload: yup.mixed()
    //   .test('required', "Please upload a Certificate", (value) => {
    //     return value != null
    //   })
    //   .test("type", "We only support pfd format", function (value) {
    //     return value && (value.type === "image/pdf");
    //   }),
  })
  .required();

export function CertificateModal({
  certificateDetails,
  UpdateCertification,
  ...props
}) {
  const auth = useAuth();
  // const userData = localStorage.getItem('userData')
  //   ? JSON.parse(localStorage.getItem('userData'))
  //   : null;
  const [pdfData, setPdfData] = useState(null);
  const [pending, setPending] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [providerName, setProviderName] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [existingProvider, setExistingProvider] = useState([]);
  const [createValue, setCreateValue] = useState(null);
  const [dateAchieved, setDateAchieved] = useState('');
  const [dateExpires, setDateExpires] = useState('');
  const [existingPdf, setExistingPdf] = useState(null);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    getProvider();
  }, []);

  useEffect(() => {
    console.log('error', errors);
  }, [errors])

  const getProvider = async () => {
    const getProviderResponse = await apiRequest('api/users/certification_providers');
    setProviderName(getProviderResponse);
  };

  const handleChange = (e) => {
    setExistingProvider(e);
    setSelectedValue(e);
    // Array.isArray(e) ? e.map((x) => x.id) : []
  };
  const handleCreate = (e) => {
    let obj = { label: e };
    setExistingProvider(obj);
    setCreateValue(e);
    setSelectedValue(e);
  };

  useEffect(() => {
    if (certificateDetails) {
      for (const key in certificateDetails) {
        if (key === 'providers') {
          if (UpdateCertification) {
            setExistingProvider(certificateDetails[key]);
            setSelectedValue(certificateDetails[key]);
          }
        }
        if (key === 'providers') {
          setExistingProvider(certificateDetails[key]);
        }
        if (key === 'certificate_upload') {
          setExistingPdf(
            certificateDetails[key]
              ? decodeURIComponent(certificateDetails['certificate_upload'])
                  .split('/')
                  .pop()
              : null
          );
          setPdfData(certificateDetails[key]);
        }
        if (key === 'date_achieved' || key === 'date_expires') {
          key === 'date_achieved'
            ? setDateAchieved(
                certificateDetails[key] ? new Date(certificateDetails[key]) : ''
              )
            : setDateExpires(
                certificateDetails[key] ? new Date(certificateDetails[key]) : ''
              );
          setValue(
            key,
            certificateDetails[key] ? new Date(certificateDetails[key]) : ''
          );
        } else {
          setValue(key, certificateDetails[key] ? certificateDetails[key] : '');
        }
      }
    }
  }, [certificateDetails]);

  const fileData = (data) => {
    // setExistingPdf(null);
    setPdfData(data);
    setValue('certificate_upload', data);
  };

  const removeFile = () => {
    setExistingPdf(null);
    setPdfData(null);
    setValue('certificate_upload', null);
  };

  const onSubmit = async (data) => {
    data['user_id'] = parseInt(auth.user?.id);
    data['certificate_upload'] = pdfData;
    data['provider_id'] = selectedValue.id ?? null;
    data['create_provider'] = createValue ?? null;
    data['date_achieved'] = moment(data['date_achieved']).format('YYYY-MM-DD');
    data['date_expires'] = data['date_expires']
      ? moment(data['date_expires']).format('YYYY-MM-DD')
      : '';
    setPending(true);
    const formData = new FormData();
    for (const property in data) {
      // if (data[property] == 'null') data[property] = null;
      // if (typeof data[property] == 'string' && data[property]?.trim() == '')
      //   data[property] = null;
      if (
        property == 'certificate_upload' &&
        typeof data[property] === 'object'
      ) {
        data[property] = data[property][0];
      }

      formData.append(property, data[property]);
      // property.forEach((data) => {
      //   formData[data[property]] = '';
      // });
    }

    // formData.append(property, data[property]);
    // property.forEach((data) => {
    //   formData[data[property]] = '';
    // });
    // [...formData.entries()].forEach((e) => console.log('zzzzzzzzz', e));
    // const payload = new URLSearchParams(formData);

    if (UpdateCertification) {
      const UpdateCertificationResponse = await apiRequest(
        `api/users/certifications/${UpdateCertification}`,
        'PUT',
        formData,
        true
      );
      console.log("uiuiui", UpdateCertificationResponse);
      if (UpdateCertificationResponse) {
        props.onHide();
        reset();
        setSelectedValue('');
        setExistingProvider('');
        setDateAchieved('');
        setDateExpires('');
        setPending(false);
        setExistingPdf('');
        toast.success('Certificate updated successfully!');
      }
      else {
        setPending(false);
        toast.error('error in Certificate upload');
      }
    } else {
      const CreateCertificationResponse = await apiRequest(
        'api/users/certifications',
        'POST',
        formData,
        true
      );
      console.log("uiuiui", CreateCertificationResponse);
      if (CreateCertificationResponse) {
        props.onHide();
        reset();
        setSelectedValue('');
        setExistingProvider('');
        setDateAchieved('');
        setDateExpires('');
        setPending(false);
        setExistingPdf('');
        toast.success('Certificate uploaded successfully!');
      }
      else {
        setPending(false);
        toast.error('error in Certificate upload');
      }
    }
  };

  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        fullscreen={fullscreen}
        className="sideNav-modal"
        backdrop="static"
        keyboard={false}
      >
        <Box className="p-36 d-flex align-items-center justify-content-between px-3 mt-4">
          <h6 className="f-18 fw-bold">
            {certificateDetails ? 'Update' : 'Upload'} Certificate
          </h6>
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
          <Box className="p-36 pt-2 show-grid modal-cnt-wrapper">
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Label className="required">Provider</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="title"
                  className="mb-3 position-relative"
                >
                  <CreatableSelect
                    className="dropdown"
                    placeholder="Select Option"
                    //value={skillset.filter(obj => selectedValue.includes(obj.value))} // set selected values
                    value={existingProvider ? existingProvider : createValue}
                    options={providerName} // set list of the data
                    onCreateOption={handleCreate} // creating new provider
                    onChange={handleChange} // assign onChange function
                    isClearable
                  />
                  {/* <FormField
                    size="lg"
                    name="provider_id"
                    type="text"
                    error={errors.provider_id}
                    inputRef={register('provider_id', {
                      required: 'Please enter a title',
                    })}
                  /> */}
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label>Certification Type</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="certification_type"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="certification_type"
                    type="text"
                    error={errors.certification_type}
                    inputRef={register('certification_type', {
                      //required: 'Please enter a certification type',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label className="required">Date Achieved *</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="date_achieved"
                  className="mb-3 position-relative"
                >
                  {/* <FormField
                    size="lg"
                    name="date_achieved"
                    type="date"
                    error={errors.date_achieved}
                    inputRef={register('date_achieved', {
                      required: 'Please enter a date achieved',
                    })}
                  /> */}
                  <DatePicker
                    {...register('date_achieved', {
                      required: 'Please enter a date achieved',
                    })}
                    className="form-control"
                    selected={dateAchieved}
                    onChange={(date) => {
                      setDateAchieved(date);
                      setValue('date_achieved', date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    // dayPlaceholder="dd"
                    // monthPlaceholder="mm"
                    // yearPlaceholder="yyyy"
                    // showMonthYearPicker
                    // showFullMonthYearPicker
                  />
                  {errors.date_achieved && (
                    <div className="text-left error-required">
                      {errors.date_achieved.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label>Date Expires</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="date_expires"
                  className="mb-3 position-relative"
                >
                  {/* <FormField
                    size="lg"
                    name="date_expires"
                    type="date"
                    error={errors.date_expires}
                    inputRef={register('date_expires', {
                      // required: 'Please enter a date expires',
                    })}
                  /> */}
                  <DatePicker
                    {...register('date_expires')}
                    className="form-control"
                    selected={dateExpires}
                    onChange={(date) => {
                      setDateExpires(date);
                      setValue('date_expires', date);
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    minDate={dateAchieved}
                    // dayPlaceholder="dd"
                    // monthPlaceholder="mm"
                    // yearPlaceholder="yyyy"
                    // showMonthYearPicker
                    // showFullMonthYearPicker
                  />
                  {errors.date_expires && (
                    <div className="text-left error-required">
                      {errors.date_expires.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label>Certification ID</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="certification_id"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="certification_id"
                    type="text"
                    error={errors.certification_id}
                    inputRef={register('certification_id', {
                      //required: 'Please enter a certification id',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center mt-4">
              <Col md={4}>
                <Form.Label>Certification URL</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="certification_url"
                  className="mb-3 position-relative"
                >
                  <FormField
                    size="lg"
                    name="certification_url"
                    type="text"
                    error={errors.certification_url}
                    inputRef={register('certification_url', {
                      // required: 'Please enter a certificate_url',
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* <Form.Group
              controlId="institute"
              className="mb-3 position-relative"
            >
              <FormField
                size="lg"
                name="institute"
                type="text"
                label="Institute"
                error={errors.institute}
                inputRef={register('institute', {
                  required: 'Please enter a institute',
                })}
              />
            </Form.Group>

            <Form.Group
              controlId="description"
              className="mb-3 position-relative"
            >
              <FormField
                size="lg"
                name="description"
                type="textarea"
                label="Description"
                error={errors.description}
                inputRef={register('description', {
                  required: 'Please enter a description',
                })}
              />
            </Form.Group> */}

            <Row className="align-items-start mt-4">
              <Col md={4}>
                <Form.Label className="mt-4 required">
                  Certificate Upload
                </Form.Label>
              </Col>
              <Col md={8}>
                <Form.Group
                  controlId="certificate_upload"
                  className="mb-3 position-relative"
                >
                  <ImagePreview fileData={fileData} />
                </Form.Group>
                {existingPdf ? (
                  <div className="d-flex align-items-center">
                    <p className="mt-3">{existingPdf}</p>
                    <span
                      className="closes ms-2"
                      title="Delete"
                      onClick={() => removeFile()}
                    >
                      <CrossIcon />
                    </span>
                  </div>
                ) : null}
              </Col>
            </Row>
          </Box>
          <Box className="p-0 am-footer d-flex justify-content-between">
              <Col lg={10} className="btnxCertificate">
                <ButtonToolbar aria-label="Toolbar with button groups">
                  <ButtonGroup className="me-3" aria-label="First group">
                    <Button
                      className="can-btn space1 rounded-4 px-1"
                      type="button"
                      onClick={()=>(
                        setSelectedValue(''),
                        setExistingProvider(''),
                        setDateAchieved(''),
                        setExistingPdf(''),
                        setDateExpires(''),
                        reset(),
                        props.onHide()
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
    </>
  );
}

