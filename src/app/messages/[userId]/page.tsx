import React, { useEffect, useState } from "react";
import type { Metadata } from "next";
import { API_URL, LOGO } from "@/utils";
import { getUserById } from "@/api";
import MessageDetail from "./MessageDetail";
import { PropductProps } from "@/types";
type Props = {
  params: { userId: number };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = params;
  try {
    const response = await getUserById(userId);
    const recipientUser = response.data;
    return {
      title: recipientUser?.name ?? "Message Detail",
      description: "Texting with other recipients",
      icons: {
        icon: LOGO, // Use the .src property for the URL path
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      title: "Error",
      description: "Unable to fetch user data",
      icons: {
        icon: LOGO, // Use the .src property for the URL path
      },
    };
  }
}

const MessageDetailPage: React.FC<PropductProps> = ({ params }) => {
  return (
    <>
      <MessageDetail params={params} />
    </>
  );
};

export default MessageDetailPage;
