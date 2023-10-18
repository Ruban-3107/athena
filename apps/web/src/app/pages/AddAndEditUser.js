import { HeaderComponent } from '@athena/web-shared/ui';
import {AddUsers} from '@athena/web-shared/components';
import { useSearchParams } from 'react-router-dom';
import { requireAuth } from '@athena/web-shared/utils';


export function AddAndEditUser(props) {
  let [searchParams, setSearchParams] = useSearchParams(); 
  const id = searchParams.get('id');
  return (
    <>
      <HeaderComponent 
      title={ id ? "Edit User": "Add User"}
      />
      <AddUsers />
    </>
  );
}

export default requireAuth(AddAndEditUser);
