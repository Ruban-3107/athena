import './ManageBatches.css';
import { Route, Link } from 'react-router-dom';
import { DataTableComponent, Modals } from '@athena/web-shared/ui';
import { apiRequest } from '@athena/web-shared/utils';
import {
  SortingIcon,
  EditIcon,
  DeleteIcon,
  SearchBar,
  FilterIcon,
  LearnerRoleIcon,
  TrainingFacilitatorRoleIcon,
  TrainerRoleIcon,
  JobArchitectRoleIcon,
  AdminRoleIcon,
  UserProfilePictureicon,
  NumberIcon,
  PrevIcon,
  NextIcon,
  Loader,
  Box,
  Span,
  ReactSelect,
  ButtonComponent,
} from '@athena/web-shared/ui';
import Select, { components } from 'react-select';
import React, { useState, useEffect, useRef } from 'react';
import Pagination from 'rc-pagination';
import moment from 'moment';
import { useRouter, PaginationLocale } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
import {
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Badge,
  Button,
} from 'react-bootstrap';
import { flexibleCompare } from '@fullcalendar/react';
import { BATCH_STATUSES } from '@athena/web-shared/utils';
// import { permissionCheck } from '../../../../../../libs/shared/commonFunctions/frontAbility';

export const ManageBatches = (props) =>{
  const [filterText, setFilterText] = useState(null);
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [size, setSize] = useState(10);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [batchesData, setBatchesdata] = useState([]);
  const [viewdelete, setViewDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [deleteBatchh, setDeleteBatchh] = useState([]);
  const [deleteBatches, setMultiDeleteBatches] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(true);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    if (modalShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [modalShow]);

  const columns = [
    {
      name: 'Batch Name',
      selector: (row) => row.batchname,
      sortable: true,
    },
    {
      name: 'Batch ID',
      selector: (row) => <Span className="ms-3">{row.batchid}</Span>,
      sortable: true,
    },
    {
      name: 'Corporate Group',
      selector: (row) => row.corporategroup,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: (row) => row.startdate,
    },
    {
      name: 'End Date',
      selector: (row) => row.enddate,
    },
    {
      name: (
        <>
          Status
          <Dropdown drop="">
            <Dropdown.Toggle variant="white">
              <FilterIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                href=""
                onClick={() => {
                  setStatus('all');
                }}
              >
                All
              </Dropdown.Item>
              {BATCH_STATUSES.map((userStatusType, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setStatus(userStatusType.status);
                    }}
                    className={
                      status === userStatusType.status ? 'selected' : ''
                    }
                  >
                    {' '}
                    {userStatusType.status}
                  </Dropdown.Item>
                </React.Fragment>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </>
      ),
      selector: 'status',
      // sortable: true,
      cell: (row) => {
        return (
          <div className="d-flex justify-content-end">
            <Dropdown className="status-dropdwn">
              <Dropdown.Toggle
                // variant={getStatusColor(row.status)}
                id="dropdown-basic"
                className="p-0 hover-css"
                style={{ border: 'none' }}
              >
                {/* <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip">
                      {row.status}
                    </Tooltip>
                  }
                > */}
                <h6
                  //  variant={getStatusColor(row.status)}
                  className="pe-4 status-dropdown"
                  style={{
                    fontSize: '12px',
                    outline: 'none',
                    border: 'none',
                    padding: 0,
                    color: getStatusColor(row.status),
                  }}
                >
                  {row.status}
                </h6>
                {/* </OverlayTrigger> */}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {BATCH_STATUSES &&
                  BATCH_STATUSES.map(({ status }, es4_index) => (
                    <Dropdown.Item
                      disabled={row.status == status}
                      key={es4_index}
                      onClick={(e) => {
                        console.log('zzzzzzzz', e, row.id, row);
                        // setSelectedStatus(e.target.id);
                        changeEmployeeStatus(row.batchid, e.target.id);
                        // handleShow("change_employee_status");
                        // setBatchId(row.batchid);
                      }}
                      id={status}
                    >
                      {status}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        );
      },
    },
    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          {/* <span className="btn " onClick={() => {
            router.navigate(`/app/editbatch?id=${row.id}`);
          }}>
            <EditIcon />
          </span> */}
          <span
            onClick={() => {
              setModalShow(true);
              console.log('aaaaaaaaa', row);
               setDeleteBatchh([row]);
              //console.log("ssss", row.id);
              // setSelectedRows(row)
              //deleteBatch(row.id);
            }}
            className="btn p-2 ms-1"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      style: {
        width: '7rem',
        display: 'flex',
        justifyContent: 'center',
      },
    },
  ];

  useEffect(() => {
    console.log('rfrfrfrfffffffff');
    getBatches();
  }, [filterText, current, size, status]);

  useEffect(() => {
    console.log('eeeeeeeeeeee', viewdelete);
  }, [viewdelete]);

  useEffect(() => {
    console.log('qqqqqqqqqqqqqq', selectedRows);
  }, [selectedRows]);

  const getStatusColor = (status) => {
    return BATCH_STATUSES.find((x) => x.status == status?.trim())?.status_color;
  };

  const changeEmployeeStatus = async (batchid, status) => {
    let data = {};
    data['status'] = status;
    const batchresponse = await apiRequest(
      `api/batches/batches/${batchid}/updatestatus`,
      'PUT',
      data
    );
    if (batchresponse?.status === 'success') {
      console.log('ddddddddddd', batchresponse);
      toast.success('status updated successfully');
      getBatches();
    } else {
      toast.error(batchresponse?.message.message);
    }
  };

  const handleRowSelected = React.useCallback(
    (state) => {
      if (state.selectedCount) {
        // console.log('qqqqqqqqqqq', state.selectedCount > 0);
        setViewDelete(true);
        setMultiDeleteBatches(state.selectedRows);
        console.log('selectedrows', state);
        let ids = state.selectedRows.map((e) => e.id);
        setSelectedRows(ids);
        if (props?.second) {
          console.log(
            'selectedrowstwo',
            state.selectedRows.map((e) => e.id)
          );
          let a = JSON.stringify(state.selectedRows.map((e) => e.id));
          let b = JSON.parse(a);
          // setSelectedRows(b);
          props?.second(selectedRows);
          props?.updatedUser(selectedRows);
        }
      } else {
        setViewDelete(false);
      }
    },
    [props?.second]
  );

  const getBatches = async () => {
    let data = {};
    if (filterText) {
      data['searchkey'] = filterText;
    }
    data['status'] = status === 'all' ? 'all' : status;
    data['pageNo'] = filterText || status !== 'all' ? 1 : current;
    data['size'] = size;
    console.log(data,"datata");
    const batchresponse = await apiRequest(
      'api/batches/batches/searchBatch',
      'POST',
      data
    );
    console.log('batchresponse', batchresponse);
    if (batchresponse?.status === 'success') {
      const batchData = batchresponse?.value?.batchData?.rows.map((x) => {
        return {
          id: x.id,
          batchid: x.id,
          batchname: `${toTitleCase(x.name)}`,
          corporategroup: x.client?.corporate_group
            ? `${toTitleCase(x.client?.corporate_group)}`
            : '-',
          startdate: moment(x.started_at).format('DD-MM-YYYY'),
          enddate: x.end_at ? moment(x.end_at).format('DD-MM-YYYY') : '-',
          status: x.status,
          action: '',
        };
      });
      console.log('uiuiuiiuuiiuiuiuiuiu', JSON.stringify(batchData));
      // console.log("kkkkkkkkkkkkkkkkk", JSON.stringify(data1));
      setTotalItems(batchresponse.value?.batchData?.totalItems);
      setBatchesdata(batchData);
      setPending(false);
      // setFilteredUserData(batchData);
    
    } else if (batchresponse?.message === 'OFFSET must not be negative') {
      setTotalItems(0);
      setBatchesdata([]);
      setPending(false);
    } else {
      toast.error(batchresponse?.message?.message);
      setPending(false);
    }
  };

  
  console.log(batchesData,"batchdata");
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText(null);
      }
    };

    return (
      <>
        <SearchBar
          forrmgroupclassname="batchbar"
          onChange={(e) => setFilterText(e.target.value)}
          // onClear={handleClear}
          // filterText={filterText}
        />
      </>
    );
  }, []);

  const PaginationChange = (page, pageSize) => {
    setCurrent(page);
    // setSize(pageSize);
  };
  const PrevNextArrow = (current, type, originalElement) => {
    if (type === 'prev') {
      return (
        <button
          className="rounded-1 overflow-hidden"
          style={{ border: '1px rgb(211, 216, 211) solid' }}
        >
          <PrevIcon />
        </button>
      );
    }
    if (type === 'next') {
      return (
        <button
          className="rounded-1 overflow-hidden"
          style={{ border: '1px rgb(211, 216, 211) solid' }}
        >
          <NextIcon />
        </button>
      );
    }
    return originalElement;
  };

  useEffect(() => {
    console.log('statusstatusstatus::', status);
  }, [size]);
  const pagesizeoptionss = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handlepagesize = (pageSize) => {
    console.log('///////////////////', pageSize);
    setSize(pageSize.value);
  };
  const selectpagesize = () => {
    return (
      <Box className="d-flex align-items-center me-3">
        <label className="mb-0 me-2">Rows per page</label>
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
        />
      </Box>
    );
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
        showQuickJumper={{ goButton: <button type="button">Go</button> }}
        locale={PaginationLocale}
        defaultPageSize={size}
        selectComponentClass={selectpagesize}
      />
    );
  };
  return (
    <>
      {pending ? (
        <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
      ) : (
        <>
          <Box
            className="mr-2 position-absolute z-1"
            style={{ right: '255px' }}
          >
            {viewdelete ? (
              <ButtonComponent
                onClick={() => {
                  setModalShow(true);
                  //(false)
                  //handleClearRows();
                  setToggleClearRows(true);

                  // setDisable('Disable');
                  // deleteBatch();
                }}
                type="button"
                size="md"
                className="rounded-4 px-5 mt-2 mx-5"
                variant="outline-primary"
                name="Delete"
              />
            ) : null}
          </Box>
          <Modals
            delete={deleteBatchh}
            multidelete={deleteBatches}
            type="batch"
            show={modalShow}
            onHide={(arg) => {
              setModalShow(false);
              getBatches();
              !arg ? setViewDelete(false) : setViewDelete(true);
              setDeleteBatchh([]);
              setMultiDeleteBatches([]);
              // setDisableDeleteButtonView(false)
              setSelectedRows([]);
              // setIsRowSelected(false);
              setToggleClearRows(true);
              setViewDelete(false);
            }}
          />
          <DataTableComponent
            columns={columns}
            sortIcon={<SortingIcon />}
            data={batchesData}
            subHeaderComponent={subHeaderComponentMemo}
            subHeader
            subHeaderAlign="right"
            subHeaderWrap
            pagination
            noDataComponent={<CustomNoData title={'batches'} />}
            paginationResetDefaultPage={resetPaginationToggle}
            paginationComponent={CustomPagination}
            paginationPerPage={
              pagesizeoptionss[pagesizeoptionss.length - 1].value
            }
            persistTableHead
            selectableRows
            handleRowSelected={handleRowSelected}
            clearSelectedRows={toggledClearRows}
          />
        </>
      )}
    </>
  );
}
export default ManageBatches;

const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Batches to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Added {props.title} will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};
