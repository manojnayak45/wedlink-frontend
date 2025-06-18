import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  message,
} from "antd";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import React from "react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const formik = useFormik({
    initialValues: {
      title: "",
      groomName: "",
      brideName: "",
      location: "",
      date: null,
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Event name is required"),
      groomName: Yup.string().required("Groom name is required"),
      brideName: Yup.string().required("Bride name is required"),
      location: Yup.string().required("Location is required"),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        name: values.title,
        groomName: values.groomName,
        brideName: values.brideName,
        location: values.location,
        date: values.date,
        description: values.description,
      };

      try {
        await axios.post("/events", payload);
        fetchEvents();
        setIsModalOpen(false);
        formik.resetForm();
      } catch (err) {
        console.error("❌ Error adding event:", err);
        message.error("Failed to add event");
      }
    },
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/events/${id}`);
      fetchEvents();
      message.success("Event deleted");
    } catch (err) {
      console.error("❌ Error deleting event:", err);
      message.error("Failed to delete");
    }
  };

  // Only include essential columns for small devices
  const columns = [
    {
      title: "No.",
      dataIndex: "si",
      key: "si",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/events/${record._id}`} className="text-blue-600 underline">
          {text}
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "actions",
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
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-lg font-bold text-gray-800">Your Events</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Add Event
        </button>
      </div>

      {/* ✅ Table - responsive without scrollbars */}
      <div className="w-full">
        <Table
          columns={columns}
          dataSource={events}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          size="middle"
          bordered
        />
      </div>

      {/* ✅ Modal */}
      <Modal
        title="Add Event"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={formik.handleSubmit}
        okText="Add"
        className="w-full"
      >
        <Form layout="vertical">
          <Form.Item
            label="Event Name"
            validateStatus={formik.errors.title && "error"}
            help={formik.errors.title}
          >
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Groom Name"
            validateStatus={formik.errors.groomName && "error"}
            help={formik.errors.groomName}
          >
            <Input
              name="groomName"
              value={formik.values.groomName}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Bride Name"
            validateStatus={formik.errors.brideName && "error"}
            help={formik.errors.brideName}
          >
            <Input
              name="brideName"
              value={formik.values.brideName}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Location"
            validateStatus={formik.errors.location && "error"}
            help={formik.errors.location}
          >
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Date"
            validateStatus={formik.errors.date && "error"}
            help={formik.errors.date}
          >
            <DatePicker
              style={{ width: "100%" }}
              name="date"
              onChange={(date) => formik.setFieldValue("date", date)}
              value={formik.values.date ? dayjs(formik.values.date) : null}
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
