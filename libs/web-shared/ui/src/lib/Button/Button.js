import './Button.css';
import { Button } from 'react-bootstrap';
export function ButtonComponent(props) {
  return <Button {...props}>{props.name}</Button>;
}
export default ButtonComponent;
