import './ClientRepDashboard.css';
import { Col, Container, Row} from 'react-bootstrap';
import {  Box, Fullcalender,WelcomeBackComponent } from '@athena/web-shared/ui';
import { useContext, useState } from 'react';
import Dropdown from 'react-bootstrap';
import Select from 'react-select';
export const ClientRepDashboard=(props)=> {
  const viewoptions = [
    {
      label: 'Corporate Group',
      value: 'corporate group',
    },
    {
      label: 'Company Name',
      value: 'company name',
    },
    {
      label: 'Company Address',
      value: 'company address',
    },
  ];

  const [selectedFilterOption, setSelectedFilterOption] = useState(
    viewoptions[0]
  );

  const handleFilterOptionChange = (selectedOption) => {
    setSelectedFilterOption(selectedOption);
  };

  const clientTabs = [
    {
      title: 'Users',
      count: 2000,
      background:
        'linear-gradient(68deg, rgba(238,248,248,1) 29%, rgba(204,226,233,1) 60%)',
    },
    {
      title: 'Batches',
      count: 324,
      background:
        'linear-gradient(68deg, rgba(238,248,248,1) 29%, rgba(204,226,233,1) 60%)',
    },
    {
      title: 'Courses',
      count: 2,
      background:
        'linear-gradient(68deg, rgba(238,248,248,1) 29%, rgba(204,226,233,1) 60%)',
    },
    {
      title: 'Corporate Groups',
      count: 2,
      background:
        'linear-gradient(68deg, rgba(238,248,248,1) 29%, rgba(204,226,233,1) 60%)',
    },
  ];

  return (
    <Container fluid className="">
      <Box>
        <WelcomeBackComponent wish={'Welcome back whatever'} />
      </Box>
      <Row className="mt-4" xl={4} lg={3} md={3} sm={2} xs={1}>
        {clientTabs.map((tab) => (
          <Col key={tab.id}>
            <Box
              className="color-grade rounded-4 px-4 py-2"
              style={{ background: tab.background }}
            >
              <h5 className="mt-2" style={{ color: tab.fontcolor }}>
                {tab.title}
              </h5>
              <h5 className="mt-2" style={{ color: tab.fontcolor }}>
                {tab.count}
              </h5>
            </Box>{' '}
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} className="mt-5">
          <Box className="shadow rounded-3 mt-1">
            <Fullcalender fromDashboard={true} />
          </Box>
        </Col>
        <Col lg={4} className="mt-5 rounded-4 shadow" style={{}}>
          <Box className="h-100">
            <h5 className="p-3">Need Attention</h5>
          </Box>
        </Col>
        <Col lg={8} className="mt-5">
          <Container
            style={{
              height: '300px',
            }}
          >
            <Row>
              <div class="container">
                <div class="row">
                  <h5 className="col-md-6">User Analytics</h5>
                  <div
                    class="col-md-6"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Select
                      options={viewoptions}
                      onChange={handleFilterOptionChange}
                      value={selectedFilterOption}
                      styles={{
                        indicatorSeparator: (styles) => ({ display: 'none' }),
                        control: (styles) => ({
                          ...styles,
                          borderRadius: '15px',
                          border: '1px solid light grey',
                          minWidth: '200px',
                          width: '250px',
                          height: '10px',
                          color: '#000',
                        }),
                        option: (styles, { isSelected }) => ({
                          ...styles,
                          color: isSelected ? 'white' : 'grey',
                          backgroundColor: isSelected ? '#238ffc' : 'white',
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: 'grey !important',
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            </Row>
            
          </Container>
        </Col>{' '}
      </Row>
    </Container>
  );
}
export default ClientRepDashboard;
