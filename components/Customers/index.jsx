import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { Button, Divider, Header, Input, Loader } from "../../ui-kit";
import { CustomerForm } from "../CustomerForm";
import { Bill } from "../Bill";
import { CashEntry } from "../CashEntry";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const Customers = () => {
  const isMounted = useRef(false);
  const { user, error } = useUser();
  const [customers, setCustomers] = useState([]);
  const [addCustomer, setAddCustomer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleOnClose = () => setAddCustomer(false);
  const [addBill, setAddBill] = useState("");
  const [addCash, setAddCash] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (searchQuery = "") => {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("customers")
      .select()
      .order("created_at", { ascending: false })
      .ilike("name", `%${searchQuery}%`);
    if (error) {
      console.log(error);
    }
    if (Array.isArray(data)) {
      setCustomers([...data]);
    }
    setLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!isMounted.current) return;
    const handler = setTimeout(() => {
      fetchData(searchQuery);
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

  return (
    <>
      <header>
        <Header
          header="All Customers"
          rightButton={{
            label: "Add New",
            onClick: () => setAddCustomer(true),
          }}
        />
      </header>
      <section className="container">
        <Input
          inputProps={{
            value: searchQuery,
            placeholder: "Search All Customers",
            onChange: (e) => setSearchQuery(e.target.value),
            type: "search",
          }}
        />
        <ul
          className={classNames(
            "my-3 list-style-none p-0 w-100 d-flex flex-column row-gap-3"
          )}
        >
          {loading ? (
            <Loader />
          ) : customers.length ? (
            customers.map((customer) => (
              <li key={customer.id} className={styles.customerCard}>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="my-2">{customer.name}</p>
                  <Button
                    variant="link"
                    size="small"
                    label="Details"
                    onClick={() => router.push(`customer/${customer.id}`)}
                  />
                </div>
                <Divider />
                <div className="d-flex col-gap-3">
                  <Button onClick={() => setAddBill(customer)}>
                    Generate Bill
                  </Button>
                  <Button
                    onClick={() => setAddCash(customer)}
                    variant="secondary"
                  >
                    Cash Entry
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li>No Record Found!</li>
          )}
        </ul>
      </section>
      <CustomerForm
        isActive={addCustomer}
        type="add"
        onCancel={handleOnClose}
      />
      {addBill && (
        <Bill data={addBill} isActive onClose={() => setAddBill("")} />
      )}
      {addCash && (
        <CashEntry data={addCash} isActive onClose={() => setAddCash("")} />
      )}
    </>
  );
};
