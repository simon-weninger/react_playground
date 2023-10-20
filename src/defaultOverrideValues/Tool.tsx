import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../components/form/Input";
import { ToolDummyData } from "./data";
import DefaultOverrideValueHOOKFORM from "./hookform/DefaultOverrideValueHOOKFORM";
import { TTool, ToolSchema } from "./types";

interface Tool2Props {}
/**
 * The Tool2 component
 * @param {Tool2Props} props
 * @return {ReactElement}
 */
const Tool = ({}: Tool2Props): JSX.Element => {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: JSON.parse(JSON.stringify(ToolDummyData)) as TTool,
    resolver: zodResolver(ToolSchema),
  });

  return (
    <>
      <div>hookform implementation</div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => alert(JSON.stringify(data)))}
        >
          <Input
            {...methods.register("name", {})}
            label="Name"
            error={!!methods.formState.errors.name?.message}
            helperText={methods.formState.errors.name?.message}
          />
          {open && (
            <DefaultOverrideValueHOOKFORM rootName={"constants.constant1"} />
          )}
          <button type="submit" className="p-2 bg-blue-400 rounded">
            Submit
          </button>
        </form>
      </FormProvider>

      <button
        className="p-2 bg-blue-400 rounded"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        toggle Open
      </button>
    </>
  );
};

export default Tool;
