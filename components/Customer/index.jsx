import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Button, Divider, Header, Input, Loader } from "../../ui-kit";
import { useRouter } from "next/router";
import { CustomerForm } from "../CustomerForm";
import { Bill } from "../Bill";
import { CashEntry } from "../CashEntry";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const Customer = ({ customerId }) => {
  const isMounted = useRef();
  const { user, error } = useUser();
  const [customer, setCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updateCustomer, setUpdateCustomer] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingBills, setLoadingBills] = useState(true);
  const [bills, setBills] = useState([]);
  const handleOnClose = () => {
    setUpdateCustomer(false);
    fetchData(customerId);
  };

  const fetchData = async (customerId) => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("customers")
      .select()
      .eq("id", customerId);
    if (error) {
      console.log(error);
    }
    if (Array.isArray(data) && data.length) {
      setCustomer({ ...data[0] });
    }
    setLoading(false);
  };

  const fetchBills = async (searchQuery) => {
    setLoadingBills(true);
    let query = supabaseClient
      .from("bills")
      .select()
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    if (searchQuery) {
      query.eq("bill_number", parseInt(searchQuery));
    }
    const { data, error } = await query;

    if (error) {
      console.log(error);
    }
    if (Array.isArray(data)) {
      setBills([...data]);
    }
    setLoadingBills(false);
  };

  useEffect(() => {
    if (user) {
      fetchData(customerId);
    }
  }, [user, customerId]);

  useEffect(() => {
    // if (!isMounted.current) return;
    const handler = setTimeout(() => {
      fetchBills(searchQuery);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <header>
        <Header
          header="Profile"
          body={
            <>
              <h1 className="mb-0 mt-2 font-size-xl">{customer.name}</h1>
              <p className="mb-0">{customer.description}</p>
              <p className="mb-0 mt-2 font-size-lg font-weight-bold">
                Credit Balance: ₹ {customer.balance}
              </p>
            </>
          }
          leftButton={{
            label: "Back",
            onClick: () => router.push("/customers"),
          }}
          rightButton={{
            label: "Update",
            onClick: () => setUpdateCustomer(true),
          }}
        />
      </header>
      <section className="container">
        <div className={styles.body}>
          <Input
            inputProps={{
              value: searchQuery,
              placeholder: "Search Bill Number",
              onChange: (e) => setSearchQuery(e.target.value),
              type: "text",
            }}
          />

          <ul
            className={
              "my-3 list-style-none p-0 w-100 d-flex flex-column row-gap-3"
            }
          >
            {loadingBills ? (
              <Loader />
            ) : bills.length ? (
              bills.map((bill) => (
                <li key={bill.id} className={styles.billCard}>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="my-2 font-size-sm">
                      Bill Number: <b>{bill.bill_number}</b>
                    </p>
                    <Button
                      variant="link"
                      size="small"
                      label="Details"
                      onClick={() =>
                        setSelectedBill({
                          billType: "bill",
                          bill,
                          ...customer,
                        })
                      }
                    />
                  </div>
                  <p className="mt-0 mb-2 font-size-xs">
                    {new Date(bill.created_at).toLocaleString("en-in", {
                      timeStyle: "short",
                      dateStyle: "medium",
                    })}
                  </p>
                  <Divider />

                  <div className="d-flex col-gap-3 justify-content-between">
                    <p className="my-1 font-size-sm">Total Amount</p>
                    <p className="me-2 my-1 font-size-sm">
                      ₹ {bill.total_amount}
                    </p>
                  </div>
                  <div className="d-flex col-gap-3 justify-content-between">
                    <p className="my-1 font-size-sm">Paid Amount</p>
                    <p className="me-2 my-1 font-size-sm">
                      ₹ {bill.paid_amount}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li>No Record Found!</li>
            )}
          </ul>
        </div>
      </section>

      <CustomerForm
        isActive={updateCustomer}
        type="update"
        formData={customer}
        onCancel={handleOnClose}
      />
      {selectedBill && selectedBill.billType === "bill" && (
        <Bill
          data={selectedBill}
          isActive
          onClose={(refetch) => {
            setSelectedBill(null);
            if (refetch) {
              fetchData(customerId);
              fetchBills("");
            }
          }}
        />
      )}
      {selectedBill && selectedBill.billType === "cashEntry" && (
        <CashEntry
          data={selectedBill}
          isActive
          onClose={() => setSelectedBill(null)}
        />
      )}
    </>
  );
};
