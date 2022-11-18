import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from 'react-icons/md';
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';


export const SideBarDataAdmin = [
  {
    title: "Kонтролна табла",
    path: "#",
    icon: <MdIcons.MdSpaceDashboard/>,
    cName: "nav-text"
  },

  {
    title: "Завршени задачи",
    path: "#",
    icon: <AiIcons.AiOutlineFileDone />,
    cName: "nav-text"
  },

  {
    title: "Извештаи",
    path: "#",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text"
  },

  {
    title: "Забелешки",
    path: "/notes",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text"
  },

  {
    title: "Администрација",
    path: "/administration",
    icon: <RiIcons.RiAdminFill/>,
    cName: "nav-text"
  },

  {
    title: "Оддели",
    path: "/orgDepartments",
    icon: <CgIcons.CgOrganisation/>,
    cName: "nav-text"
  },

  {
    title: "Работни задачи",
    path: "/workingTasks",
    icon: <FaIcons.FaTasks/>,
    cName: "nav-text"
  },

  {
    title: "Статуси",
    path: "/statuses",
    icon: <BsIcons.BsPencilSquare/>,
    cName: "nav-text"
  },

  {
    title: "Промени оддел",
    path: "/modifyDepartment",
    icon: <BsIcons.BsPlusCircle/>,
    cName: "nav-text"
  } 
];