import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { Popconfirm, PopconfirmProps, message } from "antd";
import { deleteFood } from "@/api";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Product } from "@/types";
import { formatMoney } from "@/utils";
import AddIcon from "@mui/icons-material/Add";

interface ProductCardProps {
  params: Product;
  getData: () => void;
  openModal: (id: number) => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  params,
  getData,
  openModal,
}) => {
  const [backupImage, setBackupImage] = useState<string>('https://www.google.com/url?sa=i&url=https%3A%2F%2Fvinhhanhfood.com%2Fcach-uop-thit-de-nuong-ngon%2F&psig=AOvVaw2dHPqGj-JdY4MMhLxafAtt&ust=1723004978434000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjqyu7D34cDFQAAAAAdAAAAABAJ')
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const token = useSelector((state: RootState) => state.auth.token);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    token
      ? setAnchorEl(event.currentTarget)
      : message.error("You need to login first!");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const confirm: PopconfirmProps["onConfirm"] = async (e) => {
    console.log(e);
    await deleteFood(params.id);
    getData();
    message.success("Deleted successfully!");
  };
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  return (
    <div
    data-aos="fade-up"
      className={` rounded-lg text-black overflow-hidden relative flex flex-col justify-between h-full`}
    >
      <Link href={`/settings/products/${params.id}?name=${params.name}`}>
         <p className="bg-green-500 hover:bg-green-600 p-1 rounded-full text-white absolute  bottom-28 right-4">
              <AddIcon />
            </p>
        {params.picture ? (
          <Image
            src={params?.picture ?? backupImage}
            width={500}
            height={500}
            alt="Dish"
            className="w-full h-48 object-cover rounded-20"
          />
        ) : (
          <Image
            src="https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg"
            width={500}
            height={500}
            alt="Dish"
            className="w-full h-48 object-cover rounded"
          />
        )}
        <div className="p-1 h-24 flex flex-col justify-between">
          <h2 className="mt-2 truncate-description-2-line overflow-ellipsis overflow-hidden ">
            {params.name}
          </h2>
          <div className="w-full flex justify-between">
            <p className="overflow-ellipsis overflow-hidden font-bold">
              {formatMoney(params.price )}
            </p>

          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2">
        {currentUser?.role_id == 1 ? (
          <IconButton
            className="bg-white"
            aria-label="more options"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        ) : null}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
          <MenuItem
            onClick={() => {
              openModal(params.id);
              handleClose();
            }}
            className="text-blue-600"
          >
            <BorderColorIcon />
          </MenuItem>
          <MenuItem>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={(e) => {
                confirm(e);
                handleClose();
              }}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              placement="topRight"
              overlayClassName="custom-popconfirm"
            >
              <span className="flex items-center text-red-600">
                <DeleteIcon />
              </span>
            </Popconfirm>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
export default ProductCard;
