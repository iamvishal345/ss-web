import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import {
  BottomPanel,
  Button,
  Divider,
  Header,
  Input,
  Modal,
} from "../../ui-kit";
import { v4 as uuidV4 } from "uuid";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { showNotification } from "../../utils";

const required = true;
export const Bill = ({ isActive, onClose, data }) => {
  const [fullyPaid, setFullyPaid] = useState(false);
  const [items, setItems] = useState([]);
  const [saveModal, setSaveModal] = useState("");
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { dirtyFields, errors },
  } = useForm({
    defaultValues: { name: "", unitPrice: "", quantity: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!data.bill) return;
    setItems([...data.bill.items]);
  }, [data]);

  const updateItem = (formData) => {};

  const addItem = ({ name, quantity, unitPrice }) => {
    const Item = {
      id: uuidV4(),
      name: name,
      quantity: quantity,
      unitPrice: unitPrice,
      totalAmount: unitPrice * quantity,
    };
    setItems((data) => [...data, Item]);
    reset();
  };

  const removeItem = (removeId) => {
    const filteredItems = items.filter(({ id }) => id !== removeId);
    setItems(filteredItems);
  };

  const onSubmit = (formData) => {
    if (formData.id) {
      updateItem(formData);
    } else {
      addItem(formData);
    }
  };

  const getTotalAmount = useCallback(() => {
    return items.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [items]);

  const generateBill = async () => {
    const billObj = {
      is_freezed: saveModal === "freeze",
      items,
      total_amount: getTotalAmount(),
      paid_amount:
        saveModal === "freeze" ? parseInt(getValues("paidAmount")) : 0,
      customer_id: data.id,
    };
    const billQuery = supabaseClient.from("bills");
    if (data.bill.id) {
      billQuery.update(billObj).eq("id", data.bill.id);
    } else {
      billQuery.insert(billObj);
    }
    const { data: billData, error } = await billQuery;

    if (!error) {
      if (
        saveModal === "freeze" &&
        getTotalAmount() !== parseInt(getValues("paidAmount"))
      ) {
        const balance = getTotalAmount() - parseInt(getValues("paidAmount"));
        const { data: customerData, error: customerError } =
          await supabaseClient
            .from("customers")
            .select("balance,id")
            .eq("id", data.id);
        console.log(customerData, customerError);
        const finalBalance = customerData[0].balance - balance;
        const { data: saveData, error } = await supabaseClient
          .from("customers")
          .update({ balance: finalBalance })
          .eq("id", data.id);
        showNotification(saveData, error);
        if (!error) {
          onClose();
        }
      } else {
        showNotification(billData, error);
        onClose(true);
      }
    } else {
      showNotification(billData, error);
      onClose();
    }
  };

  useEffect(() => {
    if (fullyPaid) {
      setValue("paidAmount", getTotalAmount());
    } else {
      setValue("paidAmount", 0);
    }
  }, [fullyPaid, setValue, getTotalAmount]);

  return (
    <BottomPanel
      isActive={isActive}
      fullPage
      className=" d-flex flex-column mb-2"
    >
      <Header
        header="Generate Bill"
        body={<p className="mb-0">{data.name}</p>}
        leftButton={{ label: "Back", onClick: onClose }}
      />
      <div className="flex-fill px-2 font-size-xs d-flex flex-column">
        <div
          className={classNames(styles.itemsList, {
            [styles.removeLast]: data?.bill?.is_freezed,
          })}
        >
          {items.length > 0 ? (
            <>
              <p className={styles.heading}>Item Name</p>
              <p className={styles.heading}>Qty X Unit Price</p>
              <p className={styles.heading}>Total Amount</p>
              <p>&shy;</p>
              <Divider className={styles.fullSpan} />
            </>
          ) : (
            <div className={styles.noItems}>No Items Added</div>
          )}

          {items.map(({ id, name, quantity, unitPrice }, i) => (
            <React.Fragment key={id}>
              <p>{name}</p>
              <p>{quantity + " X " + unitPrice}</p>
              <p>₹ {quantity * unitPrice}</p>
              {!data?.bill?.is_freezed && (
                <Button
                  className="align-self-center"
                  size="small"
                  variant="link"
                  onClick={() => {
                    removeItem(id);
                  }}
                >
                  Remove
                </Button>
              )}
              <Divider className={styles.fullSpan} />
            </React.Fragment>
          ))}
        </div>
        {!data?.bill?.is_freezed && (
          <div className={styles.bottomContainer}>
            <div className="d-flex col-gap-3">
              <Button
                disabled={!items.length}
                type="button"
                onClick={() => {
                  setSaveModal("save");
                }}
              >
                Save
              </Button>
              <Button
                disabled={!items.length}
                type="button"
                onClick={() => {
                  setSaveModal("freeze");
                }}
                variant="secondary"
              >
                Freeze
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                inputProps={{
                  ...register("name", { required }),
                  type: "text",
                  placeholder: "Item Name",
                }}
                error={errors.name}
                inputNodeActive={dirtyFields.name}
              />
              <div className="d-flex col-gap-2">
                <Input
                  inputProps={{
                    ...register("quantity", { required }),
                    type: "number",
                    placeholder: "Quantity",
                  }}
                  error={errors.quantity}
                  inputNodeActive={dirtyFields.quantity}
                />
                <Input
                  inputProps={{
                    ...register("unitPrice", { required }),
                    type: "text",
                    placeholder: "Per Unit Price",
                  }}
                  error={errors.unitPrice}
                  inputNodeActive={dirtyFields.unitPrice}
                />
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </div>
        )}
        {data?.bill?.is_freezed && (
          <div className={styles.bottomContainer}>
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between font-size-lg">
                <p className="mb-1 mt-1">Total Amount:</p>
                <p className="mb-3 mt-1">₹ {data.bill.total_amount}</p>
              </div>
              <div className="d-flex justify-content-between font-size-lg">
                <p className="mb-1 mt-1">Paid Amount:</p>
                <p className="mb-3 mt-1">₹ {data.bill.paid_amount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {saveModal && (
        <Modal
          showCloseButton={false}
          header={
            <>
              <p
                className={classNames(
                  styles.modalHeader,
                  "d-flex col-gap-3 align-items-center m-0 px-3 pb-2"
                )}
              >
                <i className={classNames(styles.modalIcon, "gg-info")}></i>
                <b>Confirm</b>
              </p>
              <Divider />
            </>
          }
          body={
            <div className="px-3 text-center">
              <p>You are about to {saveModal} this bill.</p>
              <p>
                {saveModal === "save"
                  ? "You can edit this bill in customers details section."
                  : "You will not be able to edit this bill after freezing."}
              </p>
              {saveModal === "freeze" && (
                <>
                  <label className="d-flex gap-2 font-weight-bold align-items-center">
                    <input
                      style={{ zoom: "1.5" }}
                      type="checkbox"
                      name="fullyPaid"
                      id="fullyPaid"
                      checked={fullyPaid}
                      value={fullyPaid}
                      onChange={() => setFullyPaid(!fullyPaid)}
                    />
                    <div> Fully Paid</div>
                  </label>
                  <Input
                    disabled
                    inputProps={{
                      ...register("paidAmount", { required }),
                      type: "number",
                      placeholder: "Paid Amount",
                      disabled: fullyPaid,
                    }}
                    inputNodeActive
                  />
                </>
              )}
            </div>
          }
          footer={
            <div className="d-flex col-gap-3 px-3">
              <Button
                className="text-capitalize"
                type="button"
                onClick={() => {
                  generateBill();
                }}
              >
                {saveModal}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSaveModal("");
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          }
        />
      )}
    </BottomPanel>
  );
};
