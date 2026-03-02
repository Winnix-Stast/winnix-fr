import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";

export const useCustomForm = <T extends FieldValues>(schema?: yup.ObjectSchema<T>) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    trigger,
    setValue,
  } = useForm<T>({
    resolver: schema ? (yupResolver(schema) as any) : undefined,
    mode: "onChange",
  });

  const isDisabled = Object.keys(errors).length > 0 || isSubmitting;

  return {
    control,
    handleSubmit,
    errors: errors as FieldErrors<T>,
    isSubmitting,
    isDisabled,
    watch,
    reset,
    trigger,
    setValue,
  };
};
