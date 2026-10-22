import { FormProvider, useForm } from "react-hook-form";
import type { DefaultValues, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

import FormField from "./FormField";
import FormActions from "./FormActions";

import type {
  FormButton,
  FormFieldConfig,
} from "./types";

interface ReusableFormProps<T extends FieldValues> {
  fields: FormFieldConfig<T>[];

  buttons: FormButton[];

  defaultValues?: DefaultValues<T>;

  schema?: ZodType<T, any>;

  onSubmit: (data: T) => void | Promise<void>;

  isLoading?: boolean;

  className?: string;
}

const ReusableForm = <T extends FieldValues>({
  fields,
  buttons,
  defaultValues,
  schema,
  onSubmit,
  isLoading = false,
  className = "",
}: ReusableFormProps<T>) => {
  const methods = useForm<T>({
    defaultValues,
    resolver: schema
      ? zodResolver(schema)
      : undefined,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = methods;

  const handleFormSubmit = async (data: T) => {
    await onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={className}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              register={register}
              control={control}
              errors={errors}
              disabled={isLoading}
            />
          ))}
        </div>

        <FormActions
          buttons={buttons}
          isSubmitting={isSubmitting || isLoading}
        />
      </form>
    </FormProvider>
  );
};

export default ReusableForm;