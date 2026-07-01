import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '@/presentation/components/customs';
import { Colors } from '@/presentation/styles';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import {
  CustomButton,
  CustomFormView,
  CustomInput,
  CustomSelect,
  CustomDatePicker,
  CustomImagePicker,
} from '@/presentation/theme/components';
import { useEditTournament } from '@/presentation/hooks/tournaments/useEditTournament';
import { TournamentStagesLayout } from '@/presentation/tournamentsView/tournamentsInfo/stagesLayout/TournamentStagesLayout';
import { InformationTournament } from '@/presentation/tournamentsView/tournamentsInfo/information/InformationTournament';

type TabType = 'ajustes' | 'multimedia' | 'etapas' | 'equipos' | 'info';

export default function EditTournamentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('ajustes');

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    onSubmit,
    onSubmitVisual,
    deleteInscription,
    handleGoBack,
    isDraft,
    sports,
    templates,
    inscriptions,
    isLoading,
    errorMsg,
  } = useEditTournament(id as string);

  const sportOptions = sports.map((s: any) => ({ label: s.name, value: s._id }));
  const templateOptions = templates.map((t: any) => ({ label: t.name, value: t._id }));

  if (isLoading && !inscriptions) {
    return (
      <CustomFormView>
        <ScreenHeader title="Editar Torneo" onBack={handleGoBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.brand_primary} />
        </View>
      </CustomFormView>
    );
  }

  if (errorMsg || !id) {
    return (
      <CustomFormView>
        <ScreenHeader title="Editar Torneo" onBack={handleGoBack} />
        <View style={styles.loadingContainer}>
          <WinnixIcon name="alert-circle-outline" size={50} color={Colors.status_cancelled} />
          <Text style={styles.errorText}>
            {errorMsg || 'No se especificó un ID de torneo válido.'}
          </Text>
        </View>
      </CustomFormView>
    );
  }

  return (
    <CustomFormView>
      <ScreenHeader title="Editar Torneo" onBack={handleGoBack} />

      {/* Premium Horizontal Tab Selector */}
      <View style={styles.tabBar}>
        {([
          { key: 'ajustes', label: 'Ajustes', icon: 'settings-outline' },
          { key: 'multimedia', label: 'Imagen', icon: 'image-outline' },
          { key: 'etapas', label: 'Etapas', icon: 'flag-outline' },
          { key: 'equipos', label: 'Equipos', icon: 'people-outline' },
          { key: 'info', label: 'Info', icon: 'information-circle-outline' },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={styles.tabButton}
            >
              <WinnixIcon
                name={tab.icon}
                size={18}
                color={isActive ? Colors.brand_primary : Colors.text_tertiary}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.formContainer}>
        {/* TAB 1: GENERAL CONFIGURATION (AJUSTES) */}
        {activeTab === 'ajustes' && (
          <View style={styles.tabContent}>
            {!isDraft && (
              <View style={styles.warningBanner}>
                <WinnixIcon name="information-circle-outline" size={24} color={Colors.status_draft} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.warningTitle}>Configuración Bloqueada</Text>
                  <Text style={styles.warningText}>
                    Este torneo ya está activo o en inscripciones abiertas. Solo se permite cambiar el nombre de la temporada. Reglas, fechas y formato están bloqueados para proteger los partidos actuales.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información del Torneo</Text>
              <CustomInput
                name="seasonName"
                control={control}
                label="Nombre de la Temporada *"
                placeholder="Ej. Apertura 2026"
                errorMessage={errors.seasonName?.message}
              />
              <View style={{ opacity: 0.6 }}>
                <CustomSelect
                  name="sport"
                  control={control}
                  options={sportOptions}
                  label="Deporte (No modificable)"
                  placeholder="Cargando deporte..."
                  disabled={true}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fechas del Torneo</Text>
              <CustomDatePicker
                name="startDate"
                control={control}
                label="Inicio de Inscripciones *"
                placeholder="DD/MM/YYYY"
                modalTitle="Fecha de Apertura"
                allowFutureDates={true}
                disabled={!isDraft}
                errorMessage={errors.startDate?.message}
              />
              <CustomDatePicker
                name="endDate"
                control={control}
                label="Fin del Torneo (Opcional)"
                placeholder="DD/MM/YYYY"
                modalTitle="Fecha de Clausura"
                allowFutureDates={true}
                disabled={!isDraft}
                errorMessage={errors.endDate?.message}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Formato y Reglas</Text>
              <CustomSelect
                name="sportTemplate"
                control={control}
                options={templateOptions}
                label="Plantilla de Reglas *"
                placeholder="Selecciona una plantilla..."
                disabled={!isDraft}
                errorMessage={errors.sportTemplate?.message}
              />

              <View style={!isDraft && { opacity: 0.6 }}>
                <CustomInput
                  name="playersPerTeam"
                  control={control}
                  label="Cantidad Máxima de Jugadores por Equipo"
                  placeholder="Ej. 10"
                  keyboardType="numeric"
                  editable={isDraft}
                  errorMessage={errors.playersPerTeam?.message}
                />
              </View>

              <View style={!isDraft && { opacity: 0.6 }}>
                <CustomInput
                  name="matchDuration"
                  control={control}
                  label="Duración del Partido (minutos)"
                  placeholder="Ej. 40"
                  keyboardType="numeric"
                  editable={isDraft}
                  errorMessage={errors.matchDuration?.message}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reglas de Puntuación</Text>
              <View style={!isDraft && { opacity: 0.6 }}>
                <CustomInput
                  name="scoring.win"
                  control={control}
                  label="Puntos por Victoria"
                  placeholder="Ej. 3"
                  keyboardType="numeric"
                  editable={isDraft}
                  errorMessage={errors.scoring?.win?.message}
                />
              </View>
              <View style={!isDraft && { opacity: 0.6 }}>
                <CustomInput
                  name="scoring.draw"
                  control={control}
                  label="Puntos por Empate"
                  placeholder="Ej. 1"
                  keyboardType="numeric"
                  editable={isDraft}
                  errorMessage={errors.scoring?.draw?.message}
                />
              </View>
              <View style={!isDraft && { opacity: 0.6 }}>
                <CustomInput
                  name="scoring.loss"
                  control={control}
                  label="Puntos por Derrota"
                  placeholder="Ej. 0"
                  keyboardType="numeric"
                  editable={isDraft}
                  errorMessage={errors.scoring?.loss?.message}
                />
              </View>
            </View>

            <View style={styles.submitContainer}>
              <CustomButton
                label={isSubmitting ? 'Guardando...' : 'GUARDAR CAMBIOS'}
                onPress={handleSubmit(onSubmit)}
                disabled={isDisabled || isSubmitting}
              />
            </View>
          </View>
        )}

        {/* TAB 2: VISUAL IDENTITY (MULTIMEDIA) */}
        {activeTab === 'multimedia' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Póster del Torneo</Text>
              <CustomImagePicker
                name="image"
                control={control}
                label="📸 Subir Banner de Publicidad (16:9)"
                errorMessage={errors.image?.message}
                aspect={[16, 9]}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Logo del Torneo</Text>
              <CustomImagePicker
                name="logo"
                control={control}
                label="🏆 Subir Logo Circular (1:1)"
                errorMessage={errors.logo?.message}
                isRound={true}
                aspect={[1, 1]}
              />
            </View>

            <View style={styles.submitContainer}>
              <CustomButton
                label={isSubmitting ? 'Guardando...' : 'GUARDAR IMÁGENES'}
                onPress={handleSubmit(onSubmitVisual)}
                disabled={isSubmitting}
              />
            </View>
          </View>
        )}

        {/* TAB 3: STAGES MANAGEMENT (ETAPAS) */}
        {activeTab === 'etapas' && (
          <View style={styles.tabContent}>
            <TournamentStagesLayout editionId={id} isOrganizer={true} />
          </View>
        )}

        {/* TAB 4: PARTICIPATING TEAMS (EQUIPOS) */}
        {activeTab === 'equipos' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Equipos Inscritos</Text>
              
              {(!inscriptions || inscriptions.length === 0) ? (
                <View style={styles.emptyState}>
                  <WinnixIcon name="shield-outline" size={48} color={Colors.text_tertiary} />
                  <Text style={styles.emptyText}>Ningún equipo se ha inscrito en esta edición todavía.</Text>
                </View>
              ) : (
                <View style={styles.teamsList}>
                  {inscriptions.map((ins: any, index: number) => {
                    const team = ins.team;
                    if (!team) return null;
                    const captainName = team.captain?.nickname || team.captain?.username || '—';
                    
                    return (
                      <View key={ins._id || index} style={styles.teamCard}>
                        <Image
                          source={
                            team.logo
                              ? { uri: team.logo }
                              : require('@/assets/icons/brand/default/default2.png')
                          }
                          style={styles.teamLogo}
                        />
                        <View style={{ flex: 1, gap: 4 }}>
                          <Text style={styles.teamName}>{team.name.toUpperCase()}</Text>
                          <Text style={styles.teamCaptain}>Capitán: {captainName}</Text>
                        </View>
                        <Pressable
                          onPress={() => deleteInscription(ins._id, team.name)}
                          style={styles.removeButton}
                        >
                          <WinnixIcon name="trash-outline" size={16} color="#EF4444" />
                          <Text style={styles.removeText}>Retirar</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 5: TOURNAMENT RULES/INFO (INFO) */}
        {activeTab === 'info' && (
          <View style={styles.tabContent}>
            <InformationTournament />
          </View>
        )}
      </View>
    </CustomFormView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text_secondary,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 24,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.status_draft,
  },
  warningText: {
    fontSize: 13,
    color: Colors.text_secondary,
    lineHeight: 18,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_focus,
    paddingBottom: 6,
    marginBottom: 4,
  },
  submitContainer: {
    marginTop: 10,
  },
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text_tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.brand_primary,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 3,
    backgroundColor: Colors.brand_primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  // Teams Tab Styles
  teamsList: {
    gap: 12,
    marginTop: 8,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated || '#0E1529',
    borderWidth: 1,
    borderColor: Colors.border_strong || 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(3,8,25,0.4)',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text_primary,
    letterSpacing: 0.5,
  },
  teamCaptain: {
    fontSize: 12,
    color: Colors.text_secondary,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  removeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.surface_elevated || '#0E1529',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text_tertiary,
    textAlign: 'center',
  },
});
