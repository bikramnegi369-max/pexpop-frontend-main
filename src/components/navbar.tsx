import type { FC } from "react";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import { HiMenuAlt1 } from "react-icons/hi";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const ExampleNavbar: FC<NavbarProps> = function ({ onToggleSidebar }) {
  return (
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
            <Navbar.Brand href="/">
              <img alt="" src="/images/logo.png" className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                PEXPOP
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
