import './ActivityLog.css';
import {
  DataTableComponent,
  PrevIcon,
  NextIcon,
  FilterIcon,
  LearnerRoleIcon,
  TrainingFacilitatorRoleIcon,
  ClientRepresentativeRoleIcon,
  TrainerRoleIcon,
  JobArchitectRoleIcon,
  AdminRoleIcon,
  SuperAdminRoleIcon,
  Loader,
  Box,
  Span,
  HeaderWithButtonComponent,
} from '@athena/web-shared/ui';
import {
  Tab,
  Tabs,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Button,
  ReactSelect,
} from 'react-bootstrap';
import React, { useEffect, useState, useRef } from 'react';
import Pagination from 'rc-pagination';
import Select from 'react-select';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { activityLogType, moduleTypeList } from '@athena/web-shared/utils';
import { apiRequest, PaginationLocale } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';

export const ActivityLog = (props) => {
  const [activeTab, setActiveTab] = useState('activity');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [size, setSize] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [current, setCurrent] = useState(1);
  const [gotoPage, setGotoPage] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [activty, setActivity] = useState('');
  const [activityData, setActivityData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    value: 'Today',
    label: 'Today',
  });
  const [moduleType, setModuleType] = useState('all');
  const [pending, setPending] = useState(true);
  // const [exportKey, setExportKey] = useState(false);

  const getAndExportActivities = async (e) => {
    await getActivities(true);
    handleExport(e);
  };

  const csvLinkRef = useRef(null);

  const handleExport = async (format) => {

    if (format === 'csv') {

      if (!exportData || exportData.length === 0) {
        return null;
      }

      const csvHeaders = Object.keys(exportData[0]);
      const csvData = exportData.map((obj) =>
        csvHeaders.map((header) => obj[header])
      );

      csvLinkRef.current.link.click();
    } else if (format === 'xls') {
      // Export as XLS
      console.log('+++++++++++++++++++', exportData[0]);
      const transformedData = exportData.map((item) => {
        // Convert the 'Role' field to a string
        const role = Array.isArray(item.Role)
          ? item.Role.join(', ')
          : item.Role.toString();
        // Convert the 'Time_Stamp' field to a timestamp
        const timestamp = new Date(item.Time_Stamp);
        // Return the transformed object
        return {
          ...item,
          Role: role,
          Time_Stamp: timestamp,
        };
      });

      const xlsData = XLSX.utils.json_to_sheet(transformedData);
      const xlsWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(xlsWorkbook, xlsData, 'Sheet1');
      XLSX.writeFile(xlsWorkbook, 'logdata.xlsx');
    }
  };

  const getActivities = async (exportKey) => {
    let data = {};
    if (moduleType) {
      data['module_type'] = moduleType === 'all' ? 'all' : moduleType;
    }
    if (dateRange) {
      data['time_duration'] =
        dateRange?.value === 'all' ? 'all' : dateRange?.value;
    }

    if (activty) {
      data['activity'] = activty ?? 'all';
    }

    if (exportKey) {
      data['pageNo'] = null;
      data['size'] = null;
    } else {
      data['pageNo'] = current;
      data['size'] = size;
    }

    const activityresponse = await apiRequest(
      'api/courses/activities/getActivities',
      'POST',
      data
    );
    console.log('userresponse', activityresponse);
    if (activityresponse?.status === 'filter success') {
      if (exportKey) {
        const activeData = activityresponse?.value?.activityData?.rows.map((x) => {
          return {
            User_id: x.user_id,
            Name: `${toTitleCase(
              x?.activitylog_user?.first_name
            )} ${toTitleCase(x?.activitylog_user?.last_name)}`,
            Role:
              x?.activitylog_user?.user_roles?.length > 0
                ? x?.activitylog_user?.user_roles?.map((x) =>
                  x.name?.toLowerCase()
                )
                : ['learner'],
            Activity: x.action,
            Module_type: x.module_type,
            Module_name: x.module_name,
            Time_Stamp: new Date(x.createdAt),
          };
        })
        console.log(activeData, 'newdat')
        setExportData(activeData);
      } else {
        const activityData1 = activityresponse?.value?.activityData?.rows.map(
          (x) => {
            return {
              id: x.id,
              user_id: x.user_id,
              user_name: `${toTitleCase(
                x?.activitylog_user?.first_name
              )} ${toTitleCase(x?.activitylog_user?.last_name)}`,
              roles:
                x?.activitylog_user?.user_roles?.length > 0
                  ? x?.activitylog_user?.user_roles?.map((x) =>
                    x.name?.toLowerCase()
                  )
                  : ['learner'],
              activity: x.action,
              module_type: x.module_type,
              module_name: x.module_name,
              time_stamp: x.createdAt,
            };
          }
        );

        console.log(activityData1, '/////////////');
        setTotalItems(activityresponse.value?.activityData?.totalItems);
        setActivityData(activityData1);
        setPending(false);
      }
      // setFilteredUserData(activityData1);
    } else {
      setPending(false);
      toast.error(activityresponse?.message?.message);
    }
  };

  const getUserActivities = async (exportKey) => {
    let data = {};
    if (exportKey) {
      data['pageNo'] = null;
      data['size'] = null;
    }
    data['pageNo'] = current;
    data['size'] = size;
    if (dateRange) {
      data['time_duration'] =
        dateRange?.value === 'all' ? 'all' : dateRange?.value;
    }
    const activeusers = await apiRequest('api/users/datahistory', 'POST', data);
    console.log('userdatahistoryyyyyyyy', activeusers);
    if (activeusers?.status === 'success') {
      if (exportKey) {
        setExportData(
          activeusers?.value?.rows.map((x) => {
            return {
              // id: x.id,
              User_id: x.user_id,
              Name: x.user_name,
              Role: x?.user_roles ?? ['Learner'],
              Last_Logged_In: x.last_signin_date,
              Last_Logged_Out: x.last_signout_date,
              Session_Duration: sessionDuration(
                x.last_signin_date,
                x.last_signout_date
              ),
            };
          })
        );
      } else {
        setPending(false);
        const usersActivityData = activeusers?.value?.rows.map((x) => {
          return {
            // id: x.id,
            user_id: x.user_id,
            user_name: x.user_name,
            roles: x?.user_roles ?? ['Learner'],
            last_logged_in: x.last_signin_date,
            last_logged_out: x.last_signout_date,
            session_duration: sessionDuration(
              x.last_signin_date,
              x.last_signout_date
            ),
          };
        });

        setTotalItems(activeusers.value?.totalItems);
        setUserActivityData(usersActivityData);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'activity') {
      getActivities();
    } else if (activeTab === 'user') {
      getUserActivities();
    }
  }, [dateRange, current, size, activty, moduleType, activeTab]);

  const dateFormatter = (date) => {
    let dayOfMonth = date.getDate();
    let monthName = date.toLocaleString('default', { month: 'short' });
    let formattedDate = `${dayOfMonth} ${monthName}`;
    return formattedDate;
  };

  const toTimeAgoformat = (date) => {
    // Get the current time in UTC
    const now = new Date();
    // Parse the given time string as a date object
    const time = new Date(date);
    // Calculate the difference between the two times in milliseconds
    const diff = now.getTime() - time.getTime();
    // Convert the time difference to a human-readable format
    console.log(diff);
    let timeAgo;
    if (diff < 1000) {
      timeAgo = 'just now';
    } else if (diff < 60000) {
      const seconds = Math.floor(diff / 1000);
      timeAgo =
        seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      timeAgo =
        minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      timeAgo = hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      timeAgo = days === 1 ? `${days} day ago` : `${days} days ago`;
    } else {
      timeAgo = `${Math.floor(diff / 86400000)} days ago`;
    }

    // Format the timestamp string as specified with time before date
    // const timestamp = time.toLocaleString('en-US', {
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   hour12: false,
    //   day: '2-digit',
    //   month: 'short',
    //   year: 'numeric'
    // }).replace(',', '');
    const time1 = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const day1 = time.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTimestamp = `${time1}, ${day1}`;

    console.log(timeAgo); // e.g. "2 days ago"
    // console.log(timestamp); // e.g. "10:15:36 AM, Apr 25, 2023"

    return (
      <div>
        <div style={{ marginBottom: '4px' }}>{timeAgo}</div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          {formattedTimestamp}
        </div>
      </div>
    );
  };

  const userActivityTimeFormat = (date1) => {
    if (date1) {
      const date = new Date(date1);

      const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
      const timeString = date.toLocaleTimeString('en-US', timeOptions);

      const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const dateString = date.toLocaleDateString('en-US', dateOptions);

      console.log(timeString); // '10:00 AM'
      console.log(dateString); // 'Feb 3, 2023'
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: '4px' }}>{timeString}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{dateString}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  const sessionDuration = (last_logged_in, last_logged_out) => {
    let temp;

    if (last_logged_in === null || last_logged_out === null) {
      temp = null;
    } else {
      const signin = new Date(last_logged_in);
      const signout = new Date(last_logged_out);
      let duration = signout.getTime() - signin.getTime();
      duration = Math.abs(duration); // If signout time is less than signin time, calculate absolute difference
      const hours = Math.floor(duration / 3600000); // Convert to hours
      const minutes = Math.floor((duration % 3600000) / 60000); // Convert to minutes
      const seconds = Math.floor((duration % 60000) / 1000); // Convert to seconds

      const formatted = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      temp = formatted;
    }

    return temp;
  };

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );

  const activityColumns = [
    {
      name: 'User ID',
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: 'User Name',
      selector: (row) => toTitleCase(row.user_name),
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => (
        console.log('row::', row),
        (
          <>
            {row.roles.includes('learner') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Learner')}
              >
                <i className="mr-1">
                  <LearnerRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('admin') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Admin')}
              >
                <i className="mr-1">
                  <AdminRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('super admin') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Super Admin')}
              >
                <i className="mr-1">
                  <SuperAdminRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('trainer') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Trainer')}
              >
                <i className="mr-1">
                  <TrainerRoleIcon />
                </i>
              </OverlayTrigger>
            )}{' '}
            {row.roles.includes('job architect') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Job Architect')}
              >
                <i className="mr-1">
                  <JobArchitectRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('training facilitator') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Training Facilitator')}
              >
                <i className="mr-1">
                  <TrainingFacilitatorRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('client representative') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Client Representative')}
              >
                <i className="mr-1">
                  <ClientRepresentativeRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.length == 0 && 'Unassigned'}
          </>
        )
      ),

      filteredItems: true,
      sortable: true,
    },
    {
      name: (
        <>
          Activity &nbsp;
          {/* <FilterIcon /> */}
          <Dropdown drop="">
            <Dropdown.Toggle variant="white">
              <FilterIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item>Upload </Dropdown.Item> */}
              {/* <Dropdown.Item> */}
              {activityLogType.map((activityLogType, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setActivity(activityLogType.id);
                    }}
                    className={activty === activityLogType.id ? 'selected' : ''}
                  >
                    {toTitleCase(activityLogType?.name)}
                  </Dropdown.Item>
                </React.Fragment>
              ))}
              {/* </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </>
      ),
      selector: (row) => toTitleCase(row.activity),
      // sortable: true,
    },
    {
      name: (
        <>
          Module Type &nbsp;
          {/* <FilterIcon /> */}
          <Dropdown drop="">
            <Dropdown.Toggle variant="white">
              <FilterIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item>Upload </Dropdown.Item> */}
              {/* <Dropdown.Item> */}
              {moduleTypeList.map((module_type, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setModuleType(module_type.id);
                    }}
                    className={moduleType === module_type.id ? 'selected' : ''}
                  >
                    {toTitleCase(module_type.name)}
                  </Dropdown.Item>
                </React.Fragment>
              ))}
              {/* </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </>
      ),
      selector: (row) => toTitleCase(row.module_type),
    },
    {
      name: 'Module Name',
      selector: (row) => toTitleCase(row.module_name),
      width: '10rem',
      sortable: true,
    },
    {
      name: 'Time Stamp',
      selector: (row) => toTimeAgoformat(row.time_stamp),
      sortable: true,
    },
  ];

  const userActitvityColumns = [
    {
      name: 'User ID',
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: 'User Name',
      selector: (row) => toTitleCase(row.user_name),
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => (
        console.log('row::', row),
        (
          <>
            {row.roles.includes('Learner') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Learner')}
              >
                <i className="mr-1">
                  <LearnerRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('Admin') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Admin')}
              >
                <i className="mr-1">
                  <AdminRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('Super Admin') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Super Admin')}
              >
                <i className="mr-1">
                  <SuperAdminRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('Trainer') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Trainer')}
              >
                <i className="mr-1">
                  <TrainerRoleIcon />
                </i>
              </OverlayTrigger>
            )}{' '}
            {row.roles.includes('Job Architect') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Job Architect')}
              >
                <i className="mr-1">
                  <JobArchitectRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('Training Facilitator') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Training Facilitator')}
              >
                <i className="mr-1">
                  <TrainingFacilitatorRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('Client Representative') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Client Representative')}
              >
                <i className="mr-1">
                  <ClientRepresentativeRoleIcon />
                </i>
              </OverlayTrigger>
            )}
          </>
        )
      ),

      filteredItems: true,
      sortable: true,
    },
    {
      name: 'Last Logged in',
      selector: (row) => userActivityTimeFormat(row.last_logged_in) ?? '-',
      sortable: true,
    },
    {
      name: 'Last Logged out',
      selector: (row) =>
        userActivityTimeFormat(row.last_logged_out) &&
          new Date(row.last_logged_out) >= new Date(row.last_logged_out)
          ? userActivityTimeFormat(row.last_logged_out)
          : '-',
      sortable: true,
    },
    {
      name: 'Session Duration',
      selector: (row) => row.session_duration ?? '-',
    },
  ];

  // const userActitvityData = [
  //   {
  //     id: 1,
  //     user_id: '200001',
  //     user_name: 'Sarath Kumar',
  //     role: 'Learner',
  //     last_logged_in: '10:00 AM',
  //     last_logged_out: '6:00 PM',
  //     session_duration: '13:40:00',
  //   },
  //   {
  //     id: 2,
  //     user_id: '200002',
  //     user_name: 'Pavan Kumar',
  //     role: 'Trainer',
  //     last_logged_in: '10:30 AM',
  //     last_logged_out: '05:30 AM',
  //     session_duration: '10:00:00',
  //   },
  //   {
  //     id: 3,
  //     user_id: '200003',
  //     user_name: 'Kumar',
  //     role: 'Admin',
  //     last_logged_in: '10:00 AM',
  //     last_logged_out: '07:00 PM',
  //     session_duration: '13:00:00',
  //   },
  //   {
  //     id: 4,
  //     user_id: '200004',
  //     user_name: 'Vijay Dalapathi',
  //     role: 'Job Architect',
  //     last_logged_in: '10:00 AM',
  //     last_logged_out: '05:00 PM',
  //     session_duration: '6:00:00',
  //   },
  //   {
  //     id: 5,
  //     user_id: '200009',
  //     user_name: 'Giri Kumar',
  //     role: 'Learner',
  //     last_logged_in: '10:00 AM',
  //     last_logged_out: '06:00 PM',
  //     session_duration: '09:00:00',
  //   },
  //   {
  //     id: 6,
  //     user_id: '200006',
  //     user_name: 'Nagarjuna Dube',
  //     role: 'Learner',
  //     last_logged_in: '01:00 PM',
  //     last_logged_out: '05:00 PM',
  //     session_duration: '05:00:00',
  //   },
  //   {
  //     id: 7,
  //     user_id: '200008',
  //     user_name: 'Lakshmi Chamundeswari',
  //     role: 'Learner',
  //     last_logged_in: '11:30 AM',
  //     last_logged_out: '05:30 PM',
  //     session_duration: '04:00:00',
  //   },
  // ];

  const handleGotoPage = (event) => {
    event.preventDefault();
    if (isValidNumber) {
      PaginationChange(Number(gotoPage));
    }
  };

  const handleInputChange = (event) => {
    const pattern = '[0-9]*';
    const isValid = pattern.test(event.target.value);
    setIsValidNumber(isValid);
    setGotoPage(event.target.value);
  };
  const handleTabSelect = (eventKey) => {
    console.log('%%%%%%%%%%%%%%%', eventKey);
    setDateRange({ value: 'Today', label: 'Today' });
    if (eventKey === 'user') {
      getUserActivities();
      setToDate(new Date());
    } else {
      getActivities();
      setToDate(new Date());
    }

    setActiveTab(eventKey);
  };

  const getActivityLogTitle = () => {
    return activeTab === 'activity' ? 'Activity Log' : 'User Log';
  };
  const PaginationChange = (page, pageSize) => {
    setCurrent(page);
    // setSize(pageSize);
  };
  const PrevNextArrow = (current, type, originalElement) => {
    if (type === 'prev') {
      return (
        <button>
          {' '}
          <PrevIcon />{' '}
        </button>
      );
    }
    if (type === 'next') {
      return (
        <button>
          {' '}
          <NextIcon />{' '}
        </button>
      );
    }
    return originalElement;
  };

  const CustomPagination = () => {
    return (
      <Pagination
        showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
        onChange={PaginationChange}
        total={totalItems}
        current={current}
        pageSize={size}
        showSizeChanger={true}
        // onShowSizeChange={PerPageChange}
        itemRender={PrevNextArrow}
        showQuickJumper={{
          goButton: (
            <button type="submit" onClick={handleGotoPage}>
              Go
            </button>
          ),
          input: (
            <input
              type="text"
              value={gotoPage}
              onChange={handleInputChange}
              style={{ borderColor: isValidNumber ? null : 'red' }}
            />
          ),
        }}
        locale={PaginationLocale}
        defaultPageSize={size}
        selectComponentClass={selectpagesize}
      // pageSizeOptions={['10', '20', '50', '100']}
      />
    );
  };
  const pagesizeoptionss = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const handlepagesize = (pageSize) => {
    console.log('pagesize', pageSize.value);
    setSize(pageSize.value);
  };

  const selectpagesize = () => {
    return (
      <Box className="d-flex align-items-center me-3">
        {' '}
        <label className="mb-0 me-2">Rows per page</label>{' '}
        <Select
          value={size}
          onChange={handlepagesize}
          options={pagesizeoptionss}
          placeholder={size}
          styles={{
            indicatorSeparator: (styles) => ({ display: 'none' }),
            control: (styles) => ({
              ...styles,
              minHeight: '32px',
              border: '1px solid #D9D9D9!important',
              minWidth: '3.5rem!important',
              width: '4.1rem!important',
            }),
          }}
        />{' '}
      </Box>
    );
  };

  const CustomHeader = () => {
    const dateRangeOptions = [
      // { value: 'all', label: 'All' }
      { value: 'Today', label: 'Today' },
      { value: 'Yesterday', label: 'Yesterday' },
      { value: 'Last Week', label: 'Last Week' },
      { value: 'Last Two Weeks', label: 'Last Two Weeks' },
      { value: 'Last 30 Days', label: 'Last 30 Days' },
    ];
    const handleChange = (selectedOption) => {
      setDateRange(selectedOption);
      const today = new Date();
      const from = new Date(today);
      if (selectedOption?.value === 'Last 30 Days') {
        from.setDate(today.getDate() - 30);
      } else if (selectedOption?.value === 'Last Two Weeks') {
        from.setDate(today.getDate() - 14);
      } else if (selectedOption?.value === 'Last Week') {
        from.setDate(today.getDate() - 7);
      } else if (selectedOption?.value === 'Yesterday') {
        from.setDate(today.getDate() - 1);
        setToDate(from);
      } else if (selectedOption?.value === 'Today') {
        setToDate(from);
      }
      setFromDate(from);
    };
    console.log('/////////////', fromDate, toDate);
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="mr-3">
          <span className="font-weight-bold">
            {dateFormatter(fromDate)} - {dateFormatter(toDate)}
          </span>
        </div>
        <div style={{ width: '200px' }}>
          <Select
            className='selectCss'
            options={dateRangeOptions}
            placeholder="Select an option"
            value={dateRange}
            onChange={handleChange}
            styles={{
              indicatorSeparator: (styles) => ({ display: 'none' }),
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <Box>
          <Box className="mb-5 mt-4 d-flex justify-content-between">
            {/* <HeaderWithButtonComponent
          title={getActivityLogTitle()}
          btnclassName="enhanced gradient"
          btnColor
        /> */}
            <h3>Logs</h3>


            <Dropdown>
              <Dropdown.Toggle variant="primary" id="exportDropdown">
                Export Log
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <CSVLink
                  ref={csvLinkRef}
                  data={exportData}
                  filename={'logdata.csv'}
                  target="_blank"
                  className="d-none"
                >
                  Export CSV
                </CSVLink>
                <Dropdown.Item onClick={() => getAndExportActivities('csv')}>
                  CSV
                </Dropdown.Item>
                <Dropdown.Item onClick={() => getAndExportActivities('xls')}>
                  XLSX
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Box>
          <Box className="tab-filter me-3">
            <CustomHeader />
          </Box>
          <Tabs
            defaultActiveKey="activity"
            onSelect={handleTabSelect}
            id="uncontrolled-tab-example"
            className="users-tab mt-1"
          >
            <Tab
              eventKey="activity"
              title="Activity Log"
              className="indiidual-tab"
            >
              <DataTableComponent
                columns={activityColumns}
                data={activityData}
                noDataComponent={<CustomNoData title={'Activity log'} />}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                paginationComponent={CustomPagination}
                paginationPerPage={
                  pagesizeoptionss[pagesizeoptionss.length - 1].value
                }
              />{' '}
            </Tab>
            <Tab eventKey={'user'} title="User Log" className="corporate-tab">
              <DataTableComponent
                columns={userActitvityColumns}
                data={userActivityData}
                noDataComponent={<CustomNoData title={'User log'} />}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                paginationComponent={CustomPagination}
                paginationPerPage={
                  pagesizeoptionss[pagesizeoptionss.length - 1].value
                }
              />
            </Tab>
            <Select />
          </Tabs>
        </Box>
      )}
    </>
  );
}

export default ActivityLog;

const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Logs to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        {props.title} will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};

