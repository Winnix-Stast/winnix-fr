import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";

import { brandsActions } from "@/core/brands/actions/brands-actions";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useCallback, useEffect, useState } from "react";

export const useOurTournaments = () => {
  const navigate = useRouter();

  const { control, handleSubmit, isSubmitting, isDisabled } = useCustomForm();

  const [viewSelected, setViewSelected] = useState("published");
  const [modalVisible, setModalVisible] = useState(false);
  const [ourTournaments, setOurTournaments] = useState<any[]>([]);

  const handleSearch = async (payload: string) => {
    try {
      const filter = {};
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleGetTournament = async () => {
    try {
      const response = await brandsActions.getMyBrandsAction();
      console.log("response  here coma si:>> ", response);
      if (response.length > 0) {
        console.log("here");
        setOurTournaments(response);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handdleChangeView = (type: string) => {
    setViewSelected(type);
  };

  const openModal = () => {
    setModalVisible(!modalVisible);
  };

  useFocusEffect(
    useCallback(() => {
      handleGetTournament();
    }, [viewSelected])
  );

  useEffect(() => {
    console.log("ourTournaments :>> ", ourTournaments);
  }, [ourTournaments]);

  return {
    //Props
    viewSelected,
    modalVisible,
    ourTournaments,

    //Methods
    control,
    handleSubmit,
    isSubmitting,
    isDisabled,
    navigate,
    Haptics,
    handdleChangeView,
    openModal,
  };
};
