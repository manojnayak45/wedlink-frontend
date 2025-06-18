import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "../utils/axios";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";

Chart.register(ArcElement, Tooltip, Legend);

export default function AdminPanel() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAdmins: 0,
    growthPercentage: 0,
    declinePercentage: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/admin/overview");
        setStats(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch admin stats", err);
      }
    };

    fetchStats();
  }, []);

  const data = {
    labels: ["Growth", "Decline"],
    datasets: [
      {
        data: [stats.growthPercentage, stats.declinePercentage],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e4f2ff]">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        📊 Admin Panel Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:scale-105 transition">
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <h3 className="text-3xl font-bold text-indigo-600">
              {stats.totalEvents}
            </h3>
          </div>
          <FaCalendarAlt className="text-4xl text-indigo-400" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between hover:scale-105 transition">
          <div>
            <p className="text-sm text-gray-500">Total Admins</p>
            <h3 className="text-3xl font-bold text-teal-600">
              {stats.totalAdmins}
            </h3>
          </div>
          <FaUsers className="text-4xl text-teal-400" />
        </div>

        <div className="bg-gradient-to-r from-green-100 to-red-100 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Business Growth
          </h3>
          <Pie data={data} />
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>📈 {stats.growthPercentage}% Growth</span>
            <span>📉 {stats.declinePercentage}% Decline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
