import { Configure } from '@athena/web-shared/components';
import { HeaderComponent } from '@athena/web-shared/ui';
import { Col, Row, Button } from 'react-bootstrap';
import { requireAuth, useParams } from '@athena/web-shared/utils';
import { useEffect, useState } from 'react';
import { Span } from '@athena/web-shared/ui';

function ConfigurePage(props) {
  return (
    <>
      <HeaderComponent title="Configure" />
      <Configure />
    </>
  );
}

export default requireAuth(ConfigurePage);
