import './Profilephotocomponent.css';
import { useAuth } from '@athena/web-shared/utils';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export function Profilephotocomponent(props) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const { className } = props;
  const auth = useAuth();
  const tooltip = (
    <Tooltip>
      <p className='text-capitalize'>{auth?.user?.name}</p>
    </Tooltip>
  );
  return (
    <OverlayTrigger

      placement="bottom-start"

      overlay={tooltip}
    >
      <img
        src={userData?.avatar_url ?? 'assets/images/avatar.png'}
        className={'profile' + (className ? ` ${className}` : '')}

      />


    </OverlayTrigger>
  );
}
export default Profilephotocomponent;
