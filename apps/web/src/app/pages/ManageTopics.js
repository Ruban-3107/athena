import { ManageTopics } from '@athena/web-shared/components';
import { HeaderComponent } from '@athena/web-shared/ui';
import { requireAuth } from '@athena/web-shared/utils';

function ManageTopicsPage(props) {

    return (
      <>
      <HeaderComponent 
      title="Manage Topics"
      btnname= "+ Create Topics"
      routeTo="createtopic"
      hidebreadcumb
      isButtonVisible
      />
       <ManageTopics />
      </>
    );
  }
export default requireAuth(ManageTopicsPage);