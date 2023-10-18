import './ProgressBarComponentLine.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Span } from '@athena/web-shared/ui';
export const ProgressBarComponentLine=(props)=> {
  const { progressValue } = props;
  return (
    <>
    <Span className="d-flex align-items-center mt-4">
      <Span style={{fontSize: 'small'}}>{`${progressValue}%`}</Span>
      <ProgressBar variant='success' now={progressValue} className='w-100 ms-3'/> 
    </Span>
  </>
  );
}
export default ProgressBarComponentLine;
