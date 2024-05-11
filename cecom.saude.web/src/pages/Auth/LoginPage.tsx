import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Input, InputPassword } from "../../components/Form";
import { Loading } from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { Button } from "../../components/Button/Button";
import background from "/loginBackground.svg";
import logo from "/logo.svg";
import { Container } from "../../components/Container";
import { LoginResolver } from "../../validations/Login";

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: LoginForm) {
    try {
      setLoading(true);
      //const { data } = await login(values.email, values.password);
      console.log(values);
      toast.success("Login realizado com sucesso");
      navigate("/");
    } catch (error: any) {
      toast.error("Usuário e/ou senha não encontrado");
    } finally {
      setLoading(false);
    }
  }

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: LoginResolver,
  });
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
                Bem-vindo!
              </h1>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-8">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      errors={errors}
                      className="w-full"
                      type="email"
                      placeholder="E-mail"
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      {...field}
                      errors={errors}
                      className="w-full mt-4"
                      placeholder="Senha"
                    />
                  )}
                />

                <Button type="submit" className="w-full h-12 text-lg mt-6">
                  Entrar
                </Button>

                <div className="flex justify-evenly text-blue-color mt-2 text-base">
                  <span
                    className="cursor-pointer"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Recuperar acesso
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="cursor-pointer">Criar conta</span>
                </div>
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
