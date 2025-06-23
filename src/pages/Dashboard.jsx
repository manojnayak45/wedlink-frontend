import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
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
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";

const { Option } = Select;

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
      template: "template1",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Event name is required"),
      groomName: Yup.string().required("Groom name is required"),
      brideName: Yup.string().required("Bride name is required"),
      location: Yup.string().required("Location is required"),
      date: Yup.date().required("Date is required"),
      template: Yup.string().required("Template is required"),
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
        template: values.template,
      };

      try {
        await axios.post("/events", payload);
        fetchEvents();
        setIsModalOpen(false);
        formik.resetForm();
        setEventNameExists(false);
        message.success("Event created!");
      } catch (err) {
        message.error("Failed to add event");
      }
    },
  });

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
    }, 500);

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

  const renderTemplatePreview = () => {
    const props = {
      brideName: formik.values.brideName || "Bride",
      groomName: formik.values.groomName || "Groom",
      location: formik.values.location || "Venue",
      date: formik.values.date
        ? dayjs(formik.values.date).format("MMMM D, YYYY")
        : "Date",
    };

    if (formik.values.template === "template1") return <Template1 {...props} />;
    if (formik.values.template === "template2") return <Template2 {...props} />;
    return null;
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

          <Form.Item label="Groom Name">
            <Input
              name="groomName"
              value={formik.values.groomName}
              onChange={formik.handleChange}
            />
          </Form.Item>

          <Form.Item label="Bride Name">
            <Input
              name="brideName"
              value={formik.values.brideName}
              onChange={formik.handleChange}
            />
          </Form.Item>

          <Form.Item label="Location">
            <Input
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
            />
          </Form.Item>

          <Form.Item label="Date">
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

          <Form.Item label="Template">
            <Select
              name="template"
              value={formik.values.template}
              onChange={(value) => formik.setFieldValue("template", value)}
            >
              <Option value="template1">Template 1</Option>
              <Option value="template2">Template 2</Option>
            </Select>
          </Form.Item>

          {/* Live Preview */}
          <div className="my-4 border p-3 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Preview</h3>
            {renderTemplatePreview()}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
