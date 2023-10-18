import './ManageCorporate.css';
import { Route, Link, useParams } from 'react-router-dom';
import {
  apiRequest,
  requireAuth,
  useRouter,
  PaginationLocale
  
} from '@athena/web-shared/utils';
import Dropdown from 'react-bootstrap/Dropdown';
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
  DataTableComponent,
  Modals,
  Box,
  Span,
  ButtonComponent,
} from '@athena/web-shared/ui';
import React, { useState, useEffect, useRef } from 'react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import Pagination from 'rc-pagination';
import { useSearchParams } from 'react-router-dom';

export const ManageCorporate =(props)=> {
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [current, setCurrent] = useState(1);
  const [CorporateData, setCorporateData] = useState();
  const [totalItems, setTotalItems] = useState(0);
  const [size, setSize] = useState(10);
  const [toggledClearDataRows, setToggleClearDataRows] = useState(false);
  const [Corporatelist, setCorporatelist] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [corporate, setCorporate] = useState('');
  const [primaryContact, setprimaryContact] = useState('');
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [corporateGroup, setcorporateGroup] = useState();
  const [pending, setpending] = useState(true);
  const id = searchParams.get('id');
  const [gotoPage, setGotoPage] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  console.log(id, '::::::::::id');
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
  const handleRowSelected = React.useCallback((state) => {
    if (state.selectedCount) {
      setIsRowSelected(true);
    } else {
      setIsRowSelected(false);
    }
    setSelectedRows(state.selectedRows.map((e) => e));
    console.log(selectedRoles, 'selectedrows');
  }, []);

  const handleClearRows = () => {
    setToggleClearDataRows(!toggledClearDataRows);
  };


  // To get the list of corporate group
  const getClients = async () => {
    let getClientData = {};
    if (filterText) {
      getClientData['searchKey'] = filterText;
    }
    getClientData['pageNo'] = filterText ? 1 : current;
    getClientData['size'] = size;
    console.log('^^^GETCLIENTDATA^^^', getClientData);
    const getClientsResponse = await apiRequest(
      'api/users/clients/getClients',
      'POST',
      getClientData
    );
    console.log('###GETCLIENTRESPONSE###', getClientsResponse);
    if (getClientsResponse?.status === 'success') {
      const clientUserData = getClientsResponse?.value?.clientData.rows.map(
        (data) => {
          return {
            id: data.id,
            corporateGroup: `${toTitleCase(data.corporate_group)}`,
            corporateName: `${toTitleCase(data.company_name)}`,
            primaryContact: `${toTitleCase(data.primary_contact)}`,
            email: data.primary_email,
          };
        }
      );
      setToggleClearRows(!toggledClearRows);

      setCorporatelist(clientUserData);
      setpending(false);
      setTotalItems(getClientsResponse.value?.clientData?.totalItems);
    } else {
      setpending(false);
      toast.error(getClientsResponse?.message);
      setCorporatelist([]);
    }
  };
  useEffect(() => {
    console.log('statusstatusstatus::', status);
 }, [size]);
 useEffect(() => {
   if (modalShow) document.body.style.overflow = 'hidden';
   else document.body.style.overflow = 'visible';
 }, [modalShow]);
  useEffect(() => {
   // getCorporate();
   getClients();
   // getCorporateById();
 }, [filterText, corporateGroup, primaryContact, current, size]);

 
 console.log(gotoPage,"gotopage");
 const handleRowClicked = (row) => {
   //  if(row.status == "Published")
   const statuss = row.status
   router.navigate(`/app/createcorporate/${row.id}`);
   console.log('Row clicked:', row);
 };
  const caseInsensitiveCorporateGroupSort = () => {
    if (corporateGroup == 'ASC') {
      setcorporateGroup('DESC');
      setprimaryContact('');
    } else {
      setcorporateGroup('ASC');
      setprimaryContact('');
    }
  };

  const caseInsensitivePrimaryContactSort = () => {
    if (primaryContact == 'ASC') {
      setprimaryContact('DESC');
      setcorporateGroup('');
    } else {
      setprimaryContact('ASC');
      setcorporateGroup('');
    }
  };

  const columns = [
    {
      name: 'Corporate Group',
      selector: (row) => row.corporateGroup,
      sortable: true,
      // sortFunction: caseInsensitiveCorporateGroupSort,
    },
    {
      name: 'Company Name',
      selector: (row) => row.corporateName,
      sortable: true,
    },
    {
      name: 'Group ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Primary Contact',
      selector: (row) => row.primaryContact,
      // sortFunction: caseInsensitivePrimaryContactSort,
    },
    {
      name: 'Email ID',
      selector: (row) => row.email,
      sortable:true,
    },
    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            className="btn "
            onClick={() => {
              router.navigate(`/app/createcorporate/${row.id}`);
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setModalShow(true);
              setUser([row]);
              setCorporate('Corporate');
            }}
            className="btn p-2 ms-1"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '7rem',
    },
  ];

  useEffect(() => {
    // getCorporate();
    getClients();
    // getCorporateById();
  }, [filterText, corporateGroup, primaryContact, current, size]);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <SearchBar
        forrmgroupclassname="corporatebar"
        onChange={(e) => setFilterText(e.target.value)}
         onClear={handleClear}
        filterText={filterText}
        value={filterText}
        defaultValue={filterText}
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
        <button className="rounded-1 overflow-hidden"
        style={{ border: '1px rgb(211, 216, 211) solid' }}>
          <PrevIcon />
        </button>
      );
    }
    if (type === 'next') {
      return (
        <button className="rounded-1 overflow-hidden"
        style={{ border: '1px rgb(211, 216, 211) solid' }}>
          <NextIcon />{' '}
        </button>
      );
    }
    return originalElement;
  };

  useEffect(() => {
    // console.log('statusstatusstatus::', status);
  }, [size]);

  function onShowSizeChange(current, pageSize) {
    console.log(current);
    console.log(pageSize);
  }

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

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // const caseInsensitiveCorporateGroupSort = () => {if (corporateGroup == 'ASC') { setcorporateGroup('DESC'); setprimaryContact(''); } else {setcorporateGroup('ASC'); setprimaryContact('');}};
  // const caseInsensitivePrimaryContactSort = () => {if (primaryContact == 'ASC') {setprimaryContact('DESC'); setcorporateGroup(''); } else {setprimaryContact('ASC');setcorporateGroup('');}};
  return (
    <>
    {pending ? (
      <Span className="d-flex align-items-center justify-content-center loader-text">
        <Loader />
      </Span>
    ) : (
      <>
       <Box className="corporatee-del-btn mr-2 ">
        {isRowSelected ? (
            <ButtonComponent
              onClick={() => {
                setModalShow(true);
                handleClearRows([]);
                setCorporate('Corporate');
              }}
              type="button"
              variant="outline-primary"
              size="md"
              className="me-3 addUser-btn rounded-4 px-4"
              name="Delete&nbsp;"
            />
         
        ) : null}
        </Box>
        {console.log(Corporatelist,"columns")}
        <Modals
          delete={user === null ? [] : user}
          multidelete={selectedRows}
          type={corporate}
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setSelectedRows([]);
            // getCorporate();
            getClients();
            setUser(null);
            setIsRowSelected(false);
            setCorporate('');
          }}
        />
        
        <DataTableComponent
          columns={columns}
          sortIcon={<SortingIcon />}
          data={Corporatelist} // GETCORPORATElist
          subHeaderComponent={subHeaderComponentMemo}
          onSelectedRowsChange={handleRowSelected}
          subHeader
          subHeaderAlign="right"
          subHeaderWrap
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          paginationComponent={CustomPagination}
          paginationPerPage={pagesizeoptionss[pagesizeoptionss.length - 1].value}
          clearSelectedRows={toggledClearRows}
          onRowClicked={handleRowClicked}
          persistTableHead
          selectableRows
          noDataComponent={<CustomNoData title={'corporate'} />}
        />
      </>
    )}
  </>
  );
}

export default ManageCorporate;

const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Corporate groups to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Added corporate groups will be listed here
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};

