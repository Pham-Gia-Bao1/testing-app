"use client";
import TablePost from "@/components/table/Table";
import React, { useEffect, useState } from "react";
export default function Notifications() {
  return (
    <main className="flex flex-col items-center justify-betwee bg-white h-full">
      <div className="flex-1 p-6 bg-gray-800 text-white w-full h-full">
        <h1 className="text-2xl mb-4">Settings</h1>
        <div className="flex">
          <div className="flex-1 bg-gray-700 p-4 rounded-lg">
            <TablePost />
          </div>
        </div>
      </div>
    </main>
  );
}
