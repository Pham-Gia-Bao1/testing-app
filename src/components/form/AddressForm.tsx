import React, { useState, FormEvent } from "react";
import { message, Select, Button } from "antd";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { addNewDeliveryAddress } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AddressFormProps, FormDataAddNewAddress } from "@/types";
import { useTranslation } from "react-i18next"; // Import useTranslation

const AddressForm: React.FC<AddressFormProps> = ({ setExitedAddress }) => {
  const { t } = useTranslation(); // Use useTranslation hook
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [formData, setFormData] = useState<FormDataAddNewAddress>({
    name: currentUser?.name || "",
    phone: currentUser?.phone_number || "",
    address: currentUser?.address || "",
  });

  const [province, setProvince] = useState("Quảng Bình");
  const [district, setDistrict] = useState("Bố Trạch District");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
  });

  const provinces = ["Quảng Bình"];
  const districtsMap: Record<string, string[]> = {
    "Quảng Bình": [
      "Đồng Hới City",
      "Ba Đồn Town",
      "Bố Trạch District",
      "Lệ Thủy District",
      "Minh Hóa District",
      "Quảng Ninh District",
      "Quảng Trạch District",
      "Tuyên Hóa District",
    ],
  };

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setDistrict("");
    setErrors(prev => ({ ...prev, province: "" })); // Clear error
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setErrors(prev => ({ ...prev, district: "" })); // Clear error
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const newErrors = {
      name: formData.name ? "" : t('address_form.full_name_required'),
      phone: formData.phone ? "" : t('address_form.phone_number_required'),
      address: formData.address ? "" : t('address_form.specific_address_required'),
      province: province ? "" : t('address_form.province_required'),
      district: district ? "" : t('address_form.district_required'),
    };

    setErrors(newErrors);

    // Check if there are errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      message.error(t('address_form.add_delivery_address'));
      return;
    }

    setLoading(true);
    try {
      const fullAddress = `${formData.address}, ${district}, ${province}`;
      await addNewDeliveryAddress({ ...formData, address: fullAddress });
      message.success(t('address_form.save_address'));
      setExitedAddress(true);
    } catch (error) {
      console.log("Error:", error);
      message.error(t('address_form.add_delivery_address'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-8 rounded">
      <h2 className="text-lg font-semibold mb-4">{t('address_form.new_address')}</h2>
      <p className="text-sm mb-4">{t('address_form.add_delivery_address')}</p>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('address_form.full_name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={t('address_form.full_name')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('address_form.phone_number')}</label>
        <PhoneInput
          id="phone"
          name="phone"
          placeholder={t('address_form.phone_number')}
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value || "" })}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="province" className="block text-sm font-medium text-gray-700">{t('address_form.province')}</label>
        <Select
          id="province"
          value={province}
          onChange={handleProvinceChange}
          className="w-full"
          style={{ backgroundColor: "#E5E7EB", borderRadius: "0.375rem" }} // Tailwind CSS bg-gray-200 and rounded
        >
          {provinces.map((province) => (
            <Select.Option key={province} value={province}>
              {province}
            </Select.Option>
          ))}
        </Select>
        {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="district" className="block text-sm font-medium text-gray-700">{t('address_form.district')}</label>
        <Select
          id="district"
          value={district}
          onChange={handleDistrictChange}
          className="w-full bg-gray-200"
          style={{ backgroundColor: "#E5E7EB", borderRadius: "0.375rem" }} // Tailwind CSS bg-gray-200 and rounded
        >
          {province && districtsMap[province].map((district) => (
            <Select.Option key={district} value={district}>
              {district}
            </Select.Option>
          ))}
        </Select>
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">{t('address_form.specific_address')}</label>
        <textarea
          id="address"
          name="address"
          placeholder={t('address_form.specific_address')}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-4 py-2 bg-gray-200 rounded"
          rows={4}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="mb-4 flex gap-3 justify-end">
        <Button type="primary" className="w-full h-full sm:w-auto p-3" htmlType="submit" loading={loading}>
          {t('address_form.save_address')}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
