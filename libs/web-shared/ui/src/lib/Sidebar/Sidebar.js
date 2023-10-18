
import './Sidebar.css';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import { useState } from 'react';
import {
  Box,
  Span,
  DashboardIcon,
  SettingSideBarIcon,
  ReportSideBarIcon,
  SideBarRoleIcon,
  PeopleIcon,
  DotIcon,
  BatchIcon,
  TopicIcon,
  CourseIcon,
  ChapterIcon,
  CorporateGroupIcon,
  OpenAiIcon,
  DatePickerIcon,
  CupIcon,
  DownArrowlight,
  ConfigureIcon,
} from '@athena/web-shared/ui';
import { useAuth } from '@athena/web-shared/utils';

export const Sidebar = () => {
  const items = [
    {
      id: 1,
      heading: '',
      menus: [
        {
          id: 1,
          title: 'Dashboard',
          icon: <DashboardIcon />,
          to: '/app/dashboard',
        },
        {
          id: 2,
          title: 'Users',
          icon: <PeopleIcon />,
          subtitle: [
            {
              title: 'Manage Users',
              too: 'manageuser',
            },
            {
              title: 'Add User',
              too: 'adduser',
            },
          ],
        },
        {
          id: 3,
          title: 'Roles',
          icon: <SideBarRoleIcon />,
          subtitle: [
            {
              title: 'Create Role',
              too: 'createrole/create',
            },
            {
              title: 'Update Role',
              too: 'createrole/update',
            },
          ],
        },
        {
          id: 4,
          title: 'Batches',
          icon: <BatchIcon />,
          subtitle: [
            {
              title: 'Manage Batches',
              too: 'managebatches',
            },
            {
              title: 'Create Batch',
              too: 'createbatch',
            },
          ],
        },
        {
          id: 5,
          title: 'Corporate Group',
          icon: <CorporateGroupIcon />,
          subtitle: [
            {
              title: 'Manage Corporate Groups',
              too: 'managecorporate',
            },
            {
              title: 'Create Corporate Group',
              too: 'createcorporate',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      heading: 'LEARNING',
      menus: [
        {
          id: 6,
          title: 'Topics',
          icon: <TopicIcon />,
          subtitle: [
            {
              title: 'Manage Topics',
              too: 'managetopics',
            },
            {
              title: 'Create Topic',
              too: 'createtopics',
            },
          ],
        },
        {
          id: 7,
          title: 'Chapters',
          icon: <ChapterIcon />,
          subtitle: [
            {
              title: 'Manage Chapters',
              too: 'managechapter',
            },
            {
              title: 'Create Chapter',
              too: 'createchapter',
            },
          ],
        },
        {
          id: 8,
          title: 'Courses',
          icon: <CourseIcon fill={'#818fa0'} stroke={'#818fa0'} />,
          subtitle: [
            {
              title: 'Manage Courses',
              too: 'managecourse',
            },
            {
              title: 'Create Course',
              too: 'createcourse',
            },
          ],
        },
        {
          id: 9,
          title: 'Track',
          icon: <CourseIcon fill={'#818fa0'} stroke={'#818fa0'} />,
          subtitle: [
            {
              title: 'Manage Tracks',
              too: 'managetrack',
            },
            {
              title: 'Create Track',
              too: 'createtrack',
            },
          ],
        },
        {
          id: 22,
          title: 'Exercises',
          icon: <CourseIcon fill={'#818fa0'} stroke={'#818fa0'} />,
          subtitle: [
            {
              title: 'Manage Exercises',
              too: 'manageexercises',
            },
            {
              title: 'Create Exercise',
              too: 'createexercise',
            },
          ],
        },
        {
          id: 16,
          title: 'Courses',
          icon: <SideBarRoleIcon />,
          to: '/app/browse',
        },
        {
          id: 17,
          title: 'Assessment',
          icon: <SideBarRoleIcon />,
          subtitle: [
            {
              title: 'Manage Assessments',
              too: 'manageassessment',
            },
            {
              title: 'Create Assessments',
              too: 'createassessment',
            },
          ],

        },
        {
          id: 10,
          title: 'Schedule',
          icon: <DatePickerIcon />,
          to: '/app/calendar',
        },
        {
          id: 19,
          title: 'Career Path',
          icon: <SideBarRoleIcon />,
        },
        {
          id: 20,
          title: 'Achievements',
          icon: <CupIcon />,
        },
        {
          id: 21,
          title: 'Schedule',
          icon: <DatePickerIcon />,
          to: '/app/mycalendar',
        },
      ],
    },
    {
      id: 3,
      heading: 'OTHERS',
      menus: [
        {
          id: 11,
          title: 'Reports',
          icon: <ReportSideBarIcon />,
        },
        {
          id: 12,
          title: 'Logs',
          to: '/app/activity',
          icon: <DatePickerIcon />,
        },
        {
          id: 13,
          title: 'Settings',
          to: '/app/setting',
          icon: <SettingSideBarIcon />,
        },
        {
          id: 14,
          title: 'Ask Me',
          to: '/app/chatGPT',
          icon: <OpenAiIcon />,
        },
        {
          id: 15,
          title: 'Configure',
          to: '/app/configure',
          icon: <ConfigureIcon />,
        },
      ],
    },
  ];

  const [open, setOpen] = useState({});
  const auth = useAuth();

  const handleClick = (id) => {
    setOpen(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <Box className="sidebar-admin">
      <Box className="flex-grow-1 nav-center">
        <Nav as="ul" className="" activeKey="/home">
          {items.map(item => {
            const filteredMenus =
              auth?.user?.role?.[0]?.['name'] === 'Super Admin'
                ? item.menus.filter(
                  (dat) => ![19, 20, 16, 13, 11, 21, 14].includes(dat.id)
                )
                : auth?.user?.role?.[0]?.['name'] === 'Admin'

                
                  ? item.menus.filter((dat) => ![3, 13, 19, 21, 14].includes(dat.id))
                  : auth?.user?.role?.[0]?.['name'] === 'Client Representative'
                    ? item.menus.filter((dat) => [1, 2].includes(dat.id))
                    : auth?.user?.role?.[0]?.['name'] === 'Job Architect'
                      ? item.menus.filter((dat) => [1, 6, 7, 8, 9].includes(dat.id))
                      : auth?.user?.role?.[0]?.['name'] === 'Trainer'
                        ? item.menus.filter((dat) =>
                          [1, 6, 7, 8, 9, 21, 22, 14, 17].includes(dat.id)
                        )
                        : auth?.user?.role?.[0]?.['name'] === 'Learner'
                          ? item.menus.filter((dat) =>
                            [1, 20, 16, 21, 14].includes(dat.id)
                          )
                          : item.menus.filter((dat) => [1, 2].includes(dat.id));

            if (filteredMenus.length === 0) {
              return null;
            }

            return (
              <>
                <h6 className="barlist-head mt-2 mb-2 ms-1">{item.heading}</h6>
                {filteredMenus.map((e, index) => (
                  <Nav.Item as="li" key={e.id}>
                    <Box className={`navd`}>
                      <NavLink
                        to={e.to ? e.to : null}
                        onClick={() => handleClick(e.id)}
                        aria-expanded={open}
                        aria-controls="collapseID"
                        data-target={`#collapseID${index}`}
                        className="nav-find"
                        id="nav-find"
                      >
                        <Span className="d-flex justify-content-between align-items-center me-2">
                          <Span className="nav-links d-flex align-items-center">
                            {e.icon}
                            &nbsp;&nbsp;&nbsp;{e.title}
                          </Span>
                          {e.subtitle && (
                            <i
                              style={
                                open[e.id]
                                  ? { transform: 'rotate(180deg)' }
                                  : null
                              }
                            >
                              {<DownArrowlight />}
                            </i>
                          )}
                        </Span>
                      </NavLink>
                    </Box>

                    <Collapse in={open[e.id]}>
                      <Box
                        key={e.id}
                        id="example-collapse-text"
                        className="collapsedText"
                      >
                        <ul className="sublink-ul">
                          {e.subtitle?.map((d, index) => (
                            <li
                              className="mb-2 mt-2 sublink-li"
                              key={index}
                              to={d.too}
                            >
                              <NavLink
                                className="sub-links"
                                // exact={true}
                                to={d.too}

                              // isActive={() => [d.to].includes(pathname)}
                              >
                                <DotIcon className="dotIcon" />
                                &nbsp;&nbsp;
                                {d.title.length > 18
                                  ? d.title.slice(0, 18) + '...'
                                  : d.title}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    </Collapse>
                  </Nav.Item>
                ))}
              </>
            );
          })}
        </Nav>
      </Box>
    </Box>
  );
};

export default Sidebar;
