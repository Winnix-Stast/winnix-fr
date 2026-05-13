import * as yup from 'yup';

export const createEditionSchema = yup.object().shape({
  tournament: yup.string().required('Debes seleccionar una marca'),
  seasonName: yup
    .string()
    .required('El nombre de la temporada es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  startDate: yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('La fecha de inicio es requerida')
    .min(new Date(), 'La fecha de inicio no puede estar en el pasado'),
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
  // Overrides
  playersPerTeam: yup.number().optional(),
  matchDuration: yup.number().optional(),
  scoring: yup
    .object()
    .shape({
      win: yup.number().optional(),
      draw: yup.number().optional(),
      loss: yup.number().optional(),
    })
    .optional(),
  config: yup.object().optional(),
});

export type CreateEditionFormData = yup.InferType<typeof createEditionSchema>;
