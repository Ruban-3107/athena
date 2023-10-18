import { ManageBatches } from "@athena/web-shared/components";
import { HeaderComponent } from '@athena/web-shared/ui';
import { requireAuth } from '@athena/web-shared/utils';

function ManageBatchesPage(props) {

  return (
    <>
    
      <HeaderComponent
       title="Manage Batches" 
       btnname= "+ Create Batch"
       routeTo="createbatch"
       hidebreadcumb
       isButtonVisible
       /> 
      <ManageBatches />
    </>
  );
}

export default requireAuth(ManageBatchesPage);
