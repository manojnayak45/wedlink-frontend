import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className=" px-4 md:px-6 py-3  ">
      <div className="flex justify-end w-full">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-sm bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 transition"
          >
            Account ▾
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-md z-10 min-w-full">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
