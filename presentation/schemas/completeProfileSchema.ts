import * as yup from "yup";

export const completeProfileSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d{7,10}$/, "El teléfono debe tener entre 7 y 10 dígitos")
    .required("El teléfono es requerido"),
  birthDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("La fecha de nacimiento es requerida")
    .max(new Date(), "La fecha no puede ser en el futuro"),
  roleType: yup.string().required("Debes seleccionar un rol"),
});

export type CompleteProfileFormData = yup.InferType<typeof completeProfileSchema>;
