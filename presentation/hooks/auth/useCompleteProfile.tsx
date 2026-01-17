import { useState } from "react";
import { router } from "expo-router";

export const useCompleteProfile = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const handleComplete = () => {
    setShowModal(false);
    router.replace("/winnix/tabs/dashboard");
  };

  return {
    showModal,
    openModal,
    handleComplete,
  };
};
