import { useState, type FC } from "react";
import { DarkThemeToggle, Modal, Navbar } from "flowbite-react";
import {
  HiLogout,
  HiMenuAlt1,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const ExampleNavbar: FC<NavbarProps> = function ({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token"]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // 1. Clear credentials
    removeCookie("token", { path: "/" });

    // 2. Clear local states
    localStorage.clear();
    sessionStorage.clear();

    // 3. UI feedback and Redirect
    setIsLogoutModalOpen(false);
    navigate("/auth/sign-in");
  };

  return (
    <>
      <Navbar
        fluid
        className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 lg:pl-4"
      >
        <div className="w-full p-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onToggleSidebar}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <HiMenuAlt1 className="h-6 w-6" />
              </button>
              <Navbar.Brand as={Link} to="/">
                <img
                  alt=""
                  src="/images/logo.png"
                  className="mr-3 h-6 sm:h-8"
                />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  PEXPOP
                </span>
              </Navbar.Brand>
            </div>
            <div className="flex items-center gap-3">
              <DarkThemeToggle />
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <HiLogout className="h-5 w-5" />
                <span className="hidden text-[10px] font-black uppercase tracking-widest sm:inline">
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal
        show={isLogoutModalOpen}
        size="md"
        onClose={() => setIsLogoutModalOpen(false)}
        popup
        className="backdrop-blur-sm"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-500" />
            <h3 className="mb-2 text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Confirm Sign Out
            </h3>
            <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to log out? Any unsaved changes might be
              lost.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 active:scale-95"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-xs font-black uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                No, Stay
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ExampleNavbar;
