import { Controller } from "react-hook-form";

import type { FieldValues } from "react-hook-form";

import type { FormFieldProps } from "./types";
import { ChevronDown } from "lucide-react";

const FormField = <T extends FieldValues>({
  field,
  register,
  control,
  errors,
  disabled: formDisabled,
}: FormFieldProps<T>) => {
  const error = errors[field.name];

  const errorMessage =
    error && typeof error.message === "string"
      ? error.message
      : undefined;

  const isDisabled = formDisabled || field.disabled;

  const wrapperClass =
    field.colSpan === 2
      ? "md:col-span-2"
      : "";

  // const inputClass =
  //   "w-full rounded-lg border border-transparent bg-[#d7e2ff] px-3 py-3 text-sm text-[#172033] outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className={`${wrapperClass} ${field.className ?? ""}`}>
      <label
        htmlFor={field.name}
        className="mb-2 block text-xs font-medium uppercase text-[#3f4658]"
      >
        {field.label}

        {field.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {field.type === "text" && (
        <input
          id={field.name}
          type="text"
          placeholder={field.placeholder}
          disabled={isDisabled}
          min={field.min}
          max={field.max}
          {...register(field.name)}
          className={`input-field-custom`}
        />
      )}

      {field.type === "email" && (
        <input
          id={field.name}
          type="email"
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...register(field.name)}
          className={`input-field-custom`}
        />
      )}

      {field.type === "password" && (
        <input
          id={field.name}
          type="password"
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...register(field.name)}
         className={`input-field-custom`}
        />
      )}

      {/* {field.type === "number" && (
        <input
          id={field.name}
          type="number"
          placeholder={field.placeholder}
          disabled={isDisabled}
          min={field.min}
          max={field.max}
          {...register(field.name)}
          className={inputClass}
        />
      )} */}

      {field.type === "date" && (
        <input
          id={field.name}
          type="date"
          disabled={isDisabled}
          min={field.min}
          max={field.max}
          {...register(field.name)}
          className={`input-field-custom `}
        />
      )}

      {field.type === "textarea" && (
        <textarea
          id={field.name}
          placeholder={field.placeholder}
          disabled={isDisabled}
          {...register(field.name)}
          className={`input-field-custom min-h-32 resize-none`}
        />
      )}

      {field.type === "select" && (
        <div className="relative">
          <select
            id={field.name}
            disabled={isDisabled}
            {...register(field.name)}
            className={`input-field-custom appearance-none pr-10`}
          >
            <option value="">
              {field.placeholder ?? "Select"}
            </option>

            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

               <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2"
        size={18}
      />
        </div>
      )}

      {/* {field.type === "checkbox" && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={isDisabled}
            {...register(field.name)}
          />

          <span className="text-sm">
            {field.placeholder}
          </span>
        </label>
      )} */}

      {field.type === "custom" && field.render && (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) =>
            field.render!({
              value: controllerField.value,
              onChange: controllerField.onChange,
              onBlur: controllerField.onBlur,
              name: controllerField.name,
              error: errorMessage,
            }) ?? <></>
          }
        />
      )}

      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormField;