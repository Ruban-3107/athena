import { ManageExercises } from '@athena/web-shared/components';
import { HeaderComponent } from '@athena/web-shared/ui';
// import { Col, Row } from 'react-bootstrap';
import { requireAuth } from '@athena/web-shared/utils';

function ManageExercise(props) {

  return (
    <>
      <HeaderComponent
        title="Manage Exercises"
        hidebreadcumb
        isButtonVisible
        btnname="+ Create Exercise"
        routeTo="createexercise"
      />
      <ManageExercises />
    </>
  );
}

export default requireAuth(ManageExercise);
