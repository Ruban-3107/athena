import './FormFieldRow.css';
import { useState } from 'react';
import { Form, Col, Row, InputGroup } from 'react-bootstrap';
import { PasswordShowIcon, PasswordHideIcon } from '@athena/web-shared/ui';

export const FormFieldRow =(props)=> {
  const {
    error,
    type,
    inputRef,
    labelClassName,
    className,
    size1,
    size2,
    formtext,
    onSelect,
    formtextclassName,
    ...inputProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };
  return (
    <Row>
        <Col md={props.size1}>
          {props.label && (
            <Form.Label
              className={props.labelClassName ? props.labelClassName : ''}
              md={3}
            >
              {props.label}
            </Form.Label>
          )}
        </Col>
        <Col md={props.size2}>
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
          {formtext && <small className={formtextclassName}>{formtext}</small>}
        </Col>
      </Row>
  );
}
export default FormFieldRow;
