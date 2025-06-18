import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "../utils/axios";

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
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Panel Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Stats</h3>
          <p>Total Events: {stats.totalEvents}</p>
          <p>Total Admins: {stats.totalAdmins}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Business Growth</h3>
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
}
