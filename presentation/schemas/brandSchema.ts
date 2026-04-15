import * as yup from "yup";

export const createBrandSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre de la marca es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  logo: yup.string().optional(),
});

export type CreateBrandFormData = yup.InferType<typeof createBrandSchema>;
