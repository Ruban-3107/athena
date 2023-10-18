import './BatchUsers.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box } from '@athena/web-shared/ui';
import {
  DataTableComponent,
  SearchBar,
  ButtonComponent,
  SortingIcon,
  EditIcon,
  DeleteIcon,
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
} from '@athena/web-shared/ui';
import { Col, Row, Form, InputGroup, Container } from 'react-bootstrap';
import Select, { components } from 'react-select';
import {
  useFormContext,
  useForm,
  Controller,
  useFormState,
} from 'react-hook-form';
import { toast } from 'react-toastify';
// import { ApiRequest } from '@athena/admin-web-shared/utils';
import { apiRequest } from '@athena/web-shared/utils';

export const BatchUsers = (props) => {
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [status, setStatus] = useState();
  const [users, setUsers] = useState([]);
  const [userarray, setUserArray] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  // const myRef = useRef([]);

  const methods = useFormContext();
  const { clientId, data, clearsearch, clearData, fixinitialusers } = props;
  // const [search, setSearch] = useState(clearsearch);

  useEffect(() => {
    if (clientId) {
      getUsers(clientId);
    }
    console.log("ioioioi", filterText);
  }, [clientId, filterText]);

  // useEffect(() => {
  //   console.log("clearddddddddd", clearData);
  //   setSelectedRows([]);
  //   // handleClearRows();
  // }, [clearData,users])

  useEffect(() => {
    console.log("sssssssssss", selectedRows);
  }, [selectedRows])

  useEffect(() => {
    console.log("uiuiuiui", clearsearch, filterText === '');
    // if (clearsearch) {
    setFilterText('');
    // }
  }, [clearsearch]);
  // console.log("ffffff", props)

  useEffect(() => {
    console.log('dataa:', data);
    setUserArray(data?.map((x) => x.emailid));
  }, [data]);

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getUsers = async (id) => {
    console.log('zzzzzzzzz', id);
    let data = {};
    if (filterText) {
      data['searchkey'] = filterText;
    }
    const repResponse = await apiRequest(
      `api/users/client/${id}`,
      'POST',
      data
    );
    console.log('taaaaaa', repResponse);
    if (repResponse?.status === 'success') {
      const repData = repResponse?.value?.userData?.map((x) => {
        return {
          image: (
            <UserProfilePictureicon
              firstLetter={`${toTitleCase(x.first_name)} ${toTitleCase(
                x.last_name
              )}`
                .toString()
                .charAt(0)
                .toUpperCase()}
            />
          ),
          id: x.id,
          emailid: x.email,
          fullname: `${toTitleCase(x.first_name)} ${toTitleCase(
            x.last_name ?? ' '
          )}`,
        };
      });
      console.log('dddddddddddd', repData);
      setUsers(repData);
    } else {
      toast.error(repResponse?.message.message);
    }
  };

  const userType = [
    { value: 'All', label: 'All' },
    { value: 'Published', label: 'Published' },
    { value: 'Pending Approval', label: 'Pending Approval' },
    { value: 'In draft', label: 'In draft' },
  ];
  const continuee = () => {
    props.nextStep();
  };
  const back = () => {
    props.prevStep();
  };

  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    DropdownIndicator,
    ...rest
  }) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);

    // // styles
    let bg = 'transparent';
    if (isFocused) bg = '#eee';
    if (isActive) bg = '#B2D4FF';
    // if (isInactive) bg = '';

    const style = {
      alignItems: 'center',
      backgroundColor: bg,
      color: 'inherit',
      display: 'flex ',
    };

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style,
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        {/* <input type="checkbox" checked={isSelected} id="checkbox" />
        &nbsp;
        {children} */}
      </components.Option>
    );
  };

  const columns = [
    {
      name: '',
      selector: (row) =>
        row.ProfilePicture ? (
          <img
            width={35}
            height={35}
            style={{
              borderRadius: '8px',
              fontWeight: '300',
            }}
            src={row.ProfilePicture}
            alt="MDN logo"
          />
        ) : (
          row.image
        ),
      width: '5rem',
    },
    {
      name: 'Full Name',
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: 'Email ID',
      selector: (row) => row.emailid,
      sortable: true,
    },
  ];

  useEffect(() => {
    console.log("clearData::", clearData);
  }, [clearData]);

  const handleRowSelected = React.useCallback((state) => {
      console.log("ggggggg",props, clearData);
      if (clearData) {
        console.log("clearrrrrrrrrrrrrrrr");
        console.log('selectedrowsclear', state);
        const usersIsArray = Array.isArray(methods.getValues('initial_selected_users'));
        const usersarray = usersIsArray ? methods.getValues('initial_selected_users') : []
        let nextUser = state.selectedRows.filter((obj) => !usersarray.includes(obj.id)).map((x) => {
          return {
            id: x.id,
            emailid: x.emailid,
            fullname: x.fullname,
          };
        });
        console.log('fffffffffclear', nextUser);
        let ids = nextUser.map((e) => e.id);
        fixinitialusers(ids, nextUser);
        // methods.setValue('initial_selected_users', ids);
        // methods.setValue('initial_selected_userObjects', nextUser);
        // console.log('clearrrrr', methods.getValues());
      }
      else {
        console.log('selectedrowsone', state);
        let ids = state.selectedRows.map((e) => e.id);
        setSelectedRows(ids);
        // methods.setValue('initial_selected_users', ids);
        let nextUser = state.selectedRows.map((x) => {
          console.log('fffffffff+wwwwwwwww', state.selectedRows);
          return {
            id: x.id,
            emailid: x.emailid,
            fullname: x.fullname,
          };
        });
        fixinitialusers(ids, nextUser);
        // methods.setValue('initial_selected_userObjects', nextUser);
        // console.log('qaqaaaa', methods.getValues());
      }
      // if (ids && ids.length) {
      //   handleIds(ids)
      // }
      // if (state.selectedCount) {
      //   setIsRowSelected(true);
      // } else {
      //   setIsRowSelected(false);
      // }
      // setSelectedRows(state.selectedRows.map((e) => e.id));
      // if (props?.selectuser==true) {
      //   console.log("qqqqqqq----", props);
      //   // usercontexttwo?.handle(state.selectedRows.map((e) => e.id));
      //   props?.handlerfunc(state.selectedRows.map((e) => e.id))
      // }
      // else {

      // myRef.current = nextUser;
      // if (props?.handle) {
      //   props?.handle(ids, myRef.current );
      // }
      // if (props?.second) {
      //   props?.second(selectedRows)
      // }
      // }
    }
    , [props]);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <Box className="d-flex">
        <SearchBar
          onChange={(e) => setFilterText(e.target.value)}
          // onClear={handleClear}
          filterText={filterText}
          value={filterText}
          defaultValue={filterText}
        />
        &nbsp;
        {/* <Box>
          <Select
            hideSelectedOptions={false}
            options={userType}
            closeMenuOnSelect={true}
            isClearable={false}
            value={status}
            placeholder="sort by"
            className='batchselect'
          // onChange={(options) => {
          //   setStatus(options);
          // }}
          // components={{
          //   Option: InputOption,
          //   // DropdownIndicator,
          // }}
          />
        </Box> */}
      </Box>
    );
  }, [filterText]);

  // const handleClearRows = () => {
  //   console.log("in handle clear");
  //   // setSelectedRows([]);
  //   // setToggleClearRows(true);
  // }
  const rowSelectCritera = (row) => {
    if (userarray?.includes(row.emailid)) {
      return row;
    }
  };

  return (
    <>
      <DataTableComponent
        ecomponent
        columns={columns}
        data={users}
        selectableRows={true}
        subHeaderComponent={subHeaderComponentMemo}
        subHeader
        subHeaderAlign="right"
        subHeaderWrap
        sortIcon={<SortingIcon />}
        // selectableRowSelected={userarray ? rowSelectCritera : null}
        // handle={props.handle}
        handleRowSelected={handleRowSelected}
        selectedRows
      // clearSelectedRows={toggledClearRows}
      // selectuser={props.selectuser??null}
      // handlerfunc={props.handlerfunc ??null}
      />
      <Row>
        <Col className="d-flex justify-content-end g-2 mt-5">
          {/* 
          <ButtonComponent
            type="button"
            variant="outline-primary"
            size="md"
            className="managetopicbutton"
            title="Previous"
            onClick={() => {
              back();
            }}
          />{" "}


          <ButtonComponent
            type="button"
            variant="primary"
            size="md"
            className="managetopicbutton"
            title="Next"
            onClick={() => {
              continuee();
            }}
          /> */}
        </Col>
      </Row>
    </>
  );
}
export default BatchUsers;

