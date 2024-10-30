import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Select } from "antd";
import { getAllPrice } from "@/api";
import { FormSoftProps } from "@/types";
import { formatMoney } from "@/utils";
const FormSoft: React.FC<FormSoftProps> = ({
  open,
  onFinish,
  handleCancel,
  loading,
}) => {
  const [allPrice, setAllPrice] = useState<number[]>([]);
  useEffect(() => {
    fetchPrices();
    return;
  }, []);
  const fetchPrices = async () => {
    try {
      const response = await getAllPrice();
      setAllPrice(response);
    } catch (error) {
      throw error;
    }
  };
  const uniquePrices = allPrice.filter(
    (price, index, self) => self.indexOf(price) === index
  );
  return (
    <Modal
      className="text-center float-right mt-32 mr-10"
      title="Filter"
      footer={null}
      visible={open}
      onCancel={handleCancel}
    >
      <Form onFinish={onFinish} >
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please select product price!" }]}
        >
          <Select placeholder="Select a price">
            {uniquePrices.map((price, index) => (
              <Select.Option
                key={index}
                value={price}
              >{formatMoney(price)}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button loading={loading} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
export default FormSoft;
