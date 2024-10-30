import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Định nghĩa kiểu Review
interface Review {
  id: number;
  content: string;
  author: string;
}

// Định nghĩa props cho ReviewsComponent
interface ReviewsComponentProps {
  reviews: Review[];
}

// Định nghĩa ReviewsComponent sử dụng React.FC với kiểu props
const ReviewsComponent: React.FC<ReviewsComponentProps> = ({ reviews }) => {
  const [reviewInput, setReviewInput] = useState("");
  const [reviewsData, setReviewData] = useState<Review[]>(reviews);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { t } = useTranslation();

  // Xử lý thay đổi trong trường nhập review
  const handleReviewInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReviewInput(event.target.value);
  };

  // Xử lý việc gửi review
  const handleReviewSubmit = () => {
    if (reviewInput.trim() === "") return;

    // Tạo một đối tượng review mới
    const newReview: Review = {
      id: reviewsData.length + 1, // Tạo ID mới
      content: reviewInput,
      author: currentUser?.name ?? t("Anonymous"), // Thay thế bằng dữ liệu tác giả thực tế nếu có
    };

    // Cập nhật trạng thái reviewsData
    setReviewData((prevReviews) => [newReview, ...prevReviews]);

    // Xóa trường nhập sau khi gửi
    setReviewInput("");
  };

  return (
    <div className="flex flex-col items-start gap-2 text-black w-full justify-between z-30">
      <div className="p-2 flex items-center justify-between gap-3 bg-gray-200 rounded w-full">
        <input
          type="text"
          value={reviewInput}
          onChange={handleReviewInputChange}
          className="border border-gray-100 rounded p-1 w-full"
          placeholder={t("review.placeholder")}
        />
        <button
          onClick={handleReviewSubmit}
          className="bg-blue-500 w-[25%] text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {t("review.addButton")}
        </button>
      </div>
      {reviewsData.slice(0, 10).map((poster) => (
        <div key={poster.id} className="p-2 bg-gray-100 w-full">
          <p>{poster.content}</p>
          <p className="text-sm text-gray-500">{poster.author}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsComponent;
