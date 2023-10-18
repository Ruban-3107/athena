import './ManageUsers.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  useAuth,
  useRouter,
  apiRequest,
  userStatusType,
  userRegistrationType,
  useLocation,
  PaginationLocale
} from '@athena/web-shared/utils';
import { Tab, Tabs, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import {
  Modals,
  UserProfileOffcanvas,
  SearchBar,
  ButtonComponent,
  Loader,
  Box,
  Span,
  DataTableComponent,
  PrevIcon,
  SortingIcon,
  EditIcon,
  DeleteIcon,
  FilterIcon,
  LearnerRoleIcon,
  TrainingFacilitatorRoleIcon,
  ClientRepresentativeRoleIcon,
  TrainerRoleIcon,
  JobArchitectRoleIcon,
  AdminRoleIcon,
  SuperAdminRoleIcon,
  UserProfilePictureicon,
  NumberIcon,
  NextIcon,
} from '@athena/web-shared/ui';
import Pagination from 'rc-pagination';
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
      <input type="checkbox" checked={isSelected} id="checkbox" />
      &nbsp;
      {children}
    </components.Option>
  );
};
// const PaginationChange = (page, pageSize) => {
//   setCurrent(page);
//   // setSize(pageSize);
// };

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <FilterIcon />
    </components.DropdownIndicator>
  );
};
export const ManageUsers = (props) => {
  const router = useRouter();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idValue = queryParams.get('id');
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [userProfileShow, setUserProfileShow] = useState(false);
  const [size, setSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearDataRows, setToggleClearDataRows] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [fileteredUserData, setFilteredUserData] = useState([]);
  const [key, setKey] = useState(idValue ? idValue : 'Individual');
  const [registrationType, setRegistrationType] = useState('all');
  const [userType, setUserType] = useState(idValue ? idValue : 'Individual');
  const [nameSort, setNameSort] = useState('ASC');
  const [emailSort, setEmailSort] = useState('');
  const [status, setStatus] = useState('all');
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState([]);
  const [isIndRolesMenuOpen, setIsIndRolesMenuOpen] = useState(false);
  const [isCorRolesMenuOpen, setIsCorRolesMenuOpen] = useState(false);
  const [isCorGroupMenuOpen, setIsCorGroupMenuOpen] = useState(false);
  const filterOptionsRef = useRef(null);
  // const corporateFilterOptionsRef = useRef(null);
  const column2OptionsRef = useRef(null);
  const column3OptionsRef = useRef(null);
  const [disable, setDisable] = useState('');
  const [identifiedRole, setIdentifiedRole] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(true);
  const [totalButton, setTotalButton] = useState([]);
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(false);
  const [selectedInactiveStatus, setSelectedInactiveStatus] = useState(false);
  const [selectedActiveStatus, setSelectedActiveStatus] = useState(false);
  const [pending, setPending] = useState(true);
  const auth = useAuth();
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [gotoPage, setGotoPage] = useState('');

  useEffect(() => {
    if (auth?.user?.role?.[0]?.['name'] === 'Client Representative') {
      setIdentifiedRole(true);
    }
  }, [auth?.user]);
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
  console.log('authauthauthauthauthauth', auth);

  useEffect(() => {
    console.log('statusstatusstatus::', status);
    getUsers();
  }, [
    userType,
    registrationType,
    nameSort,
    emailSort,
    filterText,
    status,
    selectedClients,
    selectedRoles,
    current,
    size,
  ]);

  useEffect(() => {
    // Add event listener to detect clicks outside the filter options
    const handleClickOutside = (event) => {
      if (
        filterOptionsRef.current &&
        !filterOptionsRef.current.contains(event.target)
      ) {
        setIsIndRolesMenuOpen(false);
      }
      if (
        column2OptionsRef.current &&
        !column2OptionsRef.current.contains(event.target)
      ) {
        setIsCorGroupMenuOpen(false);
      }
      if (
        column3OptionsRef.current &&
        !column3OptionsRef.current.contains(event.target)
      ) {
        setIsCorRolesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOptionsRef, column2OptionsRef, column3OptionsRef]);

  const getClients = async () => {
    const clinetsresponse = await apiRequest('api/users/clients/getAllClients');
    console.log('////clinetsresponse//////', clinetsresponse);
    if (clinetsresponse?.status === 'success') {
      let clientresponse1 = clinetsresponse.value.map((x) => {
        return {
          value: x.id,
          label: x.corporate_group,
        };
      });
      setClients(clientresponse1);
    } else {
      toast.error(clinetsresponse?.message?.message);
    }
  };

  const getRoles = async () => {
    const rolesresponse = await apiRequest('api/users/roles/getRoles');
    if (rolesresponse?.status === 'success') {
      // let rolesresponse1 = rolesresponse.value.roleData.map((x) => {
      //let rolesData=rolesresponse?.value?.filter((x)=>x.name !=="test"));
      let rolesresponse1 = rolesresponse?.value?.map((x) => {
        return {
          value: x.id,
          label: x.name,
        };
      });

      console.log('////roles//////', rolesresponse1);

      setRoles(rolesresponse1?.filter((x) => x.label !== 'test'));
      //setAllRoles(rolesresponse.value ? JSON.parse(JSON.stringify(rolesresponse.value?.filter((x) => x.name !== "test"))) : []);
    } else {
      setRoles([]);
      //   toast.error(rolesresponse?.message?.message);
    }
  };
  console.log(roles, 'rolee');
  useEffect(() => {
    console.log('dddddddddddddd');
    getClients();
    getRoles();
  }, []);

  const getUsers = async () => {
    let data = {};
    if (registrationType) {
      data['registrationType'] =
        registrationType === 'all' ? 'all' : registrationType;
    }
    if (userType) {
      data['type'] = userType;
    }
    if (nameSort) {
      data['nameFilter'] = nameSort;
    }
    if (emailSort) {
      data['emailFilter'] = emailSort;
    }
    if (filterText) {
      data['searchKey'] = filterText;
    }
    if (selectedClients) {
      data['clients'] =
        selectedClients.length == 0
          ? 'all'
          : selectedClients.map((opt) => opt.value);
    }
    if (selectedRoles) {
      data['roles'] =
        selectedRoles.length == 0
          ? 'all'
          : selectedRoles.map((opt) => opt.value);
    }

    data['status'] = status === 'all' ? 'all' : status;
    data['pageNo'] = (selectedRoles.length>0 || registrationType !='all' || status != 'all') ?1:current;
      // filterText || selectedRoles.length !== 0 || status !== 'all'
      //   ? 1
      //   : current;
    data['size'] = size;

    console.log('data::', data);
    const userresponse = await apiRequest('api/users/getUsers', 'POST', data);
    console.log('userresponse', userresponse);
    if (userresponse?.status === 'success') {
      // if(userresponse?.value?.userData?.currentPage > userresponse?.value?.userData?.totalPages){
      //   setCurrent(userresponse?.value?.userData?.totalPages);
      // }
      const userData1 = userresponse?.value?.userData?.rows.map((x) => {
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
          fullname: `${toTitleCase(x.first_name)} ${toTitleCase(x.last_name)}`,
          emailId: x.email,
          registrationType: x.registration_type ?? 'Platform Registered',
          roles:
            x?.userRoles?.length > 0
              ? x?.userRoles?.map((x) => x.name?.toLowerCase())
              : ['learner'],
          status: x.is_active,
          ProfilePicture: x.ProfilePicture,
          client: x?.client?.corporate_group ?? 'Unassigned',
          handle: x.handle,
        };
      });
      console.log(userData1, '/////////////');
      setTotalItems(userresponse.value?.userData?.totalItems);
      setUsersData(userData1);
      setFilteredUserData(userData1);
      setPending(false);
      // setSize(userresponse.value?.userData?.totalItemsPerPage)
    } else {
      toast.error(userresponse?.message?.message);
      setPending(false);
    }
  };

  const caseInsensitiveNameSort = () => {
    if (nameSort == 'ASC') {
      setNameSort('DESC');
      setEmailSort('');
    } else {
      setNameSort('ASC');
      setEmailSort('');
    }
  };

  const caseInsensitiveEmailSort = () => {
    if (emailSort == 'ASC') {
      setEmailSort('DESC');
      setNameSort('');
    } else {
      setEmailSort('ASC');
      setNameSort('');
    }
  };

  const toTitleCase = (str) => {
    return str?.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
      height: '200px',
    },
    {
      name: 'Full Name',
      selector: (row) => row.fullname,
      sortable: true,
      // sortFunction: caseInsensitiveNameSort,
    },
    {
      name: 'Email ID',
      selector: (row) => row.emailId,
      sortable: true,
      sortFunction: caseInsensitiveEmailSort,
    },
    {
      name: (
        // menuPortalTarget={document.body}
        <>
          Registration Type
          <Dropdown drop="" className="register-txt">
            <Dropdown.Toggle variant="white">
              {' '}
              <FilterIcon />
            </Dropdown.Toggle>
            {showFilterOptions && (
              <Dropdown.Menu>
                <Dropdown.Item
                  href=""
                  onClick={() => {
                    setRegistrationType('all');
                  }}
                >
                  All
                </Dropdown.Item>
                {userRegistrationType.map((userRegistrationType, index) => (
                  <React.Fragment key={index}>
                    <Dropdown.Item
                      href=""
                      onClick={() => {
                        setRegistrationType(userRegistrationType.id);
                      }}
                      className={
                        registrationType === userRegistrationType.id
                          ? 'selected'
                          : ''
                      }
                    >
                      {' '}
                      {userRegistrationType.name}
                    </Dropdown.Item>
                  </React.Fragment>
                ))}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </>
      ),
      id: 'registrationType',
      selector: (row) => row.registrationType,
    },
    {
      name: (
        <>
          Roles
          <div ref={filterOptionsRef}>
            {console.log(roles, '::::::::::::::::')}
            <Select
              isMulti
              hideSelectedOptions={false}
              options={roles}
              menuPortalTarget={document.body}
              onMenuOpen={() => {
                setIsIndRolesMenuOpen(true);
              }}
              onMenuClose={() => {
                setIsIndRolesMenuOpen(false);
              }}
              closeMenuOnSelect={true}
              menuIsOpen={isIndRolesMenuOpen}
              isClearable={false}
              value={selectedRoles}
              onChange={(options) => {
                setSelectedRoles(options);
                setShowFilterOptions(true);
              }}
              components={{
                Option: InputOption,
                DropdownIndicator,
              }}
              styles={{
                menuPortal: (styles) => ({
                  ...styles,
                  zIndex: 100,
                  width: 250,
                  top: 165,
                }),
                valueContainer: (styles) => ({ display: 'none' }),
                indicatorSeparator: (styles) => ({ display: 'none' }),
                control: (styles) => ({ ...styles, border: 'none' }),
              }}
            />
          </div>
        </>
      ),

      selector: (row) => (
        console.log('row::', row),
        (
          <>
            {console.log(row.roles, 'rolesssssssssssss')}
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
            {console.log(row.roles, 'rolessss:::::::ssssssss')}
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
    },
    {
      name: (
        <>
          Status
          <Dropdown drop="">
            <Dropdown.Toggle variant="white">
              <FilterIcon />
            </Dropdown.Toggle>
            {showFilterOptions && (
              <Dropdown.Menu>
                <Dropdown.Item
                  href=""
                  onClick={() => {
                    setStatus('all');
                  }}
                >
                  All
                </Dropdown.Item>
                {userStatusType.map(
                  (userStatusType, index) =>
                    userStatusType?.name !== 'Pending Approval' && (
                      <React.Fragment key={index}>
                        <Dropdown.Item
                          href=""
                          onClick={() => {
                            setStatus(userStatusType.id);
                          }}
                          className={
                            status === userStatusType.id ? 'selected' : ''
                          }
                        >
                          {' '}
                          {userStatusType.name}
                        </Dropdown.Item>
                      </React.Fragment>
                    )
                )}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </>
      ),
      selector: (row) => (
        <>
          {' '}
          {row.status === 'active' && (
            <p
              className="status-txt"
              style={{ color: '#3CC13B', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'in active' && (
            <p
              className="status-txt"
              style={{ color: '#F03738', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'pending approval' && (
            <p
              className="status-txt"
              style={{ color: 'blue', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
        </>
      ),
      // sortable: true,
      width: '9rem',
    },
    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          <span
            className="btn "
            onClick={() => {
              router.navigate(`/app/adduser/?id=${row.handle}`);
              // setEditUser(true)
              // setUser(row);
              // router.navigate(`/app/adduser`);
            }}
          >
            <EditIcon />
          </span>
          <span
            onClick={() => {
              setModalShow(true);
              setUser([row]);
            }}
            className="btn p-2 ms-1"
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '8rem',
    },
  ];
  /* corporate columns */

  const corporateColumns = [
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
      sortFunction: caseInsensitiveNameSort,
    },
    {
      name: 'Email ID',
      selector: (row) => row.emailId,
      sortable: true,
      sortFunction: caseInsensitiveEmailSort,
    },
    {
      name: (
        <>
          Corporate Group
          <div ref={column2OptionsRef}>
            <Select
              // ref={column2OptionsRef}
              className="corporate-group"
              isMulti
              hideSelectedOptions={false}
              options={clients}
              menuPortalTarget={document.body}
              closeMenuOnSelect={true}
              isClearable={false}
              menuIsOpen={isCorGroupMenuOpen}
              onMenuOpen={() => {
                setIsCorGroupMenuOpen(true);
              }}
              onMenuClose={() => {
                setIsCorGroupMenuOpen(false);
              }}
              value={selectedClients}
              onChange={(options) => {
                setSelectedClients(options);
              }}
              components={{
                Option: InputOption,
                DropdownIndicator,
              }}
              styles={{
                menuPortal: (styles) => ({
                  ...styles,
                  zIndex: 100,
                  width: 250,
                  top: 165,
                }),
                valueContainer: (styles) => ({ display: 'none' }),
                indicatorSeparator: (styles) => ({ display: 'none' }),
                control: (styles) => ({ ...styles, border: 'none' }),
                //  >= dialog's z-index
              }}
            />
          </div>
        </>
      ),
      selector: (row) => row.client,
      omit: identifiedRole,
    },
    {
      name: (
        <>
          Roles
          <div ref={column3OptionsRef}>
            <Select
              isMulti
              hideSelectedOptions={false}
              options={roles}
              menuPortalTarget={document.body}
              closeMenuOnSelect={true}
              isClearable={false}
              menuIsOpen={isCorRolesMenuOpen}
              onMenuOpen={() => {
                setIsCorRolesMenuOpen(true);
              }}
              onMenuClose={() => {
                setIsCorRolesMenuOpen(false);
              }}
              value={selectedRoles}
              onChange={(options) => {
                setSelectedRoles(options);
              }}
              components={{
                Option: InputOption,
                DropdownIndicator,
              }}
              styles={{
                menuPortal: (styles) => ({
                  ...styles,
                  zIndex: 100,
                  width: 250,
                  top: 165,
                }),
                valueContainer: (styles) => ({ display: 'none' }),
                indicatorSeparator: (styles) => ({ display: 'none' }), //  >= dialog's z-index
                control: (styles) => ({ ...styles, border: 'none' }),
              }}
            />
          </div>
        </>
      ),

      // name: <>Roles<FilterIcon /></>,
      // name:'Roles',
      selector: (row) => (
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
      ),
      filteredItems: true,
    },
    {
      name: (
        <>
          Status
          <Dropdown drop="">
            <Dropdown.Toggle variant="white">
              <FilterIcon />
            </Dropdown.Toggle>
            {showFilterOptions && (
              <Dropdown.Menu>
                <Dropdown.Item
                  href=""
                  onClick={() => {
                    setStatus('all');
                  }}
                >
                  All
                </Dropdown.Item>
                {userStatusType.map((userStatusType, index) => (
                  <React.Fragment key={index}>
                    <Dropdown.Item
                      href=""
                      onClick={() => {
                        setStatus(userStatusType.id);
                      }}
                      className={status === userStatusType.id ? 'selected' : ''}
                    >
                      {' '}
                      {userStatusType.name}
                    </Dropdown.Item>
                  </React.Fragment>
                ))}
                {/* <Dropdown.Item
                href=""
                onClick={() => {
                  setStatus(true);
                }}
              >
                <i className="mr-1">
                  <AdminRoleIcon />
                </i>
              </OverlayTrigger>
            )}
            {row.roles.includes('trainer') && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip('Trainer')}
              >
                Inactive
              </Dropdown.Item> */}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </>
      ),
      selector: (row) => (
        <>
          {' '}
          {row.status === 'active' && (
            <p
              className="status-txt"
              style={{ color: '#3CC13B', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'in active' && (
            <p
              className="status-txt"
              style={{ color: '#F03738', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
          {row.status === 'pending approval' && (
            <p
              className="status-txt"
              style={{ color: 'blue', fontWeight: 600 }}
            >
              {toTitleCase(row.status)}
            </p>
          )}
        </>
      ),
      // sortable: true,
      width: '9rem',
    },
    {
      name: 'Action',
      id: 'action-name',
      selector: (row) => (
        <div className="d-flex justify-content-between">
          {identifiedRole ? (
            ''
          ) : (
            <span
              className="btn "
              onClick={() => {
                setUser(row);
                router.navigate(`/app/adduser/?id=${row.handle}`);
              }}
            >
              <EditIcon />
            </span>
          )}
          <span
            onClick={() => {
              setModalShow(true);
              setUser([row]);
            }}
            className={identifiedRole ? 'btn p-2 ms-4' : 'btn p-2 ms-1'}
          >
            <DeleteIcon />
          </span>
        </div>
      ),
      width: '7rem',
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.roles,
      style: {
        display: 'flex',
        alignItems: 'center',

        justifyContent: 'flex-start',
      },
    },
  ];

  const filteredItems = usersData
    ?.filter(
      (item) =>
        item.fullname &&
        item.fullname.toLowerCase().includes(filterText.toLowerCase())
    )
    .slice((current - 1) * 10, current * 15);

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
  console.log("filterText", filterText);

  const handleRowClicked = (row) => {
    identifiedRole ? '' : setUserProfileShow(true);
    setUser(row);
  };
  useEffect(() => {
    if (modalShow) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'visible';
  }, [modalShow]);

  const renderTooltip = (name) => (
    <Tooltip id="datatable-tooltip">{name}</Tooltip>
  );
  const handleRowSelected = React.useCallback((state) => {
    if (state.selectedCount) {
      setIsRowSelected(true);
    } else {
      setIsRowSelected(false);
    }
    const rowStatus = state.selectedRows.map((x) => x.status);
    let bool = rowStatus.every((val, i, arr) => val === 'pending approval');
    let bool1 = rowStatus.every((val, i, arr) => val === 'in active');
    let bool2 = rowStatus.every((val, i, arr) => val === 'active');
    setSelectedApprovalStatus(bool);
    setSelectedInactiveStatus(bool1);
    setSelectedActiveStatus(bool2);
    console.log('rowStatus', rowStatus);
    setTotalButton(rowStatus);
    setSelectedRows(state.selectedRows.map((e) => e));
    console.log(selectedRows, 'selectedrows');
  }, []);

  const handleClearRows = () => {
    setToggleClearDataRows(!toggledClearDataRows);
  };

  const PaginationChange = (page, pageSize) => {
    console.log(page, "ppppppppppppppppppppppp");
    <Box style={{ color: 'green' }}>{setCurrent(page)}</Box>;
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
    // if (current > totalItems / size) {
    //   return <Pagination.Item disabled>{current}</Pagination.Item>;
    // }
    return originalElement;
  };

  // function onShowSizeChange(current, pageSize) {
  //   console.log(current);
  //   console.log(pageSize);
  // }
  // useEffect(() => {
  //   console.log('statusstatusstatus::', status);
  //   setCurrent(1);
  // }, [filterText]);

  const pagesizeoptionss = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const handlepagesize = (pageSize) => {
    console.log('////////size///////////', pageSize);

    setSize(pageSize?.value);
  };
  console.log(current,"eeeeee.......eeeeeeeeeee");
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
              minWidth: '5rem!important',
              width: '4.1rem!important',
            }),
          }}
        />
      </Box>
    );
  };

  const CustomPagination = () => {
    // const totalPages = Math.ceil(totalItems / size);
    // const PaginationChange = (page, size) => {
    //   setCurrent(page);
    // };

    // const handleQuickJumperChange = (page) => {
    //   if (page > totalPages) {
    //     return;
    //   }
    //   setCurrent(page);
    // };

    return (
      <Box className="pagination-css">
        <Pagination
          showTotal={(total, range) => `${range[0]>total?1:range[0]} to ${range[1]} of ${total}`}
          onChange={PaginationChange}
          total={totalItems}
          current={current}
          pageSize={size}
          showSizeChanger={true}
          //onShowSizeChange={PerPageChange}
          itemRender={PrevNextArrow}
          showQuickJumper={{
            goButton: (
              <button
                type="submit"
                // disabled={current > totalPages}
                onClick={handleGotoPage}
              >
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
      </Box>
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
          {isRowSelected && selectedActiveStatus ? (
            <Box className="buttons-align mt-0">
              <ButtonComponent
                onClick={() => {
                  setModalShow(true);
                  handleClearRows([]);
                }}
                type="button"
                variant="outline-primary"
                size="lg"
                className="me-3 addUser-btn rounded-4 px-4"
                name="Delete&nbsp;"
              />
              <ButtonComponent
                onClick={() => {
                  setModalShow(true);
                  handleClearRows();
                  setDisable('Disable');
                }}
                type="button"
                variant="primary"
                size="lg"
                className="addUser-btn disable-btn rounded-4 px-4 text-center style={{ fone-size: 'small' }}"
                name="Disable"
              />
            </Box>
          ) : isRowSelected && selectedInactiveStatus ? (
            <>
              {identifiedRole ? (
                <Box className="buttons-align mt-0">
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows([]);
                    }}
                    type="button"
                    variant="outline-primary"
                    size="lg"
                    className="me-3 addUser-btn rounded-4 px-4"
                    name="Delete&nbsp;"
                  />
                </Box>
              ) : (
                <Box className="buttons-align mt-0">
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows([]);
                    }}
                    type="button"
                    variant="outline-primary"
                    size="lg"
                    className="me-3 addUser-btn rounded-4 px-4"
                    name="Delete&nbsp;"
                  />
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows();
                      setDisable('Enable');
                    }}
                    type="button"
                    variant="primary"
                    size="lg"
                    className="addUser-btn disable-btn rounded-4 px-4 text-center style={{ fone-size: 'small' }}"
                    name="Enable"
                  />
                </Box>
              )}
            </>
          ) : isRowSelected && selectedApprovalStatus ? (
            <>
              {identifiedRole ? (
                <Box className="buttons-align mt-0">
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows([]);
                    }}
                    type="button"
                    variant="outline-primary"
                    size="lg"
                    className="me-3 addUser-btn rounded-4 px-4"
                    name="Delete&nbsp;"
                  />
                </Box>
              ) : (
                <Box className="buttons-align mt-0">
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows([]);
                      setDisable('Disable');
                    }}
                    type="button"
                    variant="outline-primary"
                    size="lg"
                    className="me-3 addUser-btn rounded-4 px-4"
                    name="Reject&nbsp;"
                  />
                  <ButtonComponent
                    onClick={() => {
                      setModalShow(true);
                      handleClearRows();
                      setDisable('Approve');
                    }}
                    type="button"
                    variant="primary"
                    size="lg"
                    className="addUser-btn disable-btn rounded-4 px-4 text-center style={{ fone-size: 'small' }}"
                    name="Approve"
                  />
                </Box>
              )}
            </>
          ) : isRowSelected &&
            totalButton.includes('in active', 'active', 'pending approval') ? (
            <Box className="buttons-align mt-0">
              <ButtonComponent
                onClick={() => {
                  setModalShow(true);
                  handleClearRows([]);
                }}
                type="button"
                variant="outline-primary"
                size="lg"
                className="me-3 addUser-btn rounded-4 px-4"
                name="Delete&nbsp;"
              />
            </Box>
          ) : null}
          <Box className="tab-search me-3 mt-2">{subHeaderComponentMemo}</Box>
          <Modals
            delete={user === null ? [] : user}
            multidelete={selectedRows}
            type={disable}
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              getUsers();
              setUser(null);
              setDisable('');
              setSelectedRows([]);
              setIsRowSelected(false);
            }}
          />
          <UserProfileOffcanvas
            placement={'end'}
            show={userProfileShow}
            userData={user}
            getuser={() => getUsers()}
            onHide={() => setUserProfileShow(false)}
          />
          <Tabs
            // defaultActiveKey="Individual"
            id="uncontrolled-tab-example"
            className="users-tab mt-1"
            activeKey={identifiedRole ? 'Corporate' : key}
            onSelect={(k) => {
              setToggleClearDataRows(!toggledClearDataRows);
              setIsCorGroupMenuOpen(false);
              setIsCorRolesMenuOpen(false);
              setIsIndRolesMenuOpen(false);
              setIsRowSelected(null);
              setPending(true);
              if (k !== userType) {
                setUsersData([]);
                setRegistrationType('all');
                setNameSort('DESC');
                setEmailSort('');
                setStatus('all');
                setSelectedClients([]);
                setSelectedRoles([]);
                setSize(10);
              }
              setKey(k);
              setUserType(k);
              if (k !== key) {
                PaginationChange(1);
              }
              setFilterText('');
              // getUsers({ userType: k });
            }}
          >
            {identifiedRole ? null : (
              <Tab
                eventKey="Individual"
                title="Individual"
                className="indiidual-tab"
              >
                <DataTableComponent
                  className="dataTable-content"
                  // title="Learners"
                  columns={columns}
                  data={usersData}
                  direction="auto"
                  // fixedHeaderScrollHeight="900px"
                  pagination
                  //paginationComponentOptions={paginationComponentOptions}
                  paginationComponent={CustomPagination}
                  paginationPerPage={
                    pagesizeoptionss[pagesizeoptionss.length - 1].value
                  }
                  paginationResetDefaultPage={resetPaginationToggle}
                  responsive
                  selectableRows
                  noDataComponent={<CustomNoData title={'individual'} />}
                  // selectableRowsComponent={showButton}
                  selectableRowsHighlight
                  onSelectedRowsChange={handleRowSelected}
                  clearSelectedRows={toggledClearDataRows}
                  // subHeader
                  conditionalRowStyles={conditionalRowStyles}
                  subHeaderComponent={subHeaderComponentMemo}
                  onRowClicked={handleRowClicked}
                  highlightOnHover
                  sortIcon={<SortingIcon />}
                  persistTableHead
                />
              </Tab>
            )}
            <Tab
              eventKey="Corporate"
              title="Corporate"
              className="corporate-tab"
            >
              <DataTableComponent
                className="dataTable-content"
                // title="Learners"
                columns={corporateColumns}
                data={usersData}
                // progressComponent={<CustomLoader />}
                direction="auto"
                fixedHeaderScrollHeight="300px"
                pagination
                paginationComponent={CustomPagination}
                paginationPerPage={
                  pagesizeoptionss[pagesizeoptionss.length - 1].value
                }
                paginationResetDefaultPage={resetPaginationToggle}
                responsive
                selectableRows
                noDataComponent={<CustomNoData title={'corporate'} />}
                selectableRowsHighlight
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggledClearDataRows}
                // subHeader
                conditionalRowStyles={conditionalRowStyles}
                subHeaderComponent={subHeaderComponentMemo}
                onRowClicked={handleRowClicked}
                highlightOnHover
                sortIcon={<SortingIcon />}
                persistTableHead
              />
            </Tab>
          </Tabs>
        </>
      )}
    </>
  );
};
export default ManageUsers;
const CustomNoData = (props) => {
  return (
    <Box style={{ textAlign: 'center' }} className="mt-5">
      <img
        src="assets/images/nodataimage.png"
        width={'50%'}
        height={'50%'}
        alt="Nodata"
      />
      <h5 className="mb-3 mt-4 h5">No Users to show</h5>
      <p className="fs-6 mb-3 text-secondary">
        Users added to {props.title} groups will be listed here.
      </p>
      {/* <a href="/app/adduser" className="text-decoration-underline">Add users</a> */}
    </Box>
  );
};
