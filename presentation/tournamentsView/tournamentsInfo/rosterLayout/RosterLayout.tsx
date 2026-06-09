import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/presentation/styles/colors';
import { CustomText } from '@/presentation/theme/components/CustomText';

interface RosterLayoutProps {
  members: any[];
  loadingMembers: boolean;
  selectedPlayers: string[];
  jerseyNumbers: Record<string, string>;
  isSavingRoster: boolean;
  playersPerTeam: number;
  handleTogglePlayer: (playerId: string) => void;
  handleJerseyNumberChange: (playerId: string, val: string) => void;
  handleSaveRoster: () => Promise<void>;
}

export const RosterLayout = ({
  members,
  loadingMembers,
  selectedPlayers,
  jerseyNumbers,
  isSavingRoster,
  playersPerTeam,
  handleTogglePlayer,
  handleJerseyNumberChange,
  handleSaveRoster,
}: RosterLayoutProps) => {
  if (loadingMembers) {
    return (
      <ActivityIndicator
        size='large'
        color={Colors.brand_primary}
        style={styles.loader}
      />
    );
  }

  if (!members || members.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CustomText
          label='No hay jugadores registrados en tu equipo.'
          color={Colors.text_tertiary}
        />
      </View>
    );
  }

  const maxPlayers = playersPerTeam || 0;

  return (
    <View style={styles.container}>
      {/* Banner informativo de alerta */}
      <View style={styles.infoAlertBanner}>
        <View style={styles.infoAlertIconBox}>
          <Ionicons
            name='information-circle-outline'
            size={24}
            color={Colors.brand_primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomText
            label='INSCRIPCIÓN DE JUGADORES'
            size={12}
            weight='bold'
            color={Colors.brand_primary}
            style={styles.alertHeader}
          />
          <CustomText
            label={`Inscribe a los jugadores que participarán en este torneo. Puedes seleccionar hasta un máximo de ${maxPlayers} jugadores. Modificaciones adicionales están permitidas hasta la fecha estipulada por el organizador.`}
            size={12}
            color={Colors.text_secondary}
            style={styles.alertBody}
          />
        </View>
      </View>

      <CustomText
        label={`SELECCIONADOS: ${selectedPlayers.length} / ${maxPlayers}`}
        size={14}
        weight='bold'
        color={Colors.text_primary}
        style={styles.selectionCount}
      />

      {/* Lista de jugadores con scroll limitado */}
      <ScrollView
        style={styles.scrollList}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.listGap}>
          {members.map((member: any, index: number) => {
            const player = member.player;
            if (!player) return null;
            const isSelected = selectedPlayers.includes(member._id);
            const jerseyVal =
              jerseyNumbers[member._id] !== undefined
                ? jerseyNumbers[member._id]
                : member.dorsal !== undefined && member.dorsal !== null
                  ? String(member.dorsal)
                  : '';

            return (
              <View
                key={member._id || index}
                style={[styles.rosterCard, isSelected && styles.rosterCardSelected]}
              >
                {/* Foto perfil */}
                <Image
                  source={
                    player.avatar
                      ? { uri: player.avatar }
                      : require('@/assets/icons/brand/default/default2.png')
                  }
                  style={styles.rosterAvatar}
                />

                {/* Info nombre */}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <CustomText
                    label={(
                      player.username ||
                      player.nickname ||
                      'Jugador'
                    ).toUpperCase()}
                    size={14}
                    weight='bold'
                    color={Colors.text_primary}
                    style={styles.playerName}
                  />
                  <CustomText
                    label={player.position || 'Jugador'}
                    size={11}
                    color={Colors.text_tertiary}
                    style={styles.playerPosition}
                  />
                </View>

                {/* Input Dorsal */}
                <View style={styles.jerseyInputContainer}>
                  <CustomText
                    label='N°'
                    size={11}
                    color={Colors.text_tertiary}
                    style={{ marginRight: 4 }}
                  />
                  <TextInput
                    value={jerseyVal}
                    onChangeText={(val) => handleJerseyNumberChange(member._id, val)}
                    placeholder='0'
                    placeholderTextColor={Colors.text_tertiary}
                    keyboardType='numeric'
                    maxLength={3}
                    style={styles.jerseyTextInput}
                  />
                </View>

                {/* Checkbox de selección */}
                <Pressable
                  onPress={() => handleTogglePlayer(member._id)}
                  style={[
                    styles.checkboxBtn,
                    isSelected ? styles.checkboxBtnActive : styles.checkboxBtnInactive,
                  ]}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark' : 'add-outline'}
                    size={20}
                    color={isSelected ? '#FFFFFF' : Colors.text_tertiary}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Botón de guardar */}
      <TouchableOpacity
        onPress={handleSaveRoster}
        disabled={isSavingRoster}
        style={[styles.saveRosterBtn, isSavingRoster && { opacity: 0.7 }]}
      >
        {isSavingRoster ? (
          <ActivityIndicator size='small' color={Colors.on_brand} />
        ) : (
          <CustomText
            label='CONFIRMAR PLANTILLA'
            weight='bold'
            color={Colors.on_brand}
            size={14}
            style={styles.btnText}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 5,
  },
  loader: {
    marginVertical: 30,
  },
  emptyContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.1)',
    borderRadius: 8,
  },
  infoAlertBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(40, 209, 195, 0.04)',
    borderWidth: 1,
    borderColor: Colors.brand_primary + '30',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  infoAlertIconBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  alertHeader: {
    marginBottom: 4,
    letterSpacing: 1,
    textAlign: 'left',
  },
  alertBody: {
    textAlign: 'left',
    lineHeight: 18,
  },
  selectionCount: {
    marginBottom: 5,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  scrollList: {
    maxHeight: 380,
    width: '100%',
  },
  listGap: {
    gap: 12,
    paddingBottom: 12,
    paddingRight: 4,
  },
  rosterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    gap: 12,
  },
  rosterCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  rosterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface_base,
  },
  playerName: {
    textAlign: 'left',
  },
  playerPosition: {
    marginTop: 2,
    textAlign: 'left',
  },
  jerseyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_base,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
    marginRight: 4,
  },
  jerseyTextInput: {
    width: 30,
    color: Colors.text_primary,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 0,
  },
  checkboxBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBtnActive: {
    backgroundColor: '#3B82F6',
  },
  checkboxBtnInactive: {
    backgroundColor: Colors.surface_base,
    borderWidth: 1,
    borderColor: Colors.surface_pressed,
  },
  saveRosterBtn: {
    backgroundColor: Colors.brand_primary,
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
    shadowColor: Colors.brand_primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  btnText: {
    letterSpacing: 1.5,
  },
});
