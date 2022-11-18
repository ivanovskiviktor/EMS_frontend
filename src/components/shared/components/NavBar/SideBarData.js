import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from 'react-icons/md';
import * as IoIcons from "react-icons/io";


export const SideBarData = [
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
  }
];