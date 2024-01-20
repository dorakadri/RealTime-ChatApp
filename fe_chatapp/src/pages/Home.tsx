import React from "react";
import MainLayout from "../Layout/Mainlayout";
import Sidebar from "../components/Sidebar";
import { ProtectedRoutes } from "../components/ProtectedRoutes";

function Home() {
  return (
    <MainLayout>
      <ProtectedRoutes>
        <Sidebar />
        Home page
      </ProtectedRoutes>
    </MainLayout>
  );
}

export default Home;
