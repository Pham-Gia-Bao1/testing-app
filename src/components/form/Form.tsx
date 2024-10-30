"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProductFormProps } from "@/types";

const ProductForm: React.FC<ProductFormProps> = ({
  checkTypeForm,
  open,
  onFinish,
  onFinishFailed,
  handleCancel,
  form,
  fileList,
  handleChange,
  loading,
  types,
  imageUrl,
  isUpload,
}) => {
  const [allType, setAllType] = useState<string[]>(types);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(isUpload);
  const [checkForm, setCheckForm] = useState<boolean>(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setIsUploaded(true);
      setSelectedFile(file);
      handleChange(file); // Pass the file to handleChange if needed
    } else {
      setIsUploaded(false);
    }
  };

  useEffect(() => {
    if (checkTypeForm == 0) {
      setCheckForm(true);
    }
    setSelectedFile(null);
    setIsUploaded(false);
  }, [checkTypeForm]);

  const previewImage = selectedFile
    ? URL.createObjectURL(selectedFile)
    : imageUrl;

  return (
    <Modal
      className="full-screen-modal w-1/2"
      footer={null}
      title={
        <h2>
          {checkTypeForm == 0 ? "Create a new product" : "Update product"}
        </h2>
      }
      visible={open}
      onCancel={handleCancel}
      width="80%"
      style={{
        top: 20,

        padding: 0,
        backgroundColor: "transparent",
        borderRadius: 8,
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        height: "calc(100% - 55px)",
        overflowY: "auto",
      }}
    >
      <Form
        name="productForm"
        className="w-full h-full"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        style={{ flex: 1 }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input product name!" },
              ]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input product price!" },
              ]}
            >
              <Input placeholder="Enter product price" />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                { required: true, message: "Please select product type!" },
              ]}
            >
              <Select placeholder="Select a type">
                {allType.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input product description!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Enter product description"
                rows={4}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Upload picture"
              name="upload"
              rules={[{ required: true, message: "Please upload your file!" }]}
            >
              <div
                style={{
                  width: "100%",
                  height: "360px",
                  border: "2px dashed #d9d9d9",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {isUploaded ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : checkTypeForm !== 0 || !checkForm ? (
                  <img
                    src={previewImage ?? ""}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "#999",
                    }}
                  >
                    <PlusOutlined style={{ fontSize: "64px" }} />
                  </div>
                )}

                <input
                  type="file"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  onChange={handleFileChange}
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Button loading={loading} type="primary" htmlType="submit">
              {checkTypeForm == 0 ? 'Create' : 'Update' }
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductForm;
