import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Users as UsersIcon, School } from "lucide-react";
import { PageHeading, Spinner } from "../components/ui/Atoms";
import { useAuth } from "../context/AuthContext";
import * as api from "../data/mockApi";

export default function ViewCustomer() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.listCustomers(user.clientId).then((res) => {
      if (mounted && res.ok) setCustomers(res.customers);
    });
    return () => {
      mounted = false;
    };
  }, [user.clientId]);

  return (
    <div>
      <PageHeading
        title="Customers"
        subtitle="Students registered under your account"
        action={
          <Link to="/customers/new" className="btn-primary">
            <Plus size={16} />
            Add Customer
          </Link>
        }
      />

      {customers === null ? (
        <div className="flex justify-center py-16">
          <Spinner className="w-6 h-6 text-primary-600" />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <CustomerRow key={c.id} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerRow({ customer }) {
  const fullName = [customer.studentFirstName, customer.studentMiddleName, customer.studentLastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-semibold shrink-0">
        {customer.studentFirstName?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 truncate">{fullName}</h3>
        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
          <School size={13} />
          {customer.schoolName} · Std {customer.standard}
          {customer.division ? customer.division : ""}
        </p>
      </div>
      <Link
        to={`/customers/${customer.id}/edit`}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-primary-600 shrink-0"
        aria-label={`Edit ${fullName}`}
      >
        <Pencil size={18} />
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <UsersIcon size={26} />
      </div>
      <h3 className="font-semibold text-slate-700">No customers yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        Get started by adding your first student record.
      </p>
      <Link to="/customers/new" className="btn-primary mt-5">
        <Plus size={16} />
        Add Customer
      </Link>
    </div>
  );
}
