import * as yup from "yup";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const signUpSchema = yup.object({
  email: yup.string().email("Email inválido").required("El email es requerido"),
  username: yup.string().required("El usuario es requerido"),
  password: yup.string().min(7, "Mínimo 7 caracteres").required("La contraseña es requerida"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debes repetir la contraseña"),
  isChecked: yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
});
