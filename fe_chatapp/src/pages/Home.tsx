import React from "react";
import MainLayout from "../Layout/Mainlayout";
import Sidebar from "../components/Sidebar";

import { ProtectedRoutes } from "../components/ProtectedRoutes";
import AuthOverlay from "../components/AuthOverlay";
import ProfileSettings from "../components/ProfileSettings";

function Home() {
  return (
    <MainLayout>
    <>  
    <AuthOverlay/>
   <ProfileSettings/>

        <Sidebar />
       
        </>
    </MainLayout>
  );
}

export default Home;
