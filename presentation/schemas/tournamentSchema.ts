import * as yup from 'yup';

const nullableNumber = yup
  .number()
  .optional()
  .nullable()
  .transform((value) => (isNaN(value) ? null : value));

const baseEditionSchema = yup.object().shape({
  tournament: yup.string().required('Debes seleccionar una marca'),
  seasonName: yup
    .string()
    .required('El nombre de la temporada es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  endDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .optional()
    .min(yup.ref('startDate'), 'Debe ser posterior a la fecha de inicio'),
  sport: yup.string().required('Debes seleccionar un deporte'),
  sportCategory: yup.string().optional(),
  sportTemplate: yup.string().required('Debes seleccionar una plantilla'),
  image: yup.string().optional(),
  logo: yup.string().optional(),
  playersPerTeam: nullableNumber,
  matchDuration: nullableNumber,
  scoring: yup
    .object()
    .shape({
      win: nullableNumber,
      draw: nullableNumber,
      loss: nullableNumber,
    })
    .optional(),
  config: yup.object().optional(),
  status: yup.string().optional().default('DRAFT'),
});

export const createEditionSchema = baseEditionSchema.shape({
  startDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('La fecha de inicio es requerida')
    .min(new Date(), 'La fecha de inicio no puede estar en el pasado'),
});

export const editEditionSchema = baseEditionSchema.shape({
  startDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('La fecha de inicio es requerida'),
});

export type CreateEditionFormData = yup.InferType<typeof createEditionSchema>;
export type EditEditionFormData = yup.InferType<typeof editEditionSchema>;
