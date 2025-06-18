import { Link, useLocation } from "react-router-dom";
import React from "react";

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-8">WedLink Admin</h2>
      <nav className="flex flex-col gap-4">
        <Link
          to="/admin-panel"
          className={`p-2 rounded ${
            pathname.includes("admin-panel")
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          Admin Panel
        </Link>
        <Link
          to="/dashboard"
          className={`p-2 rounded ${
            pathname.includes("dashboard") ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
