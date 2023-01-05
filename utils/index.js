import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Se requiere ingresar email.").email("Email debe poseer un formato válido").label('Email'),
  password: Yup.string().required("Se requiere ingresar contraseña.")
  .min(6, ({ min }) => `La contraseña debe poseer al menos ${min} caracteres`).label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required("Se requiere ingresar email.")
  .email("Email debe poseer un formato válido").label('Email'),
  password: Yup.string().required("Se requiere ingresar contraseña.")
  .min(6, ({ min }) => `La contraseña debe poseer al menos ${min} caracteres`).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir.')
    .required('Se requiere confirmar la contraseña.')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Por favor, ingrese un email registrado.')
    .label('Email')
    .email('Ingrese un email válido.')
});
