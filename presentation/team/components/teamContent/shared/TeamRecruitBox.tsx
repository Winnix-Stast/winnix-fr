import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors } from '@/presentation/styles/colors';
import { CustomButton } from '@/presentation/theme/components';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  searchedPlayer: any;
  hasSearched: boolean;
  isRecruiting: boolean;
  onSearch: () => void;
  onRecruit: (userId: string) => void;
  onReset: () => void;
  onClose?: () => void;
}

export const TeamRecruitBox: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  isSearching,
  searchedPlayer,
  hasSearched,
  isRecruiting,
  onSearch,
  onRecruit,
  onReset,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <WinnixIcon name='person-add' size={18} color={Colors.brand_primary} />
          <Text style={styles.title}>RECLUTAR JUGADOR A LA PLANTILLA</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <WinnixIcon name='close' size={18} color={Colors.text_tertiary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.helpText}>
        Busca al jugador ingresando su Nickname (@apodo), ID, correo o número de celular.
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <WinnixIcon name='search-outline' size={18} color={Colors.text_tertiary} />
          <TextInput
            style={styles.textInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder='Ej: @sebas99, correo, celular o ID'
            placeholderTextColor={Colors.text_tertiary}
            autoCapitalize='none'
            autoCorrect={false}
            onSubmitEditing={onSearch}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={onReset} hitSlop={8}>
              <WinnixIcon name='close-circle' size={18} color={Colors.text_tertiary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ minWidth: 90 }}>
          <CustomButton
            label={isSearching ? '' : 'BUSCAR'}
            icon={isSearching ? undefined : 'search'}
            onPress={onSearch}
            disabled={isSearching || !searchTerm.trim()}
            stylePressable={styles.searchBtn}
            styleText={styles.searchBtnText}
          />
        </View>
      </View>

      {/* Resultado de búsqueda de Jugador */}
      {searchedPlayer && (
        <View style={styles.foundPlayerCard}>
          <Image
            source={
              searchedPlayer.avatar
                ? { uri: searchedPlayer.avatar }
                : require('@/assets/icons/brand/default/default2.png')
            }
            style={styles.avatar}
          />

          <View style={styles.playerInfo}>
            <Text style={styles.playerName} numberOfLines={1}>
              {searchedPlayer.nickname
                ? `@${searchedPlayer.nickname}`
                : searchedPlayer.username}
            </Text>
            <Text style={styles.playerSub}>
              {searchedPlayer.username || searchedPlayer.email || 'Atleta'}
            </Text>
          </View>

          <View style={{ minWidth: 110 }}>
            <CustomButton
              label={isRecruiting ? '...' : 'RECLUTAR'}
              icon={isRecruiting ? undefined : 'person-add'}
              onPress={() => onRecruit(searchedPlayer._id || searchedPlayer.id)}
              disabled={isRecruiting}
              stylePressable={styles.recruitBtn}
              styleText={styles.recruitBtnText}
            />
          </View>
        </View>
      )}

      {/* Mensaje de no encontrado */}
      {hasSearched && !searchedPlayer && !isSearching && (
        <View style={styles.notFoundBox}>
          <WinnixIcon
            name='alert-circle-outline'
            size={20}
            color={Colors.status_cancelled}
          />
          <Text style={styles.notFoundText}>
            No se encontró ningún jugador con ese identificador. Verifica que el
            nickname, ID, correo o celular esté bien escrito.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface_elevated,
    borderWidth: 1,
    borderColor: 'rgba(40, 209, 195, 0.25)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.brand_primary,
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  helpText: {
    fontSize: 12,
    color: Colors.text_secondary,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 8, 25, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.text_primary,
    fontSize: 13,
    paddingVertical: 0,
  },
  searchBtn: {
    minHeight: 46,
    paddingVertical: 0,
    borderRadius: 12,
  },
  searchBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  foundPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 209, 195, 0.08)',
    borderWidth: 1,
    borderColor: Colors.brand_primary,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(3, 8, 25, 0.4)',
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  playerSub: {
    fontSize: 11,
    color: Colors.text_secondary,
  },
  recruitBtn: {
    minHeight: 38,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  recruitBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  notFoundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginTop: 4,
  },
  notFoundText: {
    flex: 1,
    fontSize: 11,
    color: Colors.status_cancelled,
    lineHeight: 16,
  },
});
