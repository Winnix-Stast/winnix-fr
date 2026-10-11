import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  username: yup.string().optional(),
  email: yup.string().email('Correo electrónico inválido').optional(),
  nickname: yup.string().optional(),
  documentType: yup.string().optional(),
  idNumber: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .nullable()
    .optional(),
  country: yup.string().optional(),
  city: yup.string().optional(),
  neighborhood: yup.string().optional(),
  birthDate: yup.date().nullable().optional(),
  phoneNumber: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === '' ? null : value,
    )
    .nullable()
    .optional(),
  avatar: yup.mixed().nullable().optional(),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
