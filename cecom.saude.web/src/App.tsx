import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loading } from "./components/Loading/Loading";
import { PrivateRoutes } from "./routes";
import { Layout } from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/Auth";
import { ForgotPassword, LoginPage, RecoveryPassword } from "./pages/Auth";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/recovery-password",
      element: <RecoveryPassword />,
    },
    {
      element: <PrivateRoutes />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [],
        },
      ],
    },
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <ToastContainer className="toast" autoClose={3500} />
        <RouterProvider router={router} />;
      </AuthProvider>
    </Suspense>
  );
}

export default App;
