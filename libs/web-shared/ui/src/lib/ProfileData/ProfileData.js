import './ProfileData.css';
import { Button, Col, ButtonToolbar, ButtonGroup,Spinner } from 'react-bootstrap';
import {
  Box,
  Span,
  FormField,
  FacebookIcon,
  TwitterIcon,
  GitIcon,
  LinkedInIcon,
} from '@athena/web-shared/ui';
import Form from 'react-bootstrap/Form';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { apiRequest, useAuth } from '@athena/web-shared/utils';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import 'yup-phone-lite';
const maskEmailsPhones = require('mask-email-phone');


const schema = yup.object().shape({
  first_name: yup
    .string()
    .required('First Name is required')
    .matches(
      /^[a-z A-Z]{3,200}$/,
      'First Name is required and must contain alphabets'
    ),
  last_name: yup
    .string()
    .required('Last Name is required')
    .matches(
      /^[a-z A-Z]{3,200}$/,
      'Last Name is required and must contain alphabets'
    ),
  // contact_email: yup
  //   .string()
  //   .required('Contact e-Mail is required')
  //   .email('Not a proper email'),
  alternate_email: yup.string().email().nullable().optional(),
  // phone_number: yup.string().phone().required('Phone number is required'),
  linkedin: yup.string().nullable().optional(),
  twitter: yup.string().nullable().optional(),
  facebook: yup.string().nullable().optional(),
  github: yup.string().nullable().optional(),
});

export function ProfileData(props) {
  const auth = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState('');
  const [pending, setPending] = useState(false);

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleeventclick = () => {
    props.handleProfileCancel();
  };

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  useEffect(() => {
    console.log('profileDataaaa', props.profileData);
    if (props.profileData) {
      for (const key in props.profileData) {
        // if (key == 'user') {
        //   setExistingSkillSet(profileData[key]['users_skillset']);
        //   setSelectedValue(
        //     Array.isArray(profileData[key]['users_skillset'])
        //       ? profileData[key]['users_skillset'].map((x) => x.id)
        //       : []
        //   );
        // } else {
        setValue(key, props.profileData[key]);
        if (key === 'phone_number') {
          setValue('phone_number', props.profileData[key]);
          setPhoneNumber(props.profileData[key]);
        }
        if (key === 'alternate_phone_number') {
          setValue('alternate_phone_number', props.profileData[key]);
          setAlternatePhoneNumber(props.profileData[key]);
        }
      }
    } else {
      setValue('first_name', auth?.user?.first_name);
      setValue('last_name', auth?.user?.last_name);
      setValue('contact_email', auth?.user?.email);
      setPhoneNumber(auth?.user?.phone_number);
      setValue('phone_number', auth?.user?.phone_number);
    }
  }, [props?.profileData,auth]);

  useEffect(() => {
    console.log('gett', getValues());
  }, [getValues()]);

  console.log('profile', props.profileData);

  const onSubmit = async (data) => {
    data['user_id'] = parseInt(auth?.user.id);
    // data['skillset'] = selectedValue;
    setPending(true);
    if (props?.profileData && props?.profileData.first_name) {
      console.log('dataPut', data);
      const updateResponse = await apiRequest(
        `api/users/profiles/${props.profileData.user_id}`,
        'PUT',
        data
      );
      if (updateResponse?.status === 'success') {
        props?.getProfiledata();
        setPending(false);
        props?.handleProfileCancel();
        toast.success('Profile details updated successfully');
      } else{
        toast.error(updateResponse?.message)
        setPending(false);
      }
      window.scrollTo(0, 0);
    } 
    else {
      console.log('dataPost', data);
      const profileSumbitResponse = await apiRequest(
        'api/users/profiles',
        'POST',
        data
      );
      if (profileSumbitResponse) {
        props?.getProfiledata();
        props?.handleProfileCancel();
        setPending(false);
        toast.success('Profile details added successfully');
      }
      window.scrollTo(0, 0);
    }
  };

  return (
    <Form
    onSubmit={handleSubmit(onSubmit)}
  >
    <Box className="profile-data-wrapper mt-1 mb-2">
      <Box>
        {props.profileDataEdit ? (
          <FormField
            data-testid="firstname"
            name="first_name"
            type="text"
            label="First Name *"
            error={errors.first_name}
            inputRef={register('first_name', {
              required: 'Please enter a first name',
            })}
          />
        ) : (
          <>
            <div className="f-16 required">First Name *</div>
            <Span className="text-grey f-14">
              {props.profileData && props.profileData?.first_name
                ? props.profileData?.first_name
                : auth?.user?.first_name}
            </Span>
          </>
        )}
      </Box>
      <Box>
        {props.profileDataEdit ? (
          <FormField
            data-testid="lastname"
            name="last_name"
            type="text"
            label='Last Name *'
            error={errors.last_name}
            inputRef={register('last_name', {
              required: 'Please enter a last name',
            })}
          />
        ) : (
          <>
          <div className="f-16 required">Last Name *</div>
          <Span className="text-grey f-14">
            {props.profileData && props.profileData?.last_name
              ? props.profileData?.last_name
              : auth?.user?.last_name}
          </Span>
          </>
        )}
      </Box>
      <Box>
        {props.profileDataEdit ? (
          <FormField
            data-testid="contactemail"
            name="contact_email"
            type="text"
            label='Primary Email *'
            readOnly = {props.profileData && props.profileData?.contact_email ? 'true' : 'false'}
            error={errors.contact_email}
            inputRef={register('contact_email', {
              required: 'Please enter a contact_email',
            })}
          />
        ) : (
          <>
          <div className="f-16 required">Primary Email *</div>
          <Span className="text-grey f-14">
            {props.profileData && props.profileData.contact_email
              ? maskEmailsPhones(props.profileData?.contact_email)
              : maskEmailsPhones(auth?.user?.email)}
          </Span>
          </>
        )}
      </Box>
      <Box>
        {props.profileDataEdit ? (
          <FormField
            data-testid="alternateemail"
            name="alternate_email"
            type="text"
            label = 'Secondary Email'
            error={errors.alternate_email}
            inputRef={register('alternate_email')}
          />
        ) : (
          <>
        <div className="f-16">Secondary Email</div>
          <Span className="text-grey f-14">
            {props.profileData && props.profileData.alternate_email
              ? maskEmailsPhones(props.profileData.alternate_email)
              : '-'}
          </Span>
          </>
        )}
      </Box>
      <Box>
        {props.profileDataEdit ? (
          <Form.Group>
            <label htmlFor="phone">Mobile Number *</label>
            <Controller
              control={control}
              name="phone_number"
              render={() => (
                <PhoneInput
                  data-testid="phonenumber"
                  buttonclassName={
                    errors?.phone_number?.message
                      ? 'phone-input-button-error is-invalid'
                      : ''
                  }
                  inputclassName={
                    errors?.phone_number?.message
                      ? 'error-field is-invalid'
                      : ''
                  }
                  country={'in'}
                  onlyCountries={['in']}
                  disableSearchIcon={true}
                  disableDropdown={true}
                  disabled = {phoneNumber ? 'true' : 'false'}
                  value={phoneNumber}
                  countryCodeEditable={false}
                  onChange={(phone, data, event, formattedValue) => {
                    setError('phone_number');
                    if (phone.length === 2) {
                      setError('phone_number', {
                        type: 'required',
                        message: 'Please enter a valid phone number',
                      });
                    } else if (phone.length >= 2 && phone.length <= 11) {
                      setError('phone_number', {
                        type: 'minLength',
                        message: 'invalid phone number',
                      });
                    }
                    setValue('phone_number', formattedValue);
                    setPhoneNumber(formattedValue);
                  }}
                />
              )}
            />
            {errors?.phone_number ? (
              <p className="error-required">
                {errors.phone_number.message ===
                'phone_number must be a valid phone number for region US'
                  ? 'Phone number is required'
                  : errors.phone_number.message}
              </p>
            ) : null}
          </Form.Group>
        ) : (
          <>
        <div className="f-16 required">Mobile Number *</div>
          <Span className="text-grey f-14">
            {props.profileData && props.profileData.phone_number
              ? maskEmailsPhones(props.profileData?.phone_number)
              : maskEmailsPhones(auth?.user?.phone_number)}
          </Span>
        </>
        )}
      </Box>
      <Box>
        {props.profileDataEdit ? (
          <Form.Group>
             <label htmlFor="phone">Alternate Mobile No</label>
            <Controller
              control={control}
              name="alternate_phone_number"
              render={() => (
                <PhoneInput
                  data-testid="Aphonenumber"
                  buttonclassName={
                    errors?.alternate_phone_number?.message
                      ? 'phone-input-button-error is-invalid'
                      : ''
                  }
                  inputclassName={
                    errors?.alternate_phone_number?.message
                      ? 'error-field is-invalid'
                      : ''
                  }
                  country={'in'}
                  onlyCountries={['in']}
                  disableSearchIcon={true}
                  disableDropdown={true}
                  value={alternatePhoneNumber}
                  countryCodeEditable={false}
                  onChange={(phone, data, event, formattedValue) => {
                    setError('phone_number');
                    if (phone.length === 2) {
                      setError('alternate_phone_number', {
                        type: 'required',
                        message: 'Please enter a valid phone number',
                      });
                    } else if (phone.length >= 2 && phone.length < 12) {
                      setError('alternate_phone_number', {
                        type: 'minLength',
                        message: 'invalid phone number',
                      });
                    }
                    setValue('alternate_phone_number', formattedValue);
                    setAlternatePhoneNumber(formattedValue);
                  }}
                />
              )}
            />
          </Form.Group>
        ) : (
          <>
          <div className="f-16">Alternate Mobile No</div>
          <Span className="text-grey f-14">
            {props.profileData && props.profileData.alternate_phone_number
              ? maskEmailsPhones(props.profileData.alternate_phone_number)
              : '-'}
          </Span>
          </>
        )}
      </Box>
    </Box>
    <Box className={props.profileDataEdit ? "mt-5" : "mt-4" }>
      <ul className="socialWraper">
        <li>
          {!props.profileDataEdit ? (
            <a
              href={`https://www.linkedin.com/in/${props.profileData?.linkedin && props.profileData.linkedin}`} 
              target={props.profileData?.linkedin && '_blank'}
              className="mt-4"
            >
              {/* <img src="assets/images/linkedin-profile.svg" alt="linkedin" /> */}
              <LinkedInIcon />
            </a>
          ) : (
            <div className="d-flex">
              <Span className="me-2 mt-1">
                <LinkedInIcon />
              </Span>
              <FormField
                name="linkedin"
                type="text"
                placeholder="linkedin id"
                error={errors.linkedin}
                inputRef={register('linkedin', {
                  required: 'Please enter a linkedin',
                })}
              />
            </div>
          )}
        </li>

        <li>
          {!props.profileDataEdit ? (
            <a
              href= {`https://www.facebook.com/profile.php?id=${props.profileData?.facebook && props.profileData.facebook}`}
              target={props.profileData?.facebook && '_blank'}
              className="mt-4"
            >
              {/* <img src="assets/images/facebook.svg" alt="facebook" /> */}
              <FacebookIcon />
            </a>
          ) : (
            <div className="d-flex">
              <Span className="me-2 mt-1">
                <FacebookIcon />
              </Span>
              <FormField
                name="facebook"
                type="text"
                placeholder="facebook id"
                error={errors.facebook}
                inputRef={register('facebook', {
                  required: 'Please enter a facebook',
                })}
              />
            </div>
          )}
        </li>

        <li>
          {!props.profileDataEdit ? (
            <a
              href= {`https://github.com/${props.profileData?.github && props.profileData.github}`}
              target={props.profileData?.github && '_blank'}
              className="mt-4"
            >
              {/* <img src="assets/images/git.svg" alt="github" /> */}
              <GitIcon />
            </a>
          ) : (
            <div className="d-flex">
              <Span className="me-2 mt-1">
                <GitIcon />
              </Span>
              <FormField
                name="github"
                type="text"
                placeholder="github id"
                error={errors.github}
                inputRef={register('github', {
                  required: 'Please enter a github',
                })}
              />
            </div>
          )}
        </li>
        <li>
          {!props.profileDataEdit ? (
            <a
              href={`https://twitter.com/${props.profileData?.twitter && props.profileData.twitter}`}
              target={props.profileData?.twitter && '_blank'}
              className="mt-4"
            >
              {/* <img src="assets/images/twitter-icon.svg" alt="twitter" /> */}
              <TwitterIcon />
            </a>
          ) : (
            <div className="d-flex">
              <Span className="me-2 mt-1">
                <TwitterIcon />
              </Span>
              <FormField
                name="twitter"
                type="text"
                placeholder="twitter id"
                error={errors.twitter}
                inputRef={register('twitter', {
                  required: 'Please enter a twitter',
                })}
              />
            </div>
          )}
        </li>
      </ul>
    </Box>
    {props.profileDataEdit ? (
      <Box className="d-flex justify-content-end mt-4">
        <Col lg={10} className="btnxprofileUser">
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup className="me-3" aria-label="First group">
              <Button
                className="can-btn space1 rounded-4 px-1"
                type="button"
                onClick={handleeventclick}
                variant="outline-primary"
              >
                Cancel
              </Button>
            </ButtonGroup>
            <ButtonGroup className="me-0" aria-label="Second group">
              <Button
                className="saveprofile rounded-4 px-5"
                variant="outline-primary"
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
    ) : (
      ' '
    )}
  </Form>
  );
}
export default ProfileData;
