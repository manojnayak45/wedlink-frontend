import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import dayjs from "dayjs";
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";

const { Option } = Select;

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${id}`);
        const event = res.data;

        const initialValues = {
          name: event.name,
          groomName: event.groomName,
          brideName: event.brideName,
          location: event.location,
          description: event.description,
          date: dayjs(event.date),
          template: event.template || "template1",
        };

        form.setFieldsValue(initialValues);
        setFormValues(initialValues);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching event:", err);
        message.error("Failed to load event data");
        navigate(`/dashboard`);
      }
    };

    fetchEvent();
  }, [id, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        groomName: values.groomName,
        brideName: values.brideName,
        location: values.location,
        description: values.description,
        date: values.date,
        template: values.template,
      };

      await axios.put(`/events/${id}`, payload);
      message.success("Event updated successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error updating event:", err);
      message.error("Failed to update event");
    }
  };

  const renderTemplatePreview = () => {
    const props = {
      brideName: formValues.brideName || "Bride",
      groomName: formValues.groomName || "Groom",
      location: formValues.location || "Venue",
      date: formValues.date
        ? dayjs(formValues.date).format("MMMM D, YYYY")
        : "Date",
    };

    if (formValues.template === "template1") return <Template1 {...props} />;
    if (formValues.template === "template2") return <Template2 {...props} />;
    return null;
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>

      {!loading && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form */}
          <div className="w-full md:w-1/2 bg-white p-6 rounded shadow">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={(_, allValues) => setFormValues(allValues)}
            >
              <Form.Item
                label="Template"
                name="template"
                rules={[{ required: true, message: "Please select template" }]}
              >
                <Select>
                  <Option value="template1">Template 1</Option>
                  <Option value="template2">Template 2</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Event Name"
                name="name"
                rules={[{ required: true, message: "Please enter event name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Groom Name"
                name="groomName"
                rules={[{ required: true, message: "Please enter groom name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Bride Name"
                name="brideName"
                rules={[{ required: true, message: "Please enter bride name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-end gap-2">
                  <Button onClick={() => navigate("/dashboard")}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* Live Preview */}
          <div className="w-full md:w-1/2 bg-gray-100 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
            <div className="border bg-white p-4 rounded">
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
