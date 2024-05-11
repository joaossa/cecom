import { Container } from "../../components/Container";
import { Loading } from "../../components/Loading/Loading";
import background from "/loginBackground.svg";
import logo from "/logo.svg";
import { useAuthContext } from "../../contexts";
import { EmailCode, EmailVerify } from "./Components";

export function ForgotPassword() {
  const { loading, isVerifyEmail } = useAuthContext();

  return (
    <div className="bg-background-color">
      {loading ? (
        <Loading />
      ) : (
        <section className="flex justify-between max-lg:items-center ">
          <Container>
            <div className="w-2/3 flex flex-col justify-center max-md:items-center">
              <img src={logo} alt="Logo CECOM" className="w-44" />
              {isVerifyEmail ? <EmailCode /> : <EmailVerify />}
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
