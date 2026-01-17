import * as yup from "yup";

export const completeProfileSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d{7,15}$/, "El teléfono debe tener entre 7 y 15 dígitos")
    .required("El teléfono es requerido"),
  roleId: yup.string().required("Debes seleccionar un rol"),
});

export type CompleteProfileFormData = yup.InferType<typeof completeProfileSchema>;
