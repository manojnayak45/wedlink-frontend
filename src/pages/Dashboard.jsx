import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/events/${id}`);
      fetchEvents();
      message.success("Event deleted");
    } catch (err) {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "si",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/events/${record._id}`} className="text-blue-600 underline">
          {text}
        </Link>
      ),
    },
    {
      title: "Template",
      dataIndex: "template",
      render: (tpl) => <span className="capitalize">{tpl}</span>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button
            style={{ backgroundColor: "#1890ff", color: "#fff" }}
            onClick={() => navigate(`/events/edit/${record._id}`)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this event?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <h1 className="text-lg font-bold">Your Events</h1>
        <button
          onClick={() => navigate("/add-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={events}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        size="middle"
        bordered
      />
    </div>
  );
}
