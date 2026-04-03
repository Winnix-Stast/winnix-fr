import * as yup from "yup";

export const teamSchema = yup.object().shape({
  name: yup.string().required("El nombre del equipo es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres"),
  logo: yup.string().optional(),
  sport: yup.string().required("El deporte es obligatorio"),
});

export type TeamFormData = yup.InferType<typeof teamSchema>;
