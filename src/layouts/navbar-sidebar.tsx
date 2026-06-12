import { useState, type FC, type PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children, isFooter = true }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
      <>
        <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex min-h-screen items-start">
          <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
          <MainContent isFooter={isFooter}>{children}</MainContent>
        </div>
      </>
    );
  };

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <main className="min-h-screen w-full overflow-y-auto bg-gray-50 pt-20 dark:bg-gray-900 lg:ml-64">
      <div className="mx-auto max-w-screen-2xl p-4 sm:p-6 lg:p-8">
        {children}
        {isFooter && (
          <div className="mx-4 mt-8">
            <MainContentFooter />
          </div>
        )}
      </div>
    </main>
  );
};

const MainContentFooter: FC = function () {
  return <></>;
};

export default NavbarSidebarLayout;
