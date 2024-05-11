import { Link, Outlet } from "react-router-dom";
import { FaRegUser, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineMedicalServices, MdOutlineExitToApp } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import logo from "/logo.svg";

export function Layout() {
  return (
    <main className="w-screen">
      <nav className="p-6 flex flex-col justify-between h-[100vh] w-[22%] shadow-2xl rounded-r-[32px] bg-white max-lg:p-2 max-lg:w-[30%]">
        <div>
          <a href="/">
            <img src={logo} alt="Logo CECOM" className="w-44 mt-10 ml-4 " />
          </a>
          <ul className="text-lg mt-12 flex flex-col ">
            <li>
              <Link
                to="/agend"
                className="flex items-center gap-2 hover:bg-gray-50 p-4 rounded-md transition-all"
              >
                <FaRegCalendarAlt /> Agenda
              </Link>
            </li>
            <li>
              <Link
                to="/patients"
                className="flex items-center gap-2  hover:bg-gray-50 p-4 rounded-md transition-all"
              >
                <FaRegUser /> Pacientes
              </Link>
            </li>
            <li>
              <Link
                to="/medicalRecord"
                className="flex items-center gap-2  hover:bg-gray-50 p-4 rounded-md transition-all"
              >
                <MdOutlineMedicalServices />
                Prontuário
              </Link>
            </li>
            <li>
              <Link
                to="/configs"
                className="flex items-center gap-2  hover:bg-gray-50 p-4 rounded-md transition-all"
              >
                <FiSettings /> Configurações
              </Link>
            </li>
          </ul>
        </div>
        <span className="flex items-center justify-between gap-1 text-lg w-full text-center py-3 px-6 border-t-2">
          {" "}
          Usuário
          <Link to="/login">
            <MdOutlineExitToApp size={25} />{" "}
          </Link>
        </span>
      </nav>
      <Outlet />
    </main>
  );
}
