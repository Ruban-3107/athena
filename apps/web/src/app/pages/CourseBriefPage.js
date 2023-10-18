/* eslint-disable @nx/enforce-module-boundaries */
import { CourseBrief } from '@athena/web-shared/components';
import { requireAuth } from '@athena/web-shared/utils';

export function CourseBriefPage(props) {
  return (
      <CourseBrief />
  );
}

export default requireAuth(CourseBriefPage);
