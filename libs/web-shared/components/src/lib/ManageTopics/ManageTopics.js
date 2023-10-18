import './ManageTopics.css';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Span, DataTableComponent, SearchBar, ButtonComponent, EditIcon, DeleteIcon, FilterIcon, PrevIcon, NextIcon, Modals, Loader } from '@athena/web-shared/ui';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'rc-pagination';
import { apiRequest, useRouter, useAuth, topicTypeData, deliveryTypeData, statusTypes, PaginationLocale } from '@athena/web-shared/utils';
import { toast } from 'react-toastify';
export function ManageTopics(props) {
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [status, setStatus] = useState('all');
  const [topicType, setTopicType] = useState('all');
  const [deliveryType, setDeliveryType] = useState('all');
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [topics, setTopics] = useState([]);
  const [size, setSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [disableButtonView, setDisableButtonView] = useState(false);
  const [disableDeleteButtonView, setDisableDeleteButtonView] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [deleteTopic, setDeleteTopic] = useState([]);
  const [gotoPage, setGotoPage] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [pending, setPending] = useState(true);
  const [userrole, setuserrole] = useState('')
  const [enablePublishButtonView, setenablePublishButtonView] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    if (auth && auth.user) {
      setuserrole(auth?.user?.role[0]?.name)
    }
  }, [auth]);

  const handleGotoPage = (event) => {
    event.preventDefault();
    if (isValidNumber) {
      PaginationChange(Number(gotoPage));
    }
  };

  const handleInputChange = (event) => {
    const pattern = "[0-9]*";
    const isValid = pattern.test(event.target.value);
    setIsValidNumber(isValid);
    setGotoPage(event.target.value);
  };

  const getTopics1 = async () => {
    let data = {};
    if (filterText) {
      data['searchkey'] = filterText;
    }
    // else {
    data['status'] = status;
    data['topicType'] = topicType;
    data['deliveryType'] = deliveryType;
    console.log(topicType, 'ssssssssssss');
    // }
    data['pageNo'] = (filterText || deliveryType != "all" || topicType != "all" || status != "all") ? 1 : current;
    data['size'] = size;
    console.log('/////////////////////hellooo', data);
    let topicsResponse = await apiRequest(
      'api/courses/topics/searchAndFilterTopic',
      'POST',
      data
    );
    console.log('/////////////////////hellooo', topicsResponse);
    let filteredTopicResponse = topicsResponse?.value?.topicData?.rows.map(
      (x) => {
        return {
          id: x.id,
          topicname: x.title,
          topictype: x.topic_type,
          deliverytype: x.delivery_type,
          duration: Math.round(x.duration),
          status: x.status,
          technology_skills: x.technology_skills,
        };
      }
    );
    console.log('/////////////////////', filteredTopicResponse);
    if (filteredTopicResponse) {
      setTopics(filteredTopicResponse);
      setPending(false)
      setTotalItems(topicsResponse?.value?.topicData?.totalItems);
    } else {

      setPending(false)
    }
  };
  const handleRowSelected = React.useCallback((state) => {
    if (state.selectedCount) {
      // setDeleteTopic(row);
      setIsRowSelected(true);
      console.log('zzzzzzzzzzzz', state);
      setSelectedRows(state.selectedRows);
      let statuses = state.selectedRows.map((x) => x.status);
      console.log(statuses, 'statuses');
      let bool1 = statuses.every((val, i, arr) => val === 'Pending Approval');
      let bool = statuses.every((val, i, arr) => (val === 'In Draft') || (val === 'Approved') || (val === 'Pending Approval') || (val === 'Rejected'));
      let approveBool = statuses.every((val, i, arr) => val === 'Approved')
      console.log(bool, 'bool');
      setDisableButtonView(bool1);
      setDisableDeleteButtonView(bool);
      setenablePublishButtonView(approveBool)
      console.log('bool1bool1::', bool1);
    } else {
      setIsRowSelected(false);
      setDisableButtonView(false);
      setDisableDeleteButtonView(false);
      setenablePublishButtonView(false)

    }
  }, []);

  const updateTopics = async (value) => {
    let data = {};
    data['ids'] = selectedRows?.map((e) => e.id);
    data['status'] = value
    console.log(data, 'publishedids');

    let publishTopicsResponse = await apiRequest(
      'api/courses/topics/status',
      'PUT',
      data
    );
    console.log(publishTopicsResponse, "publishresp");

    if (publishTopicsResponse) {
      console.log(publishTopicsResponse, "topicresponse");
      setToggleClearRows(!toggledClearRows);
      setDisableButtonView(false);
      setenablePublishButtonView(false);
      setDisableDeleteButtonView(false);
      toast.success(`Topic ${value}Successfully`);
      setStatus('all');
      setSelectedRows([]);
      setIsRowSelected(false);
      getTopics1();


    }
    setSelectedRows([]);
  };



  useEffect(() => {
    getTopics1();
  }, [filterText, current, size, status, topicType, deliveryType]);

  useEffect(() => {
    if (modalShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [modalShow]);

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };


  const handleRowClicked = (row) => {
    //  if(row.status == "Published")
    const statuss = row.status
    router.navigate(`/app/createtopics/${row.id}`);
    console.log('Row clicked:', row);
  };
  const rolesToCheck = ["Trainer", "Job Architect"];
  const columns = [
    {
      name: 'Topic Name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span onClick={() => {
            router.navigate(`/app/createtopics/${row.id}`);
          }}>
            {row.topicname}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: (
        <>
          {' '}
          Topic Type
          <Dropdown drop="">
            {' '}
            <Dropdown.Toggle variant="white">
              {' '}
              <FilterIcon />{' '}
            </Dropdown.Toggle>{' '}
            <Dropdown.Menu>
              {' '}
              <Dropdown.Item
                href=""
                onClick={() => {
                  setTopicType('all');
                }}
              >
                {' '}
                All
              </Dropdown.Item>{' '}
              {topicTypeData.map((topicType, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setTopicType(topicType.id);
                    }}
                  >
                    {' '}
                    {console.log(topicType.name, 'typename')}
                    {topicType.name}
                  </Dropdown.Item>{' '}
                </React.Fragment>
              ))}
            </Dropdown.Menu>{' '}
          </Dropdown>{' '}
        </>
      ),
      selector: (row) => row.topictype,
      //sortable: true,
    },
    {
      name: (
        <>
          {' '}
          Delivery Type
          <Dropdown drop="">
            {' '}
            <Dropdown.Toggle variant="white">
              {' '}
              <FilterIcon />{' '}
            </Dropdown.Toggle>{' '}
            <Dropdown.Menu>
              {' '}
              <Dropdown.Item
                href=""
                onClick={() => {
                  setDeliveryType('all');
                }}
              >
                {' '}
                All
              </Dropdown.Item>{' '}
              {deliveryTypeData.map((deliveryTypeData, index) => (
                <React.Fragment key={index}>

                  {console.log(deliveryTypeData, "deliveryTypeData")}
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setDeliveryType(deliveryTypeData.id);
                    }}

                  >
                    {' '}
                    {deliveryTypeData.name}
                  </Dropdown.Item>{' '}
                </React.Fragment>
              ))}
            </Dropdown.Menu>{' '}
          </Dropdown>{' '}
        </>
      ),
      selector: (row) => row.deliverytype,
      //sortable: true,
    },
    {
      name: 'Duration',
      selector: (row) => Math.round(row.duration) + ' ' + 'min',
      // sortable: true,
    },
    {
      name: (
        <>
          {' '}
          Status
          <Dropdown drop="">
            {' '}
            <Dropdown.Toggle variant="white">
              {' '}
              <FilterIcon />{' '}
            </Dropdown.Toggle>{' '}
            <Dropdown.Menu>
              {' '}
              <Dropdown.Item
                href=""
                onClick={() => {
                  setStatus('all');
                }}
              >
                {' '}
                All
              </Dropdown.Item>{' '}
              { }
              {statusTypes.map((statusType, index) => (
                <React.Fragment key={index}>
                  <Dropdown.Item
                    href=""
                    onClick={() => {
                      setStatus(statusType.id);
                    }}
                  >
                    {' '}
                    {statusType.name}
                  </Dropdown.Item>{' '}
                </React.Fragment>
              ))}
            </Dropdown.Menu>{' '}
          </Dropdown>{' '}
        </>
      ),

      selector: (row) => (
        <>
          {' '}
          {row.status === 'Approved' && (
            <p
              className="status-txt"
              style={{ color: '#306516', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'Rejected' && (
            <p
              className="status-txt"
              style={{ color: '#FB3B3B', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'In Draft' && (
            <p
              className="status-txt"
              style={{ color: '#096DD9', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'Pending Approval' && (
            <p
              className="status-txt"
              style={{ color: '#EFB90A', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'Published' && (

            <p
              className="status-txt"
              style={{ color: '#52C41A', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>

          )}
          {row.status === 'Review In Progress' && (
            <p
              className="status-txt"
              style={{ color: '#ED8835', fontWeight: 600 }}
            > {toTitleCase(row.status)}
            </p>
          )}
        </>
      ),
    },
    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            onClick={() => {
              if (row.status == 'Published') {
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              } else if (row.status == "Approved" && rolesToCheck.includes(userrole)) {
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              } else if (row.status == "Review In Progress" && userrole == "Trainer") {
                toast.warning(`You cannot delete  ${row.status}  topic`);
                setenablePublishButtonView(false);
              } else {
                setModalShow(true);
                setDeleteTopic(row);
                setenablePublishButtonView(false);
              }
            }}
            className="btn p-2 ms-3"
          >
            {' '}
            <DeleteIcon />{' '}
          </span>{' '}
        </div>
      ),
      width: '7rem',
    },
  ];
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return (
      <>
        {' '}
        <SearchBar
          forrmgroupclassname="topicbar"
          onChange={(e) => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        // value={filterText}
        />{' '}
        &nbsp;
      </>

    );
  }, [filterText]);

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
          {' '}
          <PrevIcon />{' '}
        </button>
      );
    }
    if (type === 'next') {
      return (
        <button
          className="rounded-1 overflow-hidden"
          style={{ border: '1px rgb(211, 216, 211) solid' }}
        >
          {' '}
          <NextIcon />{' '}
        </button>
      );
    }
    return originalElement;
  };
  useEffect(() => {
    console.log('statusstatusstatus::', size);
  }, [size]);
  const pagesizeoptionss = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const handlepagesize = (pageSize) => {
    console.log('pagesize', pageSize.value);
    setSize(pageSize?.value);
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
  const CustomPagination = () => {
    return (
      <Pagination
        showTotal={(total, range) => `${range[0] > total ? 1 : range[0]} to ${range[1]} of ${total}`}
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
          )
        }}

        locale={PaginationLocale}
        defaultPageSize={size}
        selectComponentClass={selectpagesize}
      // pageSizeOptions={['10', '20', '50', '100']}
      />
    );
  };
  const rowdisablecriteria = (row) => {
    if (userrole === 'Trainer') {
      return (row.status === "Published" || row.status === "Approved")

    } else {

      return row.status === "Published"
    }
  };
  return (
    <>
      {pending
        ? (<Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
        ) : (
          <>
            <Box className="managebutton-align mr-2">
              {' '}
              {disableDeleteButtonView ? (userrole === "Job Architect" && status === "Approved") ? null : (

                <ButtonComponent
                  type="button"
                  variant="outline-primary"
                  size="md"
                  className="managetopicdeletebutton"
                  name="Delete&nbsp;"
                  onClick={() => {
                    // deleteTopics()
                    setModalShow(true);
                    setDisableDeleteButtonView(false);
                  }}
                />
              ) : null}
              &nbsp;
              {enablePublishButtonView ? (
                <ButtonComponent
                  type="button"
                  variant="outline-primary"
                  size="md"
                  className="managechapterpublishbutton"
                  name="Publish&nbsp;"
                  onClick={() => updateTopics("Published")}
                />
              ) : null}
              &nbsp;
              {console.log(disableButtonView, 'disbutton')}

            </Box>{' '}
            <Modals
              delete={[deleteTopic]}
              multidelete={selectedRows}
              type="topic"
              show={modalShow}
              onHide={() => {
                setModalShow(false);
                setDeleteTopic(null);
                setDisableDeleteButtonView(false);
                setSelectedRows([]);
                setIsRowSelected(false);
                setStatus('all');
                getTopics1();
              }}
            />
            <DataTableComponent
              columns={columns}
              data={topics}
              selectableRows
              subHeaderComponent={subHeaderComponentMemo}
              subHeader
              subHeaderAlign="right"
              subHeaderWrap
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              paginationComponent={CustomPagination}
              paginationPerPage={pagesizeoptionss[pagesizeoptionss.length - 1].value}
              persistTableHead
              onSelectedRowsChange={handleRowSelected}
              clearSelectedRows={toggledClearRows}
              noDataComponent={<CustomNoData title={'topics'} />}
              selectableRowDisabled={rowdisablecriteria}
              onRowClicked={handleRowClicked} />
          </>
        )}
    </>
  );
}
export default ManageTopics;

const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Topics to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Added {props.title} will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};
