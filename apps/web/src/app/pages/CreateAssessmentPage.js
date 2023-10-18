import react from "react";
import { CreateAssessment } from "../../../../../libs/web-shared/components/src";
import { requireAuth, useParams } from '@athena/web-shared/utils';



function CreateAsessmentsPage(props) {

  return (
      <>
<CreateAssessment/>
      </>
  );
}

export default requireAuth(CreateAsessmentsPage);