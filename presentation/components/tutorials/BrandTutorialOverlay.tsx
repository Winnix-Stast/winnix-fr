import React, { useEffect, useState } from 'react';
import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';
import { Colors } from '@/presentation/styles/colors';
import { BaseTutorialModal } from './BaseTutorialModal';
import { TutorialStep } from './types';

export const BRAND_TUTORIAL_KEY = 'winnix_tutorial_organizer_brands_v1';

const STEPS: TutorialStep[] = [
  {
    title: '¿Qué es una Marca?',
    description:
      'Una Marca representa la identidad oficial de tu liga o competición. Piensa en ella como la "Dimayor". Es tu sello distintivo, el cual ganará prestigio y visibilidad a medida que crezca.',
    icon: 'trophy-outline',
    exampleTitle: 'Concepto de Marca',
    exampleDesc:
      'La marca principal es "Dimayor". Bajo este sello organizas todos tus torneos, como la Liga BetPlay o el Torneo BetPlay.',
  },
  {
    title: 'Temporadas y Torneos',
    description:
      'Bajo tu marca, crearás Torneos (que actúan como temporadas o ediciones). Por ejemplo, puedes tener el torneo "Liga BetPlay - Apertura" (Enero a Junio) y luego el torneo "Liga BetPlay - Clausura" (Julio a Diciembre).',
    icon: 'calendar-outline',
    exampleTitle: 'Estructura de Fechas',
    exampleDesc: '1 Marca ➔ Múltiples Torneos / Temporadas sucesivas a lo largo del año.',
  },
  {
    title: 'Múltiples Ligas Activas',
    description:
      'No estás limitado a una sola marca. Puedes crear varias marcas distintas (ej. "Torneo Futsal Masculino" y "Torneo Femenino de Tenis") y organizar varios torneos activos en cada una de manera simultánea.',
    icon: 'layers-outline',
    exampleTitle: 'Flexibilidad de Gestión',
    exampleDesc:
      'Organiza competiciones de distintos formatos, categorías o deportes al mismo tiempo sin que se mezclen.',
  },
  {
    title: '¡Todo Listo para Convocar!',
    description:
      'Ahora estás listo para crear tu primera marca. Sube un logotipo representativo, asígnale un nombre legendario y prepárate para convocar a los equipos a la arena de juego.',
    icon: 'rocket-outline',
    exampleTitle: 'Comenzar Legado',
    exampleDesc:
      'Toca en "Crear Marca" en tu dashboard para iniciar tu primera gran competencia.',
  },
];

interface Props {
  forceShow?: boolean;
  onClose?: () => void;
}

export const BrandTutorialOverlay = ({ forceShow = false, onClose }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (forceShow) {
        setVisible(true);
        return;
      }
      const status = await SecureStorageAdapter.getItem(BRAND_TUTORIAL_KEY);
      if (!status) {
        setVisible(true);
      }
    };
    checkStatus();
  }, [forceShow]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <BaseTutorialModal
      tutorialKey={BRAND_TUTORIAL_KEY}
      steps={STEPS}
      visible={visible}
      onClose={handleClose}
      accentColor={Colors.brand_primary}
    />
  );
};
export default BrandTutorialOverlay;
