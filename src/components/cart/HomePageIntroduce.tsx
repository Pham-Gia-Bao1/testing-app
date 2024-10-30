import React from "react";
export default function HomePageIntroduce({content} : {
    content  : string
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
      <p>{content}</p>
    </div>
  );
}
