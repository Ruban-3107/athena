import './CreateExercise.css';
import { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { FormField, Box,Playground } from '@athena/web-shared/ui';
import { useAuth } from '@athena/web-shared/utils';
import axios from 'axios';
export function CreateExercise(props) {
  const auth = useAuth();
  const [isClearable, setIsClearable] = useState(true);
  const [allLanguages,setAllLanguages] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [existingLanguage,setExistingLanguage] =  useState([]);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();
  
  // useEffect(() => {
  //   if (auth && auth.user) {
  //     getAllLanguages();
  //   }
  // }, [auth]);

  // https://b1a6-49-207-182-199.ngrok.io/test-runner/getAllLanguages

  // const getAllLanguages = async() => {
  //   // const getAllLanguagesResponse = await axios.get('https://b1a6-49-207-182-199.ngrok.io/test-runner/getAllLanguages')
  //   console.log("getAllLanguagesResponse",getAllLanguagesResponse);
  //   if (getAllLanguagesResponse?.status === 200) {
  //     setAllLanguages(getAllLanguagesResponse?.data);
  //     setIsLoading(false);
  //   }
  // }

  const handleLanguagesChange = (selected) => {
    setValue('languagesss', selected);
    console.log('objectttttttt', selected);
    // setSelectedRoles(selected);
    setExistingLanguage([selected]);
    // clearErrors('language')
  };

  console.log('setExistingLanguage', existingLanguage);



  return (
    <Form>
      {/* onSubmit={handleSubmit(onSubmitHandler)} */}

      <div className="d-flex justify-content-start mt-3">
        <Form.Group controlId="name">
          <FormField
            name="title"
            size="md"
            size1="0"
            size2="12"
            type="input"
            inputRef={register('title')}
            error={errors.title}
            className="formclass"
            // label="Topic Name *"
            placeHolder="Exercise Name"
            // disabled={id ? isEdit : false}
          />
        </Form.Group>

        <Box>
          <Controller
            name="topic_type"
            control={control}
            render={({ field }) => (
              <Select
                className="reactselectsss ms-5"
                placeholder="Technology"
                {...field}
                hideSelectedOptions={false}
                isClearable={isClearable}
                value={existingLanguage}
                options={allLanguages}
                onChange={handleLanguagesChange}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                // isDisabled={id ? isEdit : false}
              />
            )}
          />
          {/* {errors.topic_type && selectedTopicType == null && (
                            <p className="invalid-feedback">
                              {errors.topic_type?.message ||
                                errors.topic_type?.name.message}
                            </p>
                          )} */}
        </Box>
      </div>
      <div className="mt-3">
        <Playground />
      </div>
    </Form>
  );
}
export default CreateExercise;

