import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const CodeSchema = yup.object({
  code: yup
    .number()
    .required("Preencha a senha")
    .min(4, "O código deve ter 4 números")
    .max(4, "O código deve ter 4 números"),
});

export const CodeResolver = yupResolver(CodeSchema);
