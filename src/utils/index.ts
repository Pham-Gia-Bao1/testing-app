import i18n from 'i18next';
import { Metadata } from "next";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import iconPath from '../assets/images/rooms/LayResLogo.png';
export const API_URL: string = "https://lay-restaurant.zeabur.app/api";

export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export function generateMetadata(pageTitle: string, pageDescription: string): Metadata {
  const defaultTitle = NAME_RETAURANT;

  return {
    title: {
      default: defaultTitle,
      template: pageTitle ? `%s | ${NAME_RETAURANT}` : defaultTitle,
      absolute: pageTitle ? `${pageTitle} | ${NAME_RETAURANT}` : defaultTitle,
    },
    description: pageDescription,
    icons: {
      icon: LOGO, // Use the .src property for the URL path
    },
  };
}
export const setStorage = (storageName: string, value: any) => {
  localStorage.setItem(storageName, value);
};
export function headerAPI() {
  const token: string | any = localStorage.getItem("__token__");
  console.log(token);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  return headers;
}
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const formatDate = (date: Date | null) => {
  return date ? date.toLocaleDateString() : "N/A";
};
export function convertTotalContextStateToNumber(contextState: {
  totalAmount: string | number | null;
}): number {
  const { totalAmount } = contextState;
  // Check if totalAmount is a number and return it, or convert from string
  if (typeof totalAmount === "number") {
    return totalAmount;
  } else if (typeof totalAmount === "string") {
    const parsedNumber = parseFloat(totalAmount);
    if (!isNaN(parsedNumber)) {
      return parsedNumber;
    }
  }
  // Return 0 or handle default case if totalAmount is null or cannot be converted
  return 0;
}

export const generateRandomString = (length = 2) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const extractOrderNumber = (inputString: string) => {
  // Đoạn chuỗi cố định là "OD", lấy vị trí bắt đầu của "OD"
  const prefix = 'OD';
  const index = inputString.indexOf(prefix);

  // Nếu không tìm thấy "OD", trả về null
  if (index === -1) {
    return null;
  }

  // Trả về phần chuỗi sau "OD"
  return inputString.substring(index + prefix.length);
};
export function convertToStaticImport(value: string | undefined): StaticImport | string {
  if (value === undefined && value === null) {
    return '';
  }

  // Convert string to unknown first, then to StaticImport
  return (value as unknown) as StaticImport;
}

export const NAME_RETAURANT : any | string = process.env.NAME_RETAURANT || 'LayHotel';
export const LOGO : any | string = process.env.LOGO || iconPath.src;
export const CURRENCY_UNIT: string = process.env.CURRENCY_UNIT || 'vnd';

// Hàm định dạng tiền theo đơn vị tiền tệ
export const formatMoney = (money: number, currency: string = CURRENCY_UNIT): string => {
  // Nếu đơn vị tiền là VND, nhân tiền lên 1000
  const adjustedMoney = currency.toLowerCase() === 'vnd' ? money * 1000 : money;

  // Tạo đối tượng Intl.NumberFormat để định dạng số với phân tách dấu chấm
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
  });

  // Định dạng giá trị tiền
  const formattedMoney = formatter.format(adjustedMoney);

  // Trả về chuỗi kết quả kèm theo đơn vị tiền tệ viết hoa
  return `${formattedMoney} ${currency.toUpperCase()}`;
};


export const getUrlUpdateUserImg = async (file: File) => {
  const CLOUD_NAME = "dugeyusti";
  const PRESET_NAME = "expert_upload";
  const FOLDER_NAME = "BitStorm";
  const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("upload_preset", PRESET_NAME);
  formData.append("folder", FOLDER_NAME);
  formData.append("file", file);
  const options = {
    method: "POST",
    body: formData,
  };
  try {
    const res = await fetch(api, options);
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

