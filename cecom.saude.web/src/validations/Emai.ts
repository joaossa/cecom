import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const EmailSchema = yup.object({
  email: yup
    .string()
    .email("Preencha um e-mail válido")
    .required("Preencha o e-mail"),
});

export const EmailResolver = yupResolver(EmailSchema);
