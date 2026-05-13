import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Control } from 'react-hook-form';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { CreateEditionFormData } from '@/presentation/schemas/tournamentSchema';
import { Colors } from '@/presentation/styles/colors';
import { Fonts } from '@/presentation/styles/global-styles';
import { CustomSelect } from '@/presentation/theme/components';

interface SportSectionProps {
  control: Control<CreateEditionFormData>;
  sports: any[];
  categories: any[];
  templates: any[];
  loadingCategories: boolean;
  loadingTemplates: boolean;
  selectedSport?: string;
  selectedTemplateId?: string;
  onShowTemplateDetails: () => void;
  errors: any;
}

export const SportSection = ({
  control,
  sports,
  categories,
  templates,
  loadingCategories,
  loadingTemplates,
  selectedSport,
  selectedTemplateId,
  onShowTemplateDetails,
  errors,
}: SportSectionProps) => {
  const sportOptions = sports.map((s) => ({
    label: s.name,
    value: s._id,
  }));

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const templateOptions = templates.map((t) => ({
    label: t.name,
    value: t._id,
  }));

  const selectedTemplate = templates.find((t) => t._id === selectedTemplateId);

  return (
    <>
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Deporte y Reglas</Text>

      <CustomSelect
        name='sport'
        control={control}
        options={sportOptions}
        label='Deporte *'
        placeholder='Elige un deporte...'
        iconLeft='football-outline'
        errorMessage={errors.sport?.message}
      />

      {selectedSport && categoryOptions.length > 0 && (
        <CustomSelect
          name='sportCategory'
          control={control}
          options={categoryOptions}
          label='Modalidad (opcional)'
          placeholder={loadingCategories ? 'Cargando...' : 'Elige modalidad...'}
          iconLeft='layers-outline'
          disabled={loadingCategories}
        />
      )}

      {selectedSport && (
        <View>
          <CustomSelect
            name='sportTemplate'
            control={control}
            options={templateOptions}
            label='Plantilla de Reglas *'
            placeholder={
              loadingTemplates ? 'Cargando plantillas...' : 'Elige una plantilla...'
            }
            iconLeft='document-text-outline'
            disabled={loadingTemplates || templateOptions.length === 0}
            errorMessage={errors.sportTemplate?.message}
          />

          {selectedTemplateId && selectedTemplate && (
            <TouchableOpacity
              style={styles.templateDetailsLink}
              onPress={onShowTemplateDetails}
            >
              <WinnixIcon
                name='information-circle-outline'
                size={18}
                color={Colors.brand_primary}
              />
              <Text style={styles.templateDetailsLinkText}>
                Ver reglas base de la plantilla
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Fonts.normal,
    fontWeight: '600',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 5,
    marginBottom: 5,
  },
  templateDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 4,
  },
  templateDetailsLinkText: {
    fontSize: Fonts.small,
    color: Colors.brand_primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
