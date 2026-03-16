import React from "react";
import CustomerCard from "./CustomerCard";

export interface Customer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  ongoingProjects: number;
}

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const CustomerList: React.FC<Props> = ({ customers, onEdit, onDelete }) => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {customers.map((c) => (
        <CustomerCard
          key={c.id}
          {...c}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c)}
        />
      ))}
    </div>
  );
};

export default CustomerList;
