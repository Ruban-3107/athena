import './FormField.css';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { PasswordShowIcon,PasswordHideIcon } from '@athena/web-shared/ui';

export function FormField(props) {
  const { error, type, name, icon, inputRef, ...inputProps } =
    props;
  // console.log(props, '@@@@@form-feild@@@@@@@@@@@');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  return (
    <>
      {props.label && <Form.Label>{props.label}</Form.Label>}
      <InputGroup>
        <Form.Control
          as={type === 'textarea' ? 'textarea' : 'input'}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type == 'text-area' ? undefined : type}
          isInvalid={error ? true : undefined}
          data-testid="hours-input"
          // refs={inputRef}
          {...inputRef}
          {...inputProps}

        />
        {type === 'password' && (
          <InputGroup.Text className="passwordEyeIcon" onClick={togglePasswordVisibility}>
            {showPassword ? <PasswordShowIcon /> : <PasswordHideIcon />}
          </InputGroup.Text>
        )}
      </InputGroup>
      {error && (
        <Form.Control.Feedback type="invalid" className="text-left">
          {error.message}
        </Form.Control.Feedback>
      )}
    </>
  );
}

export default FormField;

