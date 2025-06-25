import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";
import axios from "../utils/axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

const { Option } = Select;

export default function AddEventPage() {
  const navigate = useNavigate();
  const [checkingName, setCheckingName] = useState(false);
  const [eventNameExists, setEventNameExists] = useState(false);

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
      try {
        if (eventNameExists) {
          message.error("Event name already exists");
          return;
        }

        setCheckingName(true);
        const payload = {
          name: values.title,
          groomName: values.groomName,
          brideName: values.brideName,
          location: values.location,
          date: values.date,
          description: values.description,
          template: values.template,
        };

        await axios.post("/events", payload);
        message.success("Event created successfully");
        navigate("/dashboard");
      } catch (err) {
        console.error("Event creation failed", err);
        message.error("Failed to create event");
      } finally {
        setCheckingName(false);
      }
    },
  });

  // ✅ Live event name check
  useEffect(() => {
    const trimmedTitle = formik.values.title.trim();
    if (!trimmedTitle || trimmedTitle.length < 3) {
      setEventNameExists(false);
      return;
    }

    const checkName = debounce(async () => {
      try {
        const res = await axios.get(
          `/events/check-name/${encodeURIComponent(trimmedTitle)}`
        );
        setEventNameExists(res.data.exists);
      } catch (err) {
        console.error("Event name check failed", err);
        setEventNameExists(false);
      }
    }, 500);

    checkName();
    return () => checkName.cancel();
  }, [formik.values.title]);

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

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        <ArrowLeftOutlined />
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Form */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>

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

          <Form layout="vertical" onFinish={formik.handleSubmit}>
            <Form.Item
              label="Event Name"
              help={
                eventNameExists
                  ? "Event name already exists"
                  : formik.errors.title
              }
              validateStatus={
                eventNameExists || formik.errors.title ? "error" : ""
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
              help={formik.errors.groomName}
              validateStatus={formik.errors.groomName ? "error" : ""}
            >
              <Input
                name="groomName"
                value={formik.values.groomName}
                onChange={formik.handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Bride Name"
              help={formik.errors.brideName}
              validateStatus={formik.errors.brideName ? "error" : ""}
            >
              <Input
                name="brideName"
                value={formik.values.brideName}
                onChange={formik.handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Location"
              help={formik.errors.location}
              validateStatus={formik.errors.location ? "error" : ""}
            >
              <Input
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </Form.Item>

            <Form.Item
              label="Date"
              help={formik.errors.date}
              validateStatus={formik.errors.date ? "error" : ""}
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={checkingName}
                className="w-full"
              >
                Add Event
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Live Preview */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="border bg-white p-4 rounded">
            {renderTemplatePreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
