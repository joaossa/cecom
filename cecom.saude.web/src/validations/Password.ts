import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const PasswordSchema = yup.object({
  password: yup
    .string()
    .required("Preencha a nova senha")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: yup
    .string()
    .required("Confirme sua nova senha")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

export const PasswordResolver = yupResolver(PasswordSchema);
