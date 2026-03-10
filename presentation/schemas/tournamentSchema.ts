import * as yup from "yup";

export const createTournamentSchema = yup.object().shape({
  name: yup.string().required("El nombre del torneo es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres"),
  start_date: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("La fecha de inicio es requerida")
    .min(new Date(), "La fecha de inicio no puede estar en el pasado"),
  end_date: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .required("La fecha final es requerida")
    .min(yup.ref("start_date"), "Debe ser posterior a la fecha de inicio"),
  max_teams: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Obligatorio")
    .min(2, "Mínimo 2 equipos"),
  incremental: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("El premio/costo es obligatorio")
    .min(0, "No puede ser menor a 0"),
  image: yup.string().optional(),
  logo: yup.string().optional(),
  sponsors: yup.array().of(yup.string().required()).optional().default([]),
  rulesType: yup.string().oneOf(["text", "document"]).default("text").optional(),
  rules: yup.string().optional(),
  rulesDocument: yup.string().optional(),
});

export type CreateTournamentFormData = yup.InferType<typeof createTournamentSchema>;
