import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ActivityIndicator, Alert, ScrollView, TextInput } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { stagesActions } from '@/core/stages/actions/stages-actions';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton } from '@/presentation/theme/components/CustomButton';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Flex } from '@/presentation/styles/global-styles';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  editionId: string;
}

export const CreateStageModal = ({ isVisible, onClose, editionId }: Props) => {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [stageName, setStageName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['stage-templates'],
    queryFn: stagesActions.getStageTemplatesAction,
  });

  const handleCreate = async () => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Debes seleccionar una plantilla.');
      return;
    }
    if (!stageName.trim()) {
      Alert.alert('Error', 'El nombre de la etapa es obligatorio.');
      return;
    }

    setIsCreating(true);
    try {
      await stagesActions.createStageAction({
        name: stageName,
        tournamentEdition: editionId,
        template: selectedTemplate._id,
        structure: selectedTemplate.structure,
        rules_config: selectedTemplate.rules_config,
      });
      
      Alert.alert('Éxito', 'Etapa creada correctamente.');
      queryClient.invalidateQueries({ queryKey: ['stages', editionId] });
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Ocurrió un error al crear la etapa.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <CustomText label="Crear Etapa" size={24} weight="bold" color={Colors.text_primary} />
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <WinnixIcon name="close-outline" size={24} color={Colors.text_secondary} />
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.brand_primary} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.form}>
                <CustomText label="1. Selecciona una Plantilla" size={16} weight="600" color={Colors.text_primary} />
                
                <View style={styles.templatesContainer}>
                  {templates?.map((template: any) => {
                    const isSelected = selectedTemplate?._id === template._id;
                    return (
                      <Pressable
                        key={template._id}
                        style={[styles.templateCard, isSelected && styles.templateCardSelected]}
                        onPress={() => setSelectedTemplate(template)}
                      >
                        <CustomText
                          label={template.name}
                          size={16}
                          weight="bold"
                          color={isSelected ? Colors.on_brand : Colors.text_primary}
                        />
                        <View style={{ marginTop: 8 }}>
                          <CustomText label={`Participantes: ${template.structure.participant_type}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                          <CustomText label={`Cupos: ${template.structure.total_slots}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                          <CustomText label={`Siembra: ${template.structure.seeding_logic}`} size={12} color={isSelected ? Colors.surface_base : Colors.text_secondary} />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {selectedTemplate && (
                  <View style={{ marginTop: 24, gap: 16 }}>
                    <CustomText label="2. Personaliza la Etapa" size={16} weight="600" color={Colors.text_primary} />
                    <TextInput
                      placeholder="Nombre (ej. Semifinal Apertura)"
                      placeholderTextColor={Colors.text_tertiary}
                      value={stageName}
                      onChangeText={setStageName}
                      style={styles.textInput}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <CustomButton
              label={isCreating ? "Creando..." : "Crear Etapa"}
              onPress={handleCreate}
              stylePressable={{ backgroundColor: Colors.brand_primary }}
              styleText={{ color: Colors.on_brand }}
              // disabled={isCreating || !selectedTemplate || !stageName.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 8, 25, 0.8)', // surface_screen with opacity
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.surface_base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    borderBottomWidth: 0,
  },
  header: {
    ...Flex.rowCenter,
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface_pressed,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: Colors.surface_elevated,
    borderRadius: 50,
  },
  form: {
    padding: 24,
    gap: 16,
  },
  templatesContainer: {
    gap: 12,
    marginTop: 8,
  },
  templateCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  templateCardSelected: {
    backgroundColor: Colors.brand_primary,
    borderColor: Colors.brand_primary,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surface_pressed,
    backgroundColor: Colors.surface_base,
  },
  textInput: {
    height: 50,
    backgroundColor: Colors.surface_elevated,
    borderColor: Colors.surface_pressed,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.text_primary,
    fontSize: 16,
  },
});
