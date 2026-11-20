import { useCustomForm } from '@/hooks/useCustomForm';
import { TeamFormData, teamSchema } from '@/presentation/schemas/teamSchema';
import { Colors } from '@/presentation/styles/colors';
import { CustomInput } from '@/presentation/theme/components/';
import { CustomImagePicker } from '@/presentation/theme/components/CustomImagePicker';
import { AppModal } from '@/presentation/theme/components/CustomModal';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

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
    <AppModal
      visible={visible}
      onClose={onClose}
      showIcon={true}
      iconColor='#94A3B8'
      backdropOpacity={0.85}
      contentStyle={styles.modalContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ width: '100%' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <Text style={styles.title}>EDITAR EQUIPO</Text>
              <Text style={styles.subtitle}>Actualiza los datos de tu escuadra</Text>

              <View style={styles.form}>
                {/* Logo Image Picker desde Galería */}
                <CustomImagePicker
                  name='logo'
                  control={control}
                  label='Logo del Equipo'
                  aspect={[1, 1]}
                  isRound={true}
                  errorMessage={errors.logo?.message}
                />

                <CustomInput
                  name='name'
                  control={control}
                  placeholder='Nombre del Equipo'
                  label='Nombre'
                  iconRight='pencil-outline'
                  errorMessage={errors.name?.message}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={onClose}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelBtnText}>CANCELAR</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit(onValidSubmit)}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size='small' color='#000' />
                    ) : (
                      <Text style={styles.submitBtnText}>ACTUALIZAR</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#0C1432',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(40, 209, 195, 0.4)',
    width: '90%',
    maxWidth: 420,
    overflow: 'hidden',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    gap: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.brand_primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
