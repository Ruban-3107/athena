import './ManageChapters.css';
import React, { useState, useEffect } from 'react';
import { Box, Span } from '@athena/web-shared/ui';
import { DataTableComponent, SearchBar, ButtonComponent, EditIcon, DeleteIcon, FilterIcon, PrevIcon, NextIcon, Modals, Loader } from '@athena/web-shared/ui';
import { apiRequest, statusTypes, useAuth, useRouter, PaginationLocale } from '@athena/web-shared/utils';

import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'rc-pagination';
import { toast } from 'react-toastify';
export function ManageChapters(props) {
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState('all');
  const [current, setCurrent] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [chapters, setChapters] = useState([]);
  const [size, setSize] = useState(10);
  const [disable, setDisable] = useState('');
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [disableButtonView, setDisableButtonView] = useState(false);
  const [disableDeleteButtonView, setDisableDeleteButtonView] = useState(false);
  const [deleteChapter, setDeleteChapter] = useState([]);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(true);
  const [enablePublishButtonView, setenablePublishButtonView] = useState(false);
  const [userrole, setuserrole] = useState('')
  const [gotoPage, setGotoPage] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    if (auth && auth.user) {
      setuserrole(auth?.user?.role[0]?.name)
    }
  }, [auth]);

  const getChapters = async () => {
    let data = {};
    if (filterText) {
      data['searchkey'] = filterText;
    }
    //  else {
    data['status'] = status;
    //  }
    data['size'] = size;
    data['pageNo'] = (filterText || status != "all") ? 1 : current;

    let chaptersResponse = await apiRequest(
      'api/courses/chapters/getChapters',
      'POST',
      data
    );
    let filteredChapterResponse =
      chaptersResponse?.value?.chapterData?.rows.map((x) => {
        let duration2 = 0;
        if (x.chapter_topics.length > 0) {
          duration2 = x.chapter_topics?.reduce(
            (acc, ob) => Number(acc) + Number(ob.duration),
            0
          );
        }
        let duration1 = duration2;

        return {
          id: x.id,
          chaptername: x.title,
          numberoftopics: x.chapter_topics?.length,
          duration: duration1,
          status: x.status,
        };
      });
    if (filteredChapterResponse) {
      console.log(filteredChapterResponse, "filteredChapterResponse");
      setChapters(filteredChapterResponse);
      setPending(false);
      // setenablePublishButtonView(false);
      // setDisableDeleteButtonView(false);
      setTotalItems(chaptersResponse?.value?.chapterData?.totalItems);

    } else {
      setPending(false);
      // setenablePublishButtonView(false);
      // setDisableDeleteButtonView(false);
    }

  };

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  const rolesToCheck = ['Trainer', 'Job Architect'];


  const handleRowSelected = React.useCallback((state) => {
    if (state.selectedCount) {
      setIsRowSelected(true);
      setSelectedRows(state.selectedRows);
      let statuses = state.selectedRows.map((x) => x.status);
      let bool1 = statuses.every((val, i, arr) => val === 'Pending Approval');
      let bool = statuses.every((val, i, arr) => (val === 'In Draft') || (val === 'Approved') || (val === 'Pending Approval') || (val === 'Rejected'));
      let approveBool = statuses.every((val, i, arr) => val === 'Approved')

      setDisableButtonView(bool1);
      setDisableDeleteButtonView(bool);
      setenablePublishButtonView(approveBool)
    } else {
      setIsRowSelected(false);
      setDisableButtonView(false);
      setDisableDeleteButtonView(false);
      setenablePublishButtonView(false)
    }
  }, []);
  const handleRowClicked = (row) => {
    // if(row.status != "Published")
    const statuss = row.status
    router.navigate(`/app/createchapter/${row.id}`);
    console.log('Row clicked:', row);

  };
  const updateChapters = async (value) => {
    let data = {};
    data['ids'] = selectedRows?.map((e) => e.id);
    data['status'] = value;
    let publishChaptersResponse = await apiRequest(
      'api/courses/chapters/publishChapters',
      'PUT',
      data
    );
    if (publishChaptersResponse) {
      toast.success(`Chapter ${value} Successfully`);
      setToggleClearRows(!toggledClearRows);
      setDisableButtonView(false);
      setDisableDeleteButtonView(false);
      setenablePublishButtonView(false);
      setSelectedRows([]);
      setStatus('all');
      setIsRowSelected(false);
      getChapters();
      console.log(publishChaptersResponse, 'publishChaptersResponse');
    }
    setSelectedRows([]);
  };

  useEffect(() => {
    getChapters();
  }, [filterText, current, size, status]);

  useEffect(() => {
    if (modalShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [modalShow]);

  const rowdisablecriteria = (row) => {
    if (userrole === 'Trainer') {
      return (row.status === "Published" || row.status === "Approved")

    } else {

      return row.status === "Published"
    }

  };
  const columns = [
    {
      name: 'Chapter Title',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span onClick={() => {
            router.navigate(`/app/createchapter/${row.id}`);
          }}>
            {row.chaptername}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Number of Topics',
      selector: (row) => <Span className="ms-3">{row.numberoftopics}</Span>,
      sortable: true,
    },
    {

      name: 'Duration',
      selector: (row) => row.duration,
      cell: (row) => Math.round(row.duration) + ' ' + 'min',
      sortable: true,
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
      )
    },

    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          {' '}

          <span
            onClick={() => {
              if (row.status == 'Published') {
                toast.warning(`You cannot delete  ${row.status}  chapter`);
                setenablePublishButtonView(false);
              } else if (row.status == "Approved" && rolesToCheck.includes(userrole)) {
                toast.warning(`You cannot delete  ${row.status}  chapter`);
                setenablePublishButtonView(false);
              } else if (row.status == "Review In Progress" && userrole == "Trainer") {
                toast.warning(`You cannot delete  ${row.status}  chapter`);
                setenablePublishButtonView(false);
              } else {
                setModalShow(true);
                setDeleteChapter([row]);
                setenablePublishButtonView(false);
              }
            }}
            className="btn p-2 ms-3"
          >
            <DeleteIcon />
          </span>
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
      <SearchBar
        onChange={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        forrmgroupclassname="bottom"
      />
    );
  }, [filterText, resetPaginationToggle]);

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
  const handlepagesize = (pageSize) => {
    console.log('///////////////////', pageSize);
    setSize(pageSize.value);
  };

  const selectpagesize = () => {
    return (
      <Box className="d-flex align-items-center me-3">
        {' '}
        <label className="mb-0">Rows per page</label>
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
              minWidth: '5rem!important',
              width: '4.1rem!important',
            }),
          }}
        />{' '}
      </Box>
    );
  };
  const CustomPagination = () => {
    const totalPages = Math.ceil(totalItems / size);
    const handleQuickJumperChange = (page) => {
      if (page > totalPages) {
        return;
      }
      setCurrent(page);
    };
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
            <button
              type="button"
              disabled={current > totalPages}
              onClick={handleQuickJumperChange(current)}>
              Go
            </button>
          ),

        }}
        locale={PaginationLocale}
        defaultPageSize={size}
        selectComponentClass={selectpagesize}
      // pageSizeOptions={['10', '20', '50', '100']}
      />
    );
  };
  return (
    <>
      {pending
        ? <Span className="d-flex align-items-center justify-content-center loader-text">
          <Loader />
        </Span>
        :
        <>
          {' '}
          <Box className="manageChapterbutton-align mr-2">
            {' '}
            {disableDeleteButtonView ? (userrole === "Job Architect" && status === "Approved") ? null : (
              <ButtonComponent
                type="button"
                variant="outline-primary"
                size="md"
                className="managechapterdeletebutton "
                name="Delete&nbsp;"
                onClick={() => {
                  //deleteChapters()
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
                onClick={() => updateChapters("Published")}
              />
            ) : null}
            {console.log(disableButtonView, 'disbutton')}

          </Box>{' '}
          <Modals
            delete={deleteChapter === null ? [] : deleteChapter}
            multidelete={selectedRows}
            type="chapter"
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              getChapters();
              setDeleteChapter(null);
              setDisableDeleteButtonView(false);
              setSelectedRows([]);
              setIsRowSelected(false);
            }}
          />
          <DataTableComponent
            columns={columns}
            progressPending={pending}
            data={chapters}
            selectableRows
            subHeaderComponent={subHeaderComponentMemo}
            subHeader
            onRowClicked={handleRowClicked}
            subHeaderAlign="right"
            subHeaderWrap
            pagination
            paginationPerPage={
              pagesizeoptionss[pagesizeoptionss.length - 1].value
            }
            paginationResetDefaultPage={resetPaginationToggle}
            paginationComponent={CustomPagination}
            persistTableHead
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggledClearRows}
            noDataComponent={<CustomNoData title={'corporate'} />}
            selectableRowDisabled={rowdisablecriteria}
          />
        </>
      }
    </>
  );
}
export default ManageChapters;
const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Chapters to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Added chapters will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};