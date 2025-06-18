import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-gray-900 text-white h-full sticky top-0">
        <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={closeSidebar}>
            <RxCross2 size={24} />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-2 flex items-center justify-between">
          {/* Hamburger (Left for mobile) */}
          <div className="md:hidden">
            <button className="text-gray-700" onClick={toggleSidebar}>
              <FiMenu size={24} />
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Account Dropdown (Always Right) */}
          <div>
            <Navbar />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
