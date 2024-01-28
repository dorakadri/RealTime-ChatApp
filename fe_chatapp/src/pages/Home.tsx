import React from "react";
import MainLayout from "../Layout/Mainlayout";
import Sidebar from "../components/Sidebar";

import { ProtectedRoutes } from "../components/ProtectedRoutes";
import AuthOverlay from "../components/AuthOverlay";

function Home() {
  return (
    <MainLayout>
    <>  
    <AuthOverlay/>
        <Sidebar />
        Home Page
        </>
    </MainLayout>
  );
}

export default Home;
