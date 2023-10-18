import {
  Card,
  Container,
  Col,
  Row,
  Tabs,
  Tab,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import { Box, Span } from '@athena/web-shared/ui';
import './ProgressComponent.css';
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  Utils,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Select from 'react-select';
import React, { useContext, useEffect, useState } from 'react';
import { apiRequest } from '@athena/web-shared/utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { end, start } from '@popperjs/core';
import { AdminDashContext } from '../DashboardCard/DashboardCard';

ChartJS.register(ArcElement);

export function ProgressComponent({ adminPieChartData, dateRange, setDateRange }) {

  const allowedStatus = [
    'Approved',
    'In Draft',
    'Pending Approval',
    'Completed',
    'Upcoming',
    'Ongoing',
  ];

  const pieData = adminPieChartData?.filter(
    (object) =>
      Object.prototype.hasOwnProperty.call(object, 'pieChartType') &&
      allowedStatus.includes(object.status)
  );

  console.log('PIII', pieData);
  /**Course pie chart data*/
  const coursePieData = adminPieChartData
    ?.filter(({ pieChartType }) => pieChartType === 'Course')
    .map((x) => x.count);
  const coursePieLabels = adminPieChartData
    ?.filter(({ pieChartType }) => pieChartType === 'Course')
    .map((x) => x.status);

  console.log('Course Pie Data', coursePieData);
  console.log('Course Pie Labels', coursePieLabels);

  /**Batch pie chart data*/
  const batchPieData = adminPieChartData
    ?.filter(({ pieChartType }) => {
      return pieChartType === 'Batch';
    })
    .map((x) => x.count);
  const batchPieLabels = adminPieChartData
    ?.filter(({ pieChartType }) => {
      return pieChartType === 'Batch';
    })
    .map((x) => x.status);

  console.log('Batch Pie Data', batchPieData);
  console.log('Batch Pie Labels', batchPieLabels);
  const [batches, setBatches] = useState();
  const [courses, setCourses] = useState();
  const [batchespercentage, setBatchPercentage] = useState();
  const [dateRangeType, setDateRangeType] = useState('month');

  const datacourse = {
    datasets: [
      {
        label: 'Course',
        data: coursePieData,

        backgroundColor: [
          '#9371f0',
          '#a25942',
          '#0396ff',
          '#ABDCFF',
          '#A27642',
          '#9371F0',
        ],

        hoverOffset: 20,
        cutout: 45,
      },
    ],
  };

  ///
  const viewoptions = [
    {
      label: 'This month',
      value: 'month',
    },
    {
      label: 'This week',
      value: 'week',
    },
    {
      label: 'Today',
      value: 'day',
    },
  ];

  const courseoptions = {
    plugins: {
      legend: {
        display: false,
      },
      datasets: {
        data: {
          display: false,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          return value / 2 + '%';
        },
      },
    },
  };

  //     tooltip: {
  //       enabled: false,
  //       intersect: false,
  //       custom: function (tooltip) {
  //         if (!tooltip) return;
  //         tooltip.displayColors = false;
  //       },
  //       mode: 'index',
  //       position: 'nearest',
  //       callbacks: {
  //         label: function (tooltipItem, data) {
  //           return data.labels[tooltipItem.index];
  //         },
  //       },
  //     },
  //     datalabels: {
  //       formatter: (value, context) => {
  //         return value / 2 + '%';
  //       },
  //     },
  //   },
  // };

  const handleSelectChange = (dateRange) => {
    setDateRange(dateRange.value);
  };

  const databatch = {
    datasets: [
      {
        label: batchPieLabels,
        data: batchPieData,
        backgroundColor: ['#58b9ff', '#b88570', '#ae94f4'],

        hoverOffset: 20,
        cutout: 45,
      },
    ],
  };
  return (
    <Tabs defaultActiveKey="Batch" className="dougnut-tabs">
      <Tab title="Course" eventKey="Course" className="rounded-5">
        <Box className="d-flex justify-content-end me-2 mt-2">
          <Select
            placeholder={viewoptions.find((e) => e.value == dateRange)?.label}
            options={viewoptions}
            value={dateRange}
            onChange={handleSelectChange}
            styles={{
              indicatorSeparator: (styles) => ({ display: 'none' }),
              control: (styles) => ({
                ...styles,
                borderRadius: '15px',
                border: '1px solid light grey',
                // minWidth: '150px',
                // width: '150px',
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
        </Box>
        <Row className="align-items-center">
          <Col lg={7} className="">
            <div
              style={{
                // height: '50vh',
                position: 'relative',
                marginBottom: '1%',
                padding: '4%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="sp"
            >
              <Doughnut
                data={datacourse ? datacourse : '0%'}
                plugins={[ChartDataLabels]}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                    },
                    datasets: {
                      data: {
                        display: true,
                      },
                    },
                    datalabels: {
                      formatter: (value) => {
                        return value + '%';
                      },
                      font: {
                        weight: '',
                        size: '13px',
                      },
                      color: 'rgba(0,0,0,1)',
                      anchor: 'center',
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(
                          10.125,
                          10.125,
                          -10.125,
                          -10.125
                        );

                        gradient.addColorStop(0, 'rgba(220, 220, 220, 0.7)');
                        gradient.addColorStop(0.5, 'rgba(220, 220, 220, 0.7)');
                        gradient.addColorStop(1, 'rgba(220, 220, 220, 0.7)');

                        ctx.save();
                        ctx.filter = 'blur(20px)';
                        const bg = gradient;
                        ctx.restore();

                        return bg;
                      },
                      borderRadius: 4,
                      hoverOffset: 48,
                    },
                  },
                }}
              />
            </div>
          </Col>
          <Col lg={5} className="px-0">
            <ul className="">
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress1"></Span>
                <Span className="ms-2">{courses?.approved?.length} Course</Span>
              </li>
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress2"></Span>
                <Span className="ms-2">{courses?.indraft?.length} Course</Span>
              </li>
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress3"></Span>
                <Span className="ms-2">{courses?.pending?.length} Course</Span>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <li className="mt-2 ms-3 d-flex">
            <Span className="mt-1 ms-4 progress1"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Approved
            </Span>

            <Span className="mt-1 ms-4 progress2"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Indraft
            </Span>

            <Span className="mt-1 ms-4 progress3"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Pending
            </Span>
          </li>
        </Row>
      </Tab>
      <Tab title="Batch" eventKey="Batch">
        <Box className="d-flex justify-content-end me-2 mt-2">
          <Select
            placeholder={viewoptions.find((e) => e.value == dateRange)?.label}
            options={viewoptions}
            value={dateRange}
            onChange={handleSelectChange}
            styles={{
              indicatorSeparator: (styles) => ({ display: 'none' }),
              control: (styles) => ({
                ...styles,
                borderRadius: '15px',
                border: '1px solid light grey',
                // minWidth: '150px',
                // width: '150px',
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
        </Box>
        <Row className="align-items-center">
          <Col lg={7} className="">
            <div
              style={{
                // height: '50vh',
                position: 'relative',
                marginBottom: '1%',
                padding: '4%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="sp"
            >
              <Doughnut
                data={databatch ? databatch : '0%'}
                plugins={[ChartDataLabels]}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                    // options,
                    // datasets: {
                    //   data: {
                    //     display: false,
                    //   }
                    // },
                    datalabels: {
                      formatter: (value) => {
                        return value + '%';
                      },
                      font: {
                        weight: '',
                        size: '13px',
                      },
                      color: 'rgba(0,0,0,1)',
                      anchor: 'center',
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(
                          10.125,
                          10.125,
                          -10.125,
                          -10.125
                        );

                        gradient.addColorStop(0, 'rgba(220, 220, 220, 0.7)');
                        gradient.addColorStop(0.5, 'rgba(220, 220, 220, 0.7)');
                        gradient.addColorStop(1, 'rgba(220, 220, 220, 0.7)');

                        ctx.save();
                        ctx.filter = 'blur(20px)';
                        const bg = gradient;
                        ctx.restore();

                        return bg;
                      },
                      borderRadius: 4,
                      hoverOffset: 48,
                    },
                  },
                }}
              />
            </div>
          </Col>
          <Col lg={5} className="px-0">
            <ul className="">
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress1"></Span>
                <Span className="ms-2">{batches?.completed?.length} Batch</Span>
              </li>
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress2"></Span>
                <Span className="ms-2">{batches?.ongoing?.length} Batch</Span>
              </li>
              <li className="mt-1 d-flex">
                <Span className=" mt-1 progress3"></Span>
                <Span className="ms-2">{batches?.upcoming?.length} Batch</Span>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <li className="mt-2 mb-2 ms-3 d-flex">
            <Span className="mt-1 ms-3 progress1"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Completed
            </Span>

            <Span className="mt-1 ms-3 progress2"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Ongoing
            </Span>

            <Span className="mt-1 ms-3 progress3"></Span>
            <Span className="ms-1" style={{ fontSize: 'smaller' }}>
              Upcoming
            </Span>
          </li>
        </Row>
      </Tab>
    </Tabs>
  );
}
export default React.memo(ProgressComponent);
