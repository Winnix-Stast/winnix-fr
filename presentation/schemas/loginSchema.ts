import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});
