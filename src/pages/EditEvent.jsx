import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import dayjs from "dayjs";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current event details
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/${id}`);
        const event = res.data;

        // Set values in the form
        form.setFieldsValue({
          name: event.name,
          groomName: event.groomName,
          brideName: event.brideName,
          location: event.location,
          description: event.description,
          date: dayjs(event.date),
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching event:", err);
        message.error("Failed to load event data");
        navigate(`/events/${id}`);
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
      };

      await axios.put(`/events/${id}`, payload);
      message.success("Event updated successfully");
      navigate(`/events/${id}`); // ✅ Redirect to event details page
    } catch (err) {
      console.error("❌ Error updating event:", err);
      message.error("Failed to update event");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      {!loading && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              <Button onClick={() => navigate("/")}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
