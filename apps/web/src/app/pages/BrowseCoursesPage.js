import {BrowseCourses} from "@athena/web-shared/components";
import { requireAuth } from '@athena/web-shared/utils';

export function BrowseCoursesPage(props) {

  return (
    <>
      <BrowseCourses />
    </>
  );
}

export default requireAuth(BrowseCoursesPage);