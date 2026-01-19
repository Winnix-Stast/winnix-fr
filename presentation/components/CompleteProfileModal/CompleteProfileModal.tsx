import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import ModalRN from "react-native-modal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Colors, Fonts, ErrorMessage } from "@/presentation/styles/global-styles";
import { CustomInput } from "@/presentation/theme/components/CustomInput";
import { CustomButton } from "@/presentation/theme/components/CustomButton";
import { completeProfileSchema, CompleteProfileFormData } from "@/presentation/schemas/completeProfileSchema";
import { AuthAdapter, Role } from "@/core/auth/auth.adapter";

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export const CompleteProfileModal: React.FC<Props> = ({ visible, onComplete }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
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
      roleId: "",
    },
  });

  const selectedRoleId = watch("roleId");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await AuthAdapter.getRoles();
        // Filtrar solo los roles permitidos para usuarios
        const allowedRoles = rolesData.filter((role) =>
          ["player", "organizer", "referee"].includes(role.name.toLowerCase())
        );
        setRoles(allowedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  const onSubmit = async (data: CompleteProfileFormData) => {
    setSubmitting(true);
    try {
      await AuthAdapter.completeProfile({
        phone: parseInt(data.phone, 10),
        roleId: data.roleId,
      });
      onComplete();
    } catch (error) {
      console.error("Error completing profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleLabel = (role: Role) => {
    const labels: Record<string, string> = {
      player: "Jugador",
      organizer: "Organizador",
      referee: "Árbitro",
    };
    return role.label || labels[role.name.toLowerCase()] || role.name;
  };

  return (
    <ModalRN
      isVisible={visible}
      animationIn='fadeIn'
      animationOut='fadeOut'
      backdropOpacity={0.8}
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Completa tu perfil</Text>
        <Text style={styles.subtitle}>
          Necesitamos algunos datos adicionales para continuar
        </Text>

        <View style={styles.form}>
          <CustomInput
            name='phone'
            control={control}
            placeholder='3001234567'
            label='Número de teléfono'
            iconRight='call-outline'
            keyboardType='phone-pad'
            errorMessage={errors.phone?.message}
          />

          <View style={styles.rolesContainer}>
            <Text style={styles.rolesLabel}>Selecciona tu rol</Text>
            {loadingRoles ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <View style={styles.rolesList}>
                {roles.map((role) => (
                  <Pressable
                    key={role._id}
                    style={[
                      styles.roleOption,
                      selectedRoleId === role._id && styles.roleOptionSelected,
                    ]}
                    onPress={() => setValue("roleId", role._id)}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedRoleId === role._id && styles.radioOuterSelected,
                      ]}>
                      {selectedRoleId === role._id && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.roleText,
                        selectedRoleId === role._id && styles.roleTextSelected,
                      ]}>
                      {getRoleLabel(role)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.roleId && <Text style={ErrorMessage}>{errors.roleId.message}</Text>}
          </View>

          <CustomButton
            label={submitting ? "Guardando..." : "Continuar"}
            onPress={handleSubmit(onSubmit)}
            icon='arrow-forward-outline'
            disabled={submitting}
          />
        </View>
      </View>
    </ModalRN>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.dark,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: Fonts.extraLarge,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.small,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  rolesContainer: {
    gap: 10,
  },
  rolesLabel: {
    fontSize: Fonts.normal,
    color: Colors.light,
    fontWeight: "bold",
  },
  rolesList: {
    gap: 12,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    gap: 12,
  },
  roleOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDark2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: Fonts.normal,
    color: Colors.light,
  },
  roleTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
