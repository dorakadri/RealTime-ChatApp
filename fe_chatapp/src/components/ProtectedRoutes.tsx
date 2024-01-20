import React, { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { useGeneralStore } from "../stores/generalstore";

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userId = useUserStore((state) => state.id);
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal);
  useEffect(() => {
    if (!userId) {
      toggleLoginModal();
    }
  }, [userId, toggleLoginModal]);

  if (userId) {
    return children;
  }
  return <>Protected</>;
};

