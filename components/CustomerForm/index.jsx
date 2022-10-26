import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { BottomPanel, Button, Input } from "../../ui-kit";
import classNames from "classnames";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { showNotification } from "../../utils";

const required = "This field is required";

export const CustomerForm = ({ formData, onCancel, isActive, type }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      id: formData?.id || "",
      name: formData?.name || "",
      location: formData?.location || "",
      description: formData?.description || "",
    },
  });
  const onSubmit = async (formData) => {
    const { name, location, description, initialBalance } = formData;
    if (type === "add") {
      const { data, error } = await supabaseClient
        .from("customers")
        .insert([{ name, location, description, balance: initialBalance }]);
      console.log(data, error);
      showNotification(data, error);
      reset();
    } else {
      const { error } = await supabaseClient
        .from("customers")
        .update({ name, location, description })
        .eq("id", formData.id);
      const data = error ? false : { message: "Updated data successfully!" };
      showNotification(data, error);
      onCancel();
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <BottomPanel isActive={isActive} onClose={handleCancel}>
      <div className={classNames(styles.container, "p-3")}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="m-0 text-center text-capitalize">
            {type} Customer Details
          </h3>
          <Input
            label="Name"
            inputProps={{ ...register("name", { required }), type: "text" }}
            error={errors.name}
            inputNodeActive={dirtyFields.name || type === "update"}
          />
          <Input
            label="Location"
            inputProps={{ ...register("location", { required }), type: "text" }}
            error={errors.location}
            inputNodeActive={dirtyFields.location || type === "update"}
          />
          {type === "add" && (
            <Input
              label="Initial Balance"
              inputProps={{
                ...register("initialBalance", { required }),
                type: "number",
              }}
              error={errors.initialBalance}
              inputNodeActive={dirtyFields.initialBalance}
            />
          )}
          <Input
            label="Description"
            error={errors.description}
            inputNodeActive={dirtyFields.description || type === "update"}
            inputNode={
              <textarea
                {...register("description", { required })}
                className={styles.descTextArea}
                rows={3}
              />
            }
          />
          <div className="d-flex gap-3">
            <Button
              className={"text-capitalize"}
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {type}
            </Button>
            <Button onClick={handleCancel} type="button" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </BottomPanel>
  );
};
