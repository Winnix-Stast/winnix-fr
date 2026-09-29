import { StyleSheet, Text, View } from 'react-native';
import { Control } from 'react-hook-form';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomImagePicker, CustomInput } from '@/presentation/theme/components';

interface PersonalizationSectionProps {
  control: Control<CreateEditionFormData>;
  errors: any;
}

export const PersonalizationSection = ({
  control,
  errors,
}: PersonalizationSectionProps) => {
  return (
    <View style={styles.container}>
      <CustomInput
        name='seasonName'
        control={control}
        placeholder='Ej. Copa Apertura 2026'
        label='Nombre del Torneo / Temporada *'
        iconRight='trophy-outline'
        errorMessage={errors.seasonName?.message}
      />

      <CustomInput
        name='fieldAddress'
        control={control}
        placeholder='Ej. Calle 100 #15-20, Canchas El Campín'
        label='Dirección de la Cancha / Sede'
        iconRight='location-outline'
        errorMessage={errors.fieldAddress?.message}
      />

      <View style={styles.imagesSection}>
        <Text style={styles.imagesTitle}>Fotos e Identidad Visual</Text>
        <Text style={styles.imagesSubtitle}>
          Personaliza cómo se verá tu campeonato en la aplicación.
        </Text>

        <View style={styles.imageBlock}>
          <Text style={styles.pickerTitle}>Foto de Portada (Banner Principal)</Text>
          <Text style={styles.pickerHelp}>
            Es la imagen amplia que los usuarios verán al ingresar al torneo.
          </Text>
          <CustomImagePicker
            name='image'
            control={control}
            label=''
            errorMessage={errors.image?.message}
            aspect={[16, 9]}
          />
        </View>

        <View style={styles.imageBlock}>
          <Text style={styles.pickerTitle}>Foto de Perfil (Logo del Torneo)</Text>
          <Text style={styles.pickerHelp}>
            Es el icono circular pequeño que se muestra en las tarjetas y listados.
          </Text>
          <View style={styles.logoPickerWrapper}>
            <CustomImagePicker
              name='logo'
              control={control}
              label=''
              errorMessage={errors.logo?.message}
              isRound={true}
              aspect={[1, 1]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  imagesSection: {
    marginTop: 4,
    gap: 12,
  },
  imagesTitle: {
    fontSize: Fonts.normal,
    fontWeight: '600',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 5,
  },
  imagesSubtitle: {
    fontSize: 14,
    color: Colors.text_tertiary,
    fontStyle: 'italic',
    marginTop: -4,
  },
  imageBlock: {
    gap: 4,
    marginTop: 4,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  pickerHelp: {
    fontSize: 14,
    color: Colors.text_tertiary,
    marginBottom: 4,
    lineHeight: 19,
  },
  logoPickerWrapper: {
    alignItems: 'center',
  },
});
