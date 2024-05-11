import { Controller, useForm } from "react-hook-form";
import { Input } from "../../../components/Form";
import { useAuthContext } from "../../../contexts/Auth";

import { CodeResolver } from "../../../validations/Code";

type CodeForm = {
  code: number;
};

export function EmailCode() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeForm>({ resolver: CodeResolver });

  async function onSubmit(values: CodeForm) {
    console.log(values);
  }

  const { setIsVerifyEmail } = useAuthContext();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-8">
      <h1 className="text-gray-500 text-4xl font-semibold mt-16">
        Verifique seu e-mail
      </h1>
      <p className="mt-4">
        Insira o código que enviamos para profissional01@cecom.com
      </p>

      <Controller
        name="code"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            errors={errors}
            className="w-full mt-10"
            type="number"
            placeholder=""
            maxLength={4}
          />
        )}
      />
      <div className="flex gap-4 text-blue-color mt-2 text-base">
        <span
          className="cursor-pointer"
          onClick={() => setIsVerifyEmail(false)}
        >
          Voltar
        </span>
        <span className="text-slate-300">|</span>
        <span className="cursor-pointer">Reenviar código</span>
      </div>
    </form>
  );
}
