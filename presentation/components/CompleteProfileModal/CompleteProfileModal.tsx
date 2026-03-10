import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import ModalRN from "react-native-modal";

import { AuthAdapter } from "@/core/auth/auth.adapter";
import { CompleteProfileFormData, completeProfileSchema } from "@/presentation/schemas/completeProfileSchema";
import { Colors } from "@/presentation/styles/colors";
import { CustomButton, CustomDatePicker, CustomInput, CustomSelect } from "@/presentation/theme/components/";

export interface Role {
  _id?: string;
  name: string;
  label?: string;
}

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export const CompleteProfileModal: React.FC<Props> = ({ visible, onComplete }) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CompleteProfileFormData>({
    resolver: yupResolver(completeProfileSchema),
    defaultValues: {
      phone: "",
      roleType: "",
      birthDate: null as any,
    },
  });

  const selectedRoleType = watch("roleType");
  const birthDate = watch("birthDate");

  const roles = useMemo(() => {
    const defaultRoles = [
      { label: "Organizador", value: "organizer" },
      { label: "Capitán", value: "captain" },
      { label: "Jugador", value: "player" },
      { label: "Árbitro", value: "referee" },
    ];

    if (!birthDate) {
      return [
        { label: "Capitán", value: "captain" },
        { label: "Jugador", value: "player" },
      ];
    }

    const calculateAge = (dateString: Date) => {
      const today = new Date();
      const dob = new Date(dateString);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    };

    const userAge = calculateAge(birthDate as Date);

    if (userAge >= 18) {
      return defaultRoles;
    } else {
      return [
        { label: "Capitán", value: "captain" },
        { label: "Jugador", value: "player" },
      ];
    }
  }, [birthDate]);

  useEffect(() => {
    if (selectedRoleType) {
      const isValidRole = roles.find((r) => r.value === selectedRoleType);
      if (!isValidRole && setValue) {
        setValue("roleType", "");
      }
    }
  }, [roles, selectedRoleType, setValue]);

  const isRoleDisabled = !birthDate;

  const onSubmit = async (data: CompleteProfileFormData) => {
    setSubmitting(true);
    try {
      await AuthAdapter.completeProfile({
        phone: parseInt(data.phone, 10),
        roleType: data.roleType,
        birthDate: data.birthDate?.toISOString() as string,
      });
      onComplete();
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el perfil. Por favor, verifica tus datos de red e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalRN isVisible={visible} animationIn='fadeIn' animationOut='fadeOut' backdropOpacity={0.8} style={styles.modal}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled'>
            <View style={styles.container}>
              <Text style={styles.title}>Completa tu perfil</Text>
              <Text style={styles.subtitle}>Necesitamos algunos datos adicionales para continuar</Text>

              <View style={styles.form}>
                <CustomDatePicker name='birthDate' control={control} placeholder='YYYY-MM-DD' label='Fecha de Nacimiento' modalTitle='Selecciona tu fecha de nacimiento' errorMessage={errors.birthDate?.message} />

                <CustomInput name='phone' control={control} placeholder='3001234567' label='Número de teléfono' iconRight='call-outline' keyboardType='phone-pad' errorMessage={errors.phone?.message} />

                <CustomSelect name='roleType' disabled={isRoleDisabled} control={control} label='Rol' placeholder='Selecciona un rol' options={roles} iconLeft='person-outline' errorMessage={errors.roleType?.message} />

                <CustomButton label={submitting ? "Guardando..." : "Continuar"} onPress={handleSubmit(onSubmit)} icon='arrow-forward-outline' disabled={submitting} />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ModalRN>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40,
  },
  container: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.brand_primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text_secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
});
