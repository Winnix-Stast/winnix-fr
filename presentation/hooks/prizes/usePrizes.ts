import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { prizesActions } from '@/core/prizes/actions/prizes-actions';
import { PRIZE_SUGGESTIONS } from '@/core/prizes/constants/prize-themes';
import { CreatePrizePayload, PrizeStatus } from '@/core/prizes/interface/prize.interface';
import { useAlertStore } from '@/presentation/components/customs';
import { useAdditionalPrizes } from '@/presentation/hooks/prizes/useAdditionalPrizes';

export const usePrizes = (editionId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['prizes', editionId];
  const { data: catalogItems = [] } = useAdditionalPrizes();
  const { showAlert } = useAlertStore();

  const { data: prizes = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => prizesActions.getByEditionAction(editionId),
    enabled: !!editionId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreatePrizePayload) => prizesActions.createPrizeAction(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreatePrizePayload> }) =>
      prizesActions.updatePrizeAction(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => prizesActions.deletePrizeAction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string>('Otro (Personalizado)');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PrizeStatus>('active');

  const { control, setValue, watch, reset } = useForm({
    defaultValues: {
      label: '',
      cashAmountRaw: '',
      position: '',
    },
  });

  const formValues = watch();

  const isTitleEditable = selectedChip === 'Otro (Personalizado)' || !selectedChip;

  const handleSelectChip = (sug: (typeof PRIZE_SUGGESTIONS)[number]) => {
    if (sug.label === 'Otro (Personalizado)') {
      setSelectedChip('Otro (Personalizado)');
      setValue('label', '');
      setValue('position', '');
    } else {
      setSelectedChip(sug.label);
      setValue('label', sug.label);
      setValue('position', sug.position !== null ? String(sug.position) : '');
    }
  };

  const mainPrizes = prizes.filter((p: any) => p.isMainPrize || p.position);
  const sortedMainPrizes = [...mainPrizes].sort((a: any, b: any) => {
    const posA = a.position ?? 999;
    const posB = b.position ?? 999;
    if (posA !== posB) return posA - posB;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const specialPrizes = prizes.filter((p: any) => !p.isMainPrize && !p.position);

  const formatCurrencyCOP = (rawText: string) => {
    const cleanNum = rawText.replace(/\D/g, '');
    if (!cleanNum) return '';
    const num = parseInt(cleanNum, 10);
    return `$ ${num.toLocaleString('es-CO')} COP`;
  };

  const handleToggleItem = (itemName: string) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter((i) => i !== itemName));
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  const handleCreate = async () => {
    const cleanLabel = (formValues.label || '').trim();
    const cashNum = formValues.cashAmountRaw
      ? parseInt(formValues.cashAmountRaw.replace(/\D/g, ''), 10)
      : null;
    const posNum = formValues.position ? parseInt(formValues.position, 10) : null;

    if (!cleanLabel) {
      showAlert({
        title: 'Título Requerido',
        message:
          'Por favor ingresa un título para el premio (ej. Campeón, Subcampeón, Goleador).',
        type: 'warning',
        confirmText: 'ENTENDIDO',
      });
      return;
    }

    if (!cashNum && selectedItems.length === 0) {
      showAlert({
        title: 'Recompensa Requerida',
        message:
          'Por favor ingresa un valor en dinero (COP) o selecciona al menos un premio adicional (ej. Uniformes, Trofeos).',
        type: 'warning',
        confirmText: 'ENTENDIDO',
      });
      return;
    }

    const isMain = posNum !== null && posNum > 0;

    try {
      await createMutation.mutateAsync({
        tournamentEdition: editionId,
        label: cleanLabel,
        cashAmount: cashNum,
        currency: 'COP',
        additionalItems: selectedItems,
        position: posNum,
        isMainPrize: isMain,
        order: prizes.length,
        status: selectedStatus || 'active',
      });

      reset({ label: '', cashAmountRaw: '', position: '' });
      setSelectedChip('Otro (Personalizado)');
      setSelectedItems([]);
      setSelectedStatus('active');
      setShowModal(false);
    } catch {
      showAlert({
        title: 'Error al Guardar',
        message: 'No se pudo guardar el premio en el servidor. Intenta de nuevo.',
        type: 'error',
        confirmText: 'ENTENDIDO',
      });
    }
  };

  const handleDelete = (id: string, label: string) => {
    showAlert({
      title: 'Eliminar Premio',
      message: `¿Estás seguro de que deseas eliminar el premio "${label}"?`,
      type: 'warning',
      showCancel: true,
      cancelText: 'CANCELAR',
      confirmText: 'ELIMINAR',
      onConfirm: () => deleteMutation.mutateAsync(id),
    });
  };

  return {
    prizes,
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createPrize: createMutation.mutateAsync,
    updatePrize: (id: string, payload: Partial<CreatePrizePayload>) =>
      updateMutation.mutateAsync({ id, payload }),
    deletePrize: deleteMutation.mutateAsync,

    // UI & Form State
    catalogItems,
    showModal,
    setShowModal,
    selectedChip,
    selectedItems,
    selectedStatus,
    setSelectedStatus,
    control,
    formValues,
    isTitleEditable,
    sortedMainPrizes,
    specialPrizes,
    handleSelectChip,
    handleToggleItem,
    handleCreate,
    handleDelete,
    formatCurrencyCOP,
  };
};
