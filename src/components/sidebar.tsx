import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiSearch,
  HiShoppingBag,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  const location = useLocation();
  useEffect(() => {
    const { pathname } = location;
    setCurrentPage(pathname);
  }, [setCurrentPage]);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                to="/"
                icon={HiChartPie}
                className={
                  "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                <Link to="/">Dashboard</Link>
              </Sidebar.Item>
              <Sidebar.Item
                to="/all-entries"
                icon={HiShoppingBag}
                className={
                  "/all-entries" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                <Link to="/all-entries">Agents</Link>
              </Sidebar.Item>
              <Sidebar.Item
                to="/all-manager"
                icon={HiShoppingBag}
                className={
                  "/all-manager" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                <Link to="/all-manager">Manager</Link>
              </Sidebar.Item>

              <Sidebar.Item
                to="/all-manager"
                icon={HiChartPie}
                className={
                  "/auth/manager-dashboard" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }
              >
                <Link to="/auth/manager-dashboard">Manager Dashboard</Link>
              </Sidebar.Item>



            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
