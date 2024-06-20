import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Homepage from "./pages/Homepage";
import Layout from "./layout/Layout";
import Loginpage from "./pages/Loginpage";
import Resetpasswordpage from "./pages/Resetpasswordpage";
import Registerpage from "./pages/Registerpage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Loginpage />,
      },
      {
        path: "/register",
        element: <Registerpage />,
      },
      {
        path: "/resetpassword",
        element: <Resetpasswordpage />,
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
]);


function App() {
  return (
    <>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
    </>
  );
}

export default App;
