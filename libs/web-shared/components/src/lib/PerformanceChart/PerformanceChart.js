import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import { Box } from '@athena/web-shared/ui';

export const PerformanceChart = ({ PerformanceChartData, setPerformanceGraphView }) => {
  const [selectedFilterOption, setSelectedFilterOption] = useState({
    label: 'Today',
    value: 'week',
  });

  const viewOptions = [
    {
      label: 'Today',
      value: 'week',
    },
    {
      label: 'This month',
      value: 'month',
    },
    {
      label: 'This Year',
      value: 'year',
    },
  ];

  const xLabels = useMemo(
    () =>
      PerformanceChartData
        ?.filter(({ type }) => type === 'courses_data')
        .map(({ graphLabel }) => graphLabel),
    [PerformanceChartData]
  );

  const usersData = useMemo(
    () =>
      PerformanceChartData
        ?.filter(({ type }) => type === 'users_data')
        .map(({ count }) => Number(count)),
    [PerformanceChartData]
  );

  const coursesData = useMemo(
    () =>
      PerformanceChartData
        ?.filter(({ type }) => type === 'courses_data')
        .map(({ count }) => Number(count)),
    [PerformanceChartData]
  );

  const handleFilterOptionChange = (selectedOption) => {
    setSelectedFilterOption(selectedOption);
    setPerformanceGraphView(selectedOption.value);
  };

  const adminData = () => ({
    labels: xLabels,
    datasets: [
      {
        label: 'All Users',
        data: usersData,
        fill: 'start',
        backgroundColor: 'rgba(0,110,500,0.4)',
        borderColor: 'rgba(0,110,500,1)',
        borderWidth: 1,
      },

      {
        label: 'All Courses',
        data: coursesData,
        type: 'bar',
        backgroundColor: 'rgba(150,0,300,1)',
        borderColor: 'rgba(75,192,192,0)',
        barThickness: 15,
        borderRadius: 15,
        borderWidth: 1,
      },
    ],
  });

  const adminOptions = {
    // Your existing adminOptions object...
  };

  return (
    <div>
      {/* Your JSX code... */}
      <Row className="row p-3">
        {/* ... */}
        <Col className="">
          <Box className="d-flex justify-content-end">
            <Row classNeme="row">
              <Col>
                <Select
                  options={viewOptions}
                  onChange={handleFilterOptionChange}
                  value={selectedFilterOption}
                  styles={{
                    indicatorSeparator: (styles) => ({ display: 'none' }),
                    control: (styles) => ({
                      ...styles,
                      borderRadius: '15px',
                      border: '1px solid light grey',
                      color: '#000',
                      minWidth:'120px'
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
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>

      <Row className="p-2">
        <Col>
          <Line data={adminData()} options={adminOptions} height={172} />
        </Col>
      </Row>
    </div>
  );
}

export default React.memo(PerformanceChart);
