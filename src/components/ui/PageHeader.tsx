import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-black mb-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {description && <p className="text-gray-700">{description}</p>}
    </div>
  );
};

export default PageHeader;
