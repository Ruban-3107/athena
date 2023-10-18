import './CardBox.css';
import {Box} from '@athena/web-shared/ui';

export function CardBox(props) {
  const { className } = props;
  
  // console.log(className);

  return (
      <Box className={(className ? ` ${className}` : "")}>
          {props.children}
      </Box>
  )
}

export default CardBox
