import { CreateBatch } from '@athena/web-shared/components';
import { HeaderComponent } from '@athena/web-shared/ui';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { requireAuth } from '@athena/web-shared/utils';

function CreateBatchPage(props) {
  let [searchParams, setSearchParams] = useSearchParams();
  console.log("chaand", searchParams);
  const id = searchParams.get('id');
  return (
    <>
      <HeaderComponent title={id ? 'Edit Batch' : 'Create Batch'} hidebreadcumb />
      <CreateBatch />
    </>
  );
}

export default requireAuth(CreateBatchPage);
