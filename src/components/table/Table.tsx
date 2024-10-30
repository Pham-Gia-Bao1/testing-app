import React, { useEffect, useState } from "react";
import { Form, Table } from "antd";
import { getAllPost } from "@/api";
interface Post {
  id: number;
  title: string;
}
const TablePost: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getPosts();
  }, []);
  const getPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllPost();
      console.log(fetchedPosts + 'posts')
      // Assuming getAllPost() returns an array of posts
      if (Array.isArray(fetchedPosts)) {
        setPosts(fetchedPosts);
      } else {
        console.error("getAllPost() did not return an array:", fetchedPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
      editable: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: "90%",
      editable: true,
    },
  ];
  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record: Post) => ({
      record,
      inputType: col.dataIndex === "id" ? "number" : "text",
      dataIndex: col.dataIndex,
      title: col.title,
    }),
  }));
  return (
    <Form form={form} component={false}>
      <Table
        bordered
        dataSource={posts}
        columns={mergedColumns}
        rowClassName="editable-row"
        loading={loading}
        className="bg-dark"
      />
    </Form>
  );
};
export default TablePost;
