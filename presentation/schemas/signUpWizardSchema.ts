import * as yup from "yup";

export const signUpWizardSchema = yup.object({
  // Step 1: Credentials
  email: yup.string().email("Email inválido").required("El email es requerido"),
  username: yup.string().required("El usuario es requerido"),
  password: yup.string().min(7, "Mínimo 7 caracteres").required("La contraseña es requerida"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debes repetir la contraseña"),
  isChecked: yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones"),
  
  // Step 2: Profile
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

export type SignUpWizardData = yup.InferType<typeof signUpWizardSchema>;
