import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from 'react-icons/md';
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import * as GoIcons from 'react-icons/go';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';


export const SidebarData = [
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
    path: "#",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text"
  },

  {
    title: "Администрација",
    path: "#",
    icon: <RiIcons.RiAdminFill/>,
    cName: "nav-text"
  },

  {
    title: "Оддели",
    path: "#",
    icon: <CgIcons.CgOrganisation/>,
    cName: "nav-text"
  },

  {
    title: "Работни задачи",
    path: "#",
    icon: <FaIcons.FaTasks/>,
    cName: "nav-text"
  },

  {
    title: "Статуси",
    path: "#",
    icon: <BsIcons.BsPencilSquare/>,
    cName: "nav-text"
  },

  {
    title: "Промени оддел",
    path: "#",
    icon: <BsIcons.BsPlusCircle/>,
    cName: "nav-text"
  },

  {
    title: "Промени лозинка",
    path: "#",
    icon: <RiIcons.RiSettings2Fill/>,
    cName: "nav-text"
  }

];
