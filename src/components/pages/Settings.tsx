"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchFoodsData, filter, getAllType, getFoodsByType } from "@/api";
import { Form, FormProps, message } from "antd";
import ProductForm from "@/components/form/Form";
import ProductCard from "@/components/cart/ProductCard";
import axios from "axios";
import { API_URL, getUrlUpdateUserImg } from "@/utils";
import AddIcon from "@mui/icons-material/Add";
import SkeletonCard from "@/components/skeleton/Skeleton";
import { SearchBar } from "@/components/search/SearchBar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FormSoft from "@/components/form/FormSoft";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DataType, Product } from "@/types";
import { useTranslation } from "react-i18next";
interface SettingsProps {
  listFoods: Product[]; // This prop is an array of Product
}
const Settings: React.FC<SettingsProps> = ({ listFoods }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [foods, setFoods] = useState<Product[]>(listFoods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>(
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fvinhhanhfood.com%2Fcach-uop-thit-de-nuong-ngon%2F&psig=AOvVaw2dHPqGj-JdY4MMhLxafAtt&ust=1723004978434000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjqyu7D34cDFQAAAAAdAAAAABAJ"
  );
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isSubmitFilter, setIsSubmitFilter] = useState<boolean>(false);
  const [allType, setAllType] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loadingGetMoreData, setLoadingGetMoreData] = useState<boolean>(false); // Separate loading state for fetching more data
  const fetchingMoreData = useRef<boolean>(false);
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isProductImageUploaded, setIsProductImageUploaded] =
    useState<boolean>(false);
  const [data, setData] = useState<DataType>({
    name: "",
    price: 0,
    description: "",
    type: "",
    picture: "",
  });
  useEffect(() => {
    getData();
    fetchTypes();
  }, []);
  const handleScroll = useCallback(
    debounce(() => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollPosition =
        window.scrollY ||
        window.pageYOffset ||
        document.body.scrollTop +
          (document.documentElement && document.documentElement.scrollTop) ||
        0;
      const scrollDifference = documentHeight - viewportHeight - scrollPosition;
      if (
        scrollDifference < 1000 &&
        !fetchingMoreData.current &&
        !loadingGetMoreData &&
        !isMaxPage
      ) {
        fetchingMoreData.current = true;
        getMoreData();
      }
    }, 200),
    [page, loadingGetMoreData, isMaxPage]
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && foods.length === 0) {
        setShowNotFound(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [loading, foods]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, handleScroll]);
  const fetchTypes = async () => {
    try {
      const types = await getAllType();
      const uniqueTypes = types.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      setAllType(uniqueTypes);
    } catch (error) {
      console.error("Failed to fetch types:", error);
    }
  };
  const getData = async () => {
    setLoading(true);
    try {
      const fetchedFoods = await fetchFoodsData(1);
      setIsMaxPage(false);
      setFoods(fetchedFoods);
      fetchingMoreData.current = false;
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  const getMoreData = async () => {
    setLoadingGetMoreData(true);
    try {
      const nextPage = page + 1;
      const fetchedFoods = await fetchFoodsData(nextPage);
      if (fetchedFoods.length === 0) {
        setIsMaxPage(true);
      } else {
        setFoods((prevFoods) => [...prevFoods, ...fetchedFoods]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to fetch more data:", error);
    } finally {
      setLoadingGetMoreData(false); // Reset loading state
      fetchingMoreData.current = false;
    }
  };
  const showFilterForm = () => {
    setActiveButton("filter");
    setIsFilter((pre) => !pre);
  };
  const onFinishFilter: FormProps["onFinish"] = async (values) => {
    setIsSubmitFilter(true);
    try {
      const filteredData = await filter(parseInt(values.price));
      setIsFilter(false);
      setIsSubmitFilter(false);
      setFoods(filteredData.data);
      setIsMaxPage(true);
    } catch (error) {
      console.error("Error fetching filtered foods:", error);
    }
  };
  const showModal = async (id: number) => {
    setIsModalOpen(true);
    setCurrentId(id);
    if (id !== 0) {
      try {
        const foodDetails = await axios.get(`${API_URL}/foods/${id}`);
        form.setFieldsValue(foodDetails.data);
        setImageUrl(foodDetails.data?.picture);
        setFileList([{ url: foodDetails.data.picture }]);
        setIsMaxPage(true);
      } catch (error) {
        console.error("Failed to fetch food details:", error);
      }
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsProductImageUploaded(false);
    form.resetFields();
  };
  const onFinish: FormProps["onFinish"] = async (values) => {
    setLoadingButton(true);
    try {
      const uploadedImageUrl = await getUrlUpdateUserImg(fileList[0]);
      const newData: DataType = {
        name: values.name,
        price: values.price,
        description: values.description,
        type: values.type,
        picture: uploadedImageUrl,
      };
      setLoadingButton(false);
      createOrUpdateFood(newData);
      setData(newData);
      fetchTypes();
    } catch (error) {
      message.error("Image upload failed. Please try again.");
      setLoading(false);
      setLoadingButton(false);
    }
    setIsModalOpen(false);
  };
  const createOrUpdateFood = async (data: DataType) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("picture", data.picture);
      if (currentId === 0) {
        await axios.post(API_URL + "/foods", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Food item created successfully!");
      } else {
        await axios.put(`${API_URL}/foods/${currentId}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        message.success("Food item updated successfully!");
      }
      fetchingMoreData.current = false;
      getData();
      setLoading(false);
      setPage(1);
      setIsMaxPage(false);
    } catch (error: any) {
      message.error("Failed to create or update food item.");
      console.log(error.message);
      setLoading(false);
    }
  };
  const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    message.error("Failed to submit form!.");
  };
  const handleChange = (info: any) => {
    console.log(info);
    setFileList([info]);
    setImageUrl(info.name);
  };

  const uniqueTypes = allType.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  const handleClick = async (type: string) => {
    setLoading(true);
    try {
      const results = await getFoodsByType(type);
      setFoods(results);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };
  const handleClickAll = () => {
    setActiveButton("all");
    getData();
    setIsMaxPage(false);
  };
  const handleButtonClick = (type: string) => {
    setActiveButton(type); // Set the clicked button as active
    handleClick(type); // Call the click handler
    setIsMaxPage(true);
  };
  return (
    <div className="flex w-full">
      <div className={`w-full rounded-lg ${theme}`}>
        <>
          <div className="flex items-center justify-between overflow-hidden sm:pr-0 w-full m-2 ml-0  flex-wrap">
            <div
              className={`${theme} flex items-center justify-between py-6 sm:py-16 flex-wrap`}
            >
              <span className="sm:text-2xl sm:ml-3 font-bold text-black ">
                {t('settings.title')}
              </span>
            </div>
            <div className="flex items-center w-full sm:w-1/2 mb-5 sm:mb-0">
              <SearchBar setProducts={setFoods} />
            </div>
          </div>
          <div className="flex justify-between mb-4 flex-wrap gap-3">
            <div className="scroll-container p-2 flex sm:gap-3 gap-1.5 justify-start items-center overflow-x-auto whitespace-nowrap">
              <button
                type="button"
                className={`text-black hover:bg-green-100 px-3 py-2 active:bg-green-400 rounded box-shadow ${
                  activeButton === "all" ? "bg-green-400" : ""
                }`}
                onClick={handleClickAll}
              >
                {t('settings.buttonAll')}
              </button>
              {uniqueTypes.map((type, index) => (
                <button
                  type="button"
                  key={index}
                  value={type}
                  className={`text-black hover:bg-green-100 px-3 py-2 ${
                    activeButton === type ? "bg-green-400" : ""
                  } rounded box-shadow`}
                  onClick={() => handleButtonClick(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex justify-end items-center gap-2">
              <button
                onClick={showFilterForm}
                className={`${
                  activeButton === "filter" ? "bg-green-400" : ""
                } text-black hover:bg-green-100 px-3 py-2 active:bg-green-400 rounded box-shadow`}
              >
                <FilterAltIcon />
              </button>
              {currentUser?.role_id == 1 ? (
                <button
                  type="button"
                  className={` box-shadow px-4 py-2 active:bg-green-500 text-black hover:bg-green-100 rounded`}
                  onClick={() =>
                    token
                      ? showModal(0)
                      : message.error("You need to login first!")
                  }
                >
                  <AddIcon />
                </button>
              ) : null}
            </div>
          </div>
        </>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-wrap p-2 relative">
          <FormSoft
            loading={isSubmitFilter}
            onFinish={onFinishFilter}
            handleCancel={showFilterForm}
            open={isFilter}
          />
          {loading ? (
            [...Array(10)].map((_, index) => <SkeletonCard key={index} />)
          ) : foods.length === 0 ? (
            showNotFound ? (
              <div className="absolute text-black flex items-center justify-center w-full text-center sm:text-3xl">
                <h1>Product not found</h1>
              </div>
            ) : null
          ) : (
            foods.map((food, index) => (
              <React.Fragment key={index}>
                <ProductForm
                  id={food.id}
                  open={isModalOpen}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  handleCancel={handleCancel}
                  form={form}
                  imageUrl={imageUrl}
                  fileList={fileList}
                  handleChange={handleChange}
                  loading={loadingButton}
                  types={allType}
                  checkTypeForm={currentId}
                  isUpload={isProductImageUploaded}
                />
                <ProductCard
                  openModal={() => showModal(food.id)}
                  key={food.id}
                  getData={getData}
                  params={food}
                />
              </React.Fragment>
            ))
          )}
          {loadingGetMoreData &&
            !isMaxPage &&
            [...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </div>
    </div>
  );
};
export default Settings;
