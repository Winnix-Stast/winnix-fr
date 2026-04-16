import React, { useEffect, useMemo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ModalRN from 'react-native-modal';
import { useCustomForm } from '@/hooks/useCustomForm';
import { useSports } from '@/presentation/hooks/sports/useSports';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton, CustomInput } from '@/presentation/theme/components/';

interface Props {
  visible: boolean;
  team: any;
  onClose: () => void;
  onSubmit: (data: TeamFormData) => void;
  isSubmitting: boolean;
}

export const TeamEditModal: React.FC<Props> = ({
  visible,
  team,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { control, handleSubmit, errors, reset } =
    useCustomForm<TeamFormData>(teamSchema);

  const { sports } = useSports();

  const sportOptions = useMemo(
    () => sports.map((s: any) => ({ label: s.name, value: s._id })),
    [sports],
  );

  useEffect(() => {
    if (visible && team) {
      reset({
        name: team.name,
        logo: team.logo || '',
        sport: team.sport?._id || team.sport || '',
      });
    }
  }, [visible, team]);

  const onValidSubmit = (data: TeamFormData) => {
    onSubmit(data);
  };

  return (
    <ModalRN
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn='fadeInUp'
      animationOut='fadeOutDown'
      backdropOpacity={0.8}
      style={styles.modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.container}>
              <Text style={styles.title}>Editar Equipo</Text>
              <Text style={styles.subtitle}>Actualiza los datos de tu escuadra</Text>

              <View style={styles.form}>
                <CustomInput
                  name='name'
                  control={control}
                  placeholder='Nombre del Equipo'
                  label='Nombre'
                  iconRight='pencil-outline'
                  errorMessage={errors.name?.message}
                />

                <CustomInput
                  name='logo'
                  control={control}
                  placeholder='URL del Logo (Opcional)'
                  label='Logo'
                  iconRight='image-outline'
                  errorMessage={errors.logo?.message}
                />

                <View style={styles.buttonRow}>
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      label='Cancelar'
                      onPress={onClose}
                      outline
                      disabled={isSubmitting}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomButton
                      label={isSubmitting ? 'Guardando...' : 'Actualizar'}
                      onPress={handleSubmit(onValidSubmit)}
                      icon='save-outline'
                      disabled={isSubmitting}
                    />
                  </View>
                </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 40,
  },
  container: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border_focus,
    padding: 24,
    width: '90%',
    maxWidth: '90%',
    minHeight: 400,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text_brand,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text_secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    minHeight: 55,
    alignItems: 'stretch',
  },
});
