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
  const [eventNameExists, setEventNameExists] = useState(false);
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
      if (eventNameExists) {
        message.error("Event name already exists");
        return;
      }

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
        setEventNameExists(false);
      } catch (err) {
        message.error("Failed to add event");
      }
    },
  });

  // ✅ Debounced event name check
  useEffect(() => {
    const name = formik.values.title.trim();
    if (name.length < 3) {
      setEventNameExists(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/events/check-name/${encodeURIComponent(name)}`
        );
        setEventNameExists(res.data.exists);
      } catch (err) {
        console.error("Event name check failed:", err);
        setEventNameExists(false);
      }
    }, 500); // Delay to prevent rapid calls

    return () => clearTimeout(delay);
  }, [formik.values.title]);

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
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={events}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        size="middle"
        bordered
      />

      <Modal
        title="Add Event"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          formik.resetForm();
          setEventNameExists(false);
        }}
        onOk={formik.handleSubmit}
        okText="Add"
      >
        <Form layout="vertical">
          <Form.Item
            label="Event Name"
            validateStatus={
              formik.errors.title || eventNameExists ? "error" : ""
            }
            help={
              formik.errors.title
                ? formik.errors.title
                : eventNameExists
                ? "This event name already exists"
                : ""
            }
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
              value={formik.values.date ? dayjs(formik.values.date) : null}
              onChange={(date) => formik.setFieldValue("date", date)}
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
