import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  Table,
  Descriptions,
  Popconfirm,
  message,
  Dropdown,
  Space,
  Upload,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { MoreOutlined } from "@ant-design/icons";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [guests, setGuests] = useState([]);
  const [isGuestModalOpen, setGuestModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editGuestId, setEditGuestId] = useState(null);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Event and Guest List
  const fetchData = async () => {
    try {
      const [eventRes, guestsRes] = await Promise.all([
        axios.get(`/events/${id}`), // Correct
        axios.get(`/guests/event/${id}`), // ✅ Fix here
      ]);
      setEvent(eventRes.data);
      setGuests(guestsRes.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      message.error("Failed to load event or guest list");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ✅ Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      whatsapp: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name required"),
      whatsapp: Yup.string().required("WhatsApp number required"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await axios.put(`/guests/${editGuestId}`, values); // ✅ this is okay
          message.success("Guest updated successfully");
        } else {
          await axios.post(`/guests/event/${id}`, values); // ✅ FIX HERE
          message.success("Guest added successfully");
        }
        fetchData();
        closeModal();
      } catch (err) {
        console.error("❌ Guest submission failed:", err);
        message.error("Failed to save guest");
      }
    },
  });

  // ✅ Edit Guest
  const handleEdit = (guest) => {
    setEditMode(true);
    setEditGuestId(guest._id);
    formik.setValues({
      name: guest.name || "",
      whatsapp: guest.whatsapp || "",
      email: guest.email || "",
    });
    setGuestModalOpen(true);
  };

  // ✅ Delete Guest
  const handleDelete = async (guestId) => {
    try {
      await axios.delete(`/guests/${guestId}`);
      fetchData();
      message.success("Guest deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting guest:", err);
      message.error("Failed to delete guest");
    }
  };

  // ✅ Close modal and cleanup
  const closeModal = () => {
    setGuestModalOpen(false);
    setEditMode(false);
    setEditGuestId(null);
    formik.resetForm();
  };

  // ✅ Guest Table Columns
  const guestColumns = [
    {
      title: "Guest ID",
      dataIndex: "guestId",
      key: "guestId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "WhatsApp",
      dataIndex: "whatsapp",
      key: "whatsapp",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: (
              <span
                onClick={() => handleEdit(record)}
                className="text-blue-600 block"
              >
                Edit
              </span>
            ),
          },
          {
            key: "delete",
            label: (
              <Popconfirm
                title="Are you sure to delete this guest?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <span className="text-red-500 block">Delete</span>
              </Popconfirm>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <MoreOutlined style={{ fontSize: 18 }} />
              </Space>
            </a>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        <ArrowLeftOutlined />
        Back to Dashboard
      </button>

      <h2 className="text-xl sm:text-2xl font-semibold mb-4 mt-8">
        Event Details
      </h2>

      {/* ✅ Event Info */}
      <Descriptions bordered column={1} size="middle" className="mb-6">
        <Descriptions.Item label="Event Name">{event.name}</Descriptions.Item>
        <Descriptions.Item label="Groom Name">
          {event.groomName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Bride Name">
          {event.brideName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Location">{event.location}</Descriptions.Item>
        <Descriptions.Item label="Date">{event.date}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {event.description}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">
          {event.adminId?.email || "N/A"} ({event.adminId?.role || "N/A"})
        </Descriptions.Item>
      </Descriptions>

      {/* ✅ Guest Section */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h3 className="text-lg font-bold">Guest List</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setGuestModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Guest
          </button>
          <button
            onClick={() => setBulkModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Bulk Guest Entry
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <Table
        dataSource={guests}
        columns={guestColumns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        size="middle"
        bordered
        className="w-full"
      />

      {/* ✅ Add/Edit Guest Modal */}
      <Modal
        title={isEditMode ? "Edit Guest" : "Add Guest"}
        open={isGuestModalOpen}
        onCancel={closeModal}
        onOk={formik.handleSubmit}
        okText={isEditMode ? "Update" : "Add"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Name"
            validateStatus={formik.errors.name && "error"}
            help={formik.errors.name}
          >
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            label="WhatsApp Number"
            validateStatus={formik.errors.whatsapp && "error"}
            help={formik.errors.whatsapp}
          >
            <Input
              name="whatsapp"
              value={formik.values.whatsapp}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item label="Email (optional)">
            <Input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Bulk Guest Entry (Upload Excel)"
        open={isBulkModalOpen}
        onCancel={() => setBulkModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            const file = values.file?.[0]?.originFileObj;

            if (!file) {
              message.error("Please upload a valid Excel file.");
              return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
              setUploading(true);
              await axios.post(`/guests/bulk/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              message.success("Guests uploaded successfully");
              setBulkModalOpen(false);
              fetchData(); // Refresh table
            } catch (err) {
              console.error("Bulk upload error:", err);
              message.error("Failed to upload guests");
            } finally {
              setUploading(false);
            }
          }}
        >
          <Form.Item
            label="Upload Excel File (.xlsx)"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload an Excel file" }]}
          >
            <Upload
              accept=".xlsx,.xls"
              beforeUpload={() => false} // prevents auto-upload
              maxCount={1}
            >
              <Button>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              className="w-full"
            >
              Upload Guests
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
