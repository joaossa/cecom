import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/Button/Button";
import { Input } from "../../../components/Form";
import { EmailResolver } from "../../../validations/Emai";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../contexts";

type EmailForm = {
  email: string;
};

export function EmailVerify() {
  const { setIsVerifyEmail } = useAuthContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: EmailResolver,
  });

  async function onSubmit(values: EmailForm) {
    try {
      //setLoading(true);
      //const { data } = await login(values.email, values.password);
      console.log(values);
      toast.success("Email enviado com sucesso");
      //navigate("/");
      setIsVerifyEmail(true);
    } catch (error: any) {
      toast.error("Erro ao encontrar o usuário");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-8">
      {" "}
      <h1 className="text-gray-500 text-4xl font-semibold mt-16">
        Recuperar acesso
      </h1>
      <p className="mt-4">
        Instruções para redefinir sua senha serão enviadas para seu e-mail.
        Digite-o abaixo.
      </p>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            errors={errors}
            className="w-full mt-10"
            type="email"
            placeholder="E-mail"
          />
        )}
      />
      <Button type="submit" className="w-full h-12 text-lg mt-6">
        Continuar
      </Button>
    </form>
  );
}
