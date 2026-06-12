import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiChartPie, HiSearch, HiShoppingBag, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  setOpen?: (_open: boolean) => void;
}

const ExampleSidebar: FC<SidebarProps> = function ({ isOpen, setOpen }) {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    setCurrentPage(pathname);
    // Close sidebar on mobile when navigating
    if (setOpen) setOpen(false);
  }, [location, setOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/90 lg:hidden"
          onClick={() => setOpen?.(false)}
          onKeyDown={(e) => e.key === "Enter" && setOpen?.(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 shrink-0 flex-col transition-transform duration-300 lg:z-20 lg:translate-x-0 lg:pt-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:shadow-none`}
        aria-label="Sidebar"
      >
        <Sidebar className="h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-full flex-col justify-between py-2">
            <div>
              <div className="mb-4 flex items-center justify-between px-3 lg:hidden">
                <span className="text-lg font-bold dark:text-white">Menu</span>
                <button
                  onClick={() => setOpen?.(false)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiX className="h-5 w-5 dark:text-white" />
                </button>
              </div>
              <form className="pb-3 md:hidden">
                <TextInput
                  icon={HiSearch}
                  type="search"
                  placeholder="Search"
                  required
                />
              </form>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item
                    as={Link}
                    to="/"
                    icon={HiChartPie}
                    className={
                      "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                  >
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Item
                    as={Link}
                    to="/all-entries"
                    icon={HiShoppingBag}
                    className={
                      "/all-entries" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Agents
                  </Sidebar.Item>
                  <Sidebar.Item
                    as={Link}
                    to="/all-manager"
                    icon={HiShoppingBag}
                    className={
                      "/all-manager" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Manager
                  </Sidebar.Item>
                  <Sidebar.Item
                    as={Link}
                    to="/auth/manager-dashboard"
                    icon={HiChartPie}
                    className={
                      "/auth/manager-dashboard" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Manager Dashboard
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </div>
        </Sidebar>
      </aside>
    </>
  );
};

export default ExampleSidebar;
