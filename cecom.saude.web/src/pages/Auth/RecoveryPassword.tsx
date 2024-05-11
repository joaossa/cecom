import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/Button/Button";
import { Container } from "../../components/Container";
import { InputPassword } from "../../components/Form";
import { Loading } from "../../components/Loading/Loading";
import background from "/loginBackground.svg";
import logo from "/logo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PasswordResolver } from "../../validations/Password";

type IPasswordForm = {
  password: string;
  confirmPassword: string;
};

export function RecoveryPassword() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: IPasswordForm) {
    try {
      setLoading(true);
      //const { data } = await login(values.email, values.password);
      console.log(values);
      toast.success("Senha criada com sucesso");
      navigate("/login");
    } catch (error: any) {
      toast.error("Erro ao criar nova senha");
    } finally {
      setLoading(false);
    }
  }

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasswordForm>({ resolver: PasswordResolver });

  return (
    <div className="bg-background-color">
      {loading ? (
        <Loading />
      ) : (
        <section className="flex justify-between max-lg:items-center ">
          <Container>
            <div className=" w-2/3 flex flex-col justify-center max-md:items-center">
              <img src={logo} alt="Logo CECOM" className="w-44" />
              <h1 className="text-gray-500 text-4xl font-semibold mt-16">
                Digite abaixo sua nova senha
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-8">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      errors={errors}
                      className="w-full mt-4"
                      placeholder="Nova senha"
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      errors={errors}
                      className="w-full mt-4"
                      placeholder="Confirme sua nova senha"
                    />
                  )}
                />

                <Button type="submit" className="w-full h-12 text-lg mt-6">
                  Concluir
                </Button>
              </form>
            </div>
          </Container>

          <img
            src={background}
            alt="Imagem de fundo"
            className="w-2/3 max-lg:hidden"
          />
        </section>
      )}
    </div>
  );
}
