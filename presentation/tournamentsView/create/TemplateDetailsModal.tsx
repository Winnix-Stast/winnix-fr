import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomModal } from '@/presentation/theme/components';

interface TemplateDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTemplate: any;
}

export const TemplateDetailsModal = ({
  visible,
  onClose,
  selectedTemplate,
}: TemplateDetailsModalProps) => {
  return (
    <CustomModal visible={visible} onClose={onClose} contentStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <WinnixIcon
            name='document-text-outline'
            size={24}
            color={Colors.brand_primary}
          />
          <Text style={styles.modalTitle}>Reglas Base de la Plantilla</Text>
        </View>

        <Text style={styles.templateName}>{selectedTemplate?.name}</Text>
        <Text style={styles.templateDescription}>{selectedTemplate?.description}</Text>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <WinnixIcon name='people-outline' size={20} color={Colors.text_secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Jugadores por equipo</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode='tail'>
              {selectedTemplate?.playersPerTeam || 'N/A'} jugadores
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <WinnixIcon name='time-outline' size={20} color={Colors.text_secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Duración del partido</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode='tail'>
              {selectedTemplate?.matchDuration || 'N/A'} minutos
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIconContainer}>
            <WinnixIcon name='star-outline' size={20} color={Colors.text_secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailLabel}>Sistema de Puntuación</Text>
            <Text style={styles.detailValue} numberOfLines={2} ellipsizeMode='tail'>
              Victoria: {selectedTemplate?.scoring?.win || 0} pts | Empate:{' '}
              {selectedTemplate?.scoring?.draw || 0} pts | Derrota:{' '}
              {selectedTemplate?.scoring?.loss || 0} pts
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
          <Text style={styles.closeModalButtonText}>ENTENDIDO</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.surface_elevated,
    borderRadius: 20,
    width: '85%',
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text_primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  templateName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.brand_primary,
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border_focus,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface_pressed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.text_tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_primary,
    marginTop: 2,
    flexShrink: 1,
  },
  closeModalButton: {
    backgroundColor: Colors.brand_primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: Colors.on_brand,
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
