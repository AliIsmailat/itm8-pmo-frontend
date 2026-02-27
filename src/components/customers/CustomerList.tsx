import React from "react";
import CustomerCard from "./CustomerCard";

export interface Customer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  ongoingProjects: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface Props {
  customers: Customer[];
}

const CustomerList: React.FC<Props> = ({ customers }) => {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {customers.map((c) => (
        <CustomerCard key={c.id} {...c} />
      ))}
    </div>
  );
};

export default CustomerList;
