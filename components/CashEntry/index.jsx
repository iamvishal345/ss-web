import { useForm } from "react-hook-form";
import { AutoComplete, BottomPanel, Button, Header, Input } from "../../ui-kit";
import "./styles.module.scss";

const required = true;
export const CashEntry = ({ isActive, onClose }) => {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: { amount: "", type: "", remarks: "" },
    mode: "onChange",
  });

  const onSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <BottomPanel isActive={isActive} onClose={onClose}>
      <Header
        header="Add Cash Entry"
        body={<p className="mb-0">Customer Name</p>}
        leftButton={{ label: "Back", onClick: onClose }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="px-2 pb-2">
        <Input
          label="Amount"
          error={errors.amount}
          inputNodeActive={dirtyFields.amount}
          inputProps={{ type: "number", ...register("amount", { required }) }}
        />
        <AutoComplete
          inputProps={{
            ...register("type", { required }),
            type: "text",
            onChange: (value) => setValue("type", value),
            onBlur: () => {},
          }}
          options={[
            { value: "cashIn", label: "Cash In" },
            { value: "cashOut", label: "Cash Out" },
          ]}
          label={"Type"}
          error={errors.type}
        />
        <Input
          label="Remarks"
          error={errors.remarks}
          inputNodeActive={dirtyFields.remarks}
          inputProps={{ type: "text", ...register("remarks", { required }) }}
        />
        <div>
          <Button type="submit">Save</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </BottomPanel>
  );
};
