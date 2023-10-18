import './BatchUsersNew.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  DataTableComponentTwo,
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

export const BatchUsersNew = (props) => {
  const { clientId, data: dataa, clearsearch, clearData } = props;
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [status, setStatus] = useState();
  const [users, setUsers] = useState([]);
  const [userarray, setUserArray] = useState([]);
  const [finaluserData, setFinalUserData] = useState([]);
  const [finaluserDataTwo, setFinalUserDataTwo] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  // const [filterData, setFilterData] = useState([])

  // const [loading, setLoading] = useState(false);

  const methods = useFormContext();

  useEffect(() => {
    if (clientId) {
      getUsers(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    console.log('zzzzzzzzzz', userarray);
  }, [userarray]);

  useEffect(() => {
    setFilterText('');
  }, [clearsearch]);

  useEffect(() => {
    console.log("clearddddddddd", clearData);
    handleClearRows();
  }, [clearData])

  useEffect(() => {
    console.log("fina;ldattata", finaluserData);
  }, [finaluserData])
  
  useEffect(() => {
    console.log('dataa:', dataa);
    setFinalUserData(JSON.parse(JSON.stringify(dataa)));
    setFinalUserDataTwo(JSON.parse(JSON.stringify(dataa)));
    setUserArray(JSON.parse(JSON.stringify(dataa))?.map((x) => x.emailid));

    // let ids = JSON.parse(JSON.stringify(dataa))?.map((e) => e.id)
    // console.log("idddd", ids, finaluserData.length);
    // setFilterData(ids);
    // methods?.setValue("final_users", ids);
  }, [dataa]);

  const getUsers = async (id) => {
    console.log('zzzzzzzzz', id);
    const repResponse = await apiRequest(`api/users/client/${id}`, 'GET');
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
          fullname: x.first_name,
        };
      });
      console.log('dddddddddddd', repData);
      setUsers(repData);
    } else {
      toast.error(repResponse?.message.message);
    }
  };

  const filter = (e) => {
    const keyword = e;
    console.log('dddddddddd', keyword.length, keyword !== '', keyword);
    if (keyword.length > 0) {
      console.log('ttttttttttt', finaluserData, finaluserDataTwo);
      const results = finaluserDataTwo?.filter((element) => {
        return (
          element.fullname?.toLowerCase()?.includes(keyword.toLowerCase()) ||
          element.emailid?.toLowerCase()?.includes(keyword.toLowerCase())
        );
      });
      console.log('ressssssssssssssss', results,methods?.getValues());
      // setFilterData([...results])
      setFinalUserData([...results]);
      console.log("rrrrrrrrrrrrr", methods?.getValues());
    } else {
      console.log('OIIIIIIIIIIIIIIIIIIII', finaluserData, finaluserDataTwo);
      setFinalUserData([...finaluserDataTwo]);
      // setFilterData([]);
    }
  };

  useEffect(() => {
    console.log('fffffff', filterText.length);
    filter(filterText);
  }, [filterText]);

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
            style={{ borderRadius: '8px' }}
            src={row.ProfilePicture}
            alt="MDN logo"
          />
        ) : (
          <UserProfilePictureicon
            firstLetter={row?.fullname.toString().charAt(0).toUpperCase()}
          />
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
          // onChange={filter}
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

  const rowSelectCritera = (row) => {
    if (userarray?.includes(row.emailid)) {
      return row;
    }
  };

  const handleClearRows = () => {
    console.log("in handle clear");
    setToggleClearRows(true);
  }

  const handleUpdateUser = (value) => {
    props.updatedUser(value);
  };

  return (
    <>
      {/* {!loading ? ( */}
      <DataTableComponentTwo
        ecomponent
        columns={columns}
        // data={(filterText !== '' ? filterData : finaluserData) ?? []}
        data={finaluserData}
        selectableRows={true}
        // clearSelectedRows={toggledClearRows}
        subHeaderComponent={subHeaderComponentMemo}
        subHeader
        subHeaderAlign="right"
        subHeaderWrap
        sortIcon={<SortingIcon />}
        selectableRowSelected={userarray ? rowSelectCritera : null}
        methods={methods}
        // finaluser={filterData}
      // handle={props.handle ?? false}
      // second={props.second}
      // updatedUser={props.updatedUser}
      // compname={props.compname}
      // updatedSelecedUser={handleUpdateUser}        // selectuser={props.selectuser??null}
      // handlerfunc={props.handlerfunc ??null}
      />
      {/* ) : <p>loading</p>} */}
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
export default BatchUsersNew;

