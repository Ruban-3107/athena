import {ManageUsers} from "@athena/web-shared/components";
import { HeaderComponent } from '@athena/web-shared/ui';
import { requireAuth } from '@athena/web-shared/utils';

function ManageUsersPage(props) {

    return (
        <>
        <HeaderComponent
          title="Manage Users"
          btnname="+ Add User"
          routeTo="adduser"
          isButtonVisible
        />
        <div className="ManageUser">
          <ManageUsers className="ManageUser" />
        </div>
      </>
    );
  }
export default requireAuth (ManageUsersPage);