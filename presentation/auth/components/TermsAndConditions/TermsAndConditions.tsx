import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Colors } from '@/presentation/styles';
import { Fonts } from '@/presentation/styles/global-styles';
import { MyCheckbox } from '@/presentation/theme/components/CustomCheckbox';

interface Props {
  control: Control<any>;
  Haptics: any;
  handleTermsClick: () => void;
  errors: FieldErrors<any>;
}

export const TermsAndConditions = ({
  control,
  Haptics,
  handleTermsClick,
  errors,
}: Props) => (
  <>
    <View style={styles.terms}>
      <View style={styles.termsTextContainer}>
        <Text style={styles.termText}>Acepto los</Text>
        <Pressable onPress={handleTermsClick}>
          <Text style={styles.termsLink}>términos y condiciones</Text>
        </Pressable>
      </View>

      <Controller
        control={control}
        name='isChecked'
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <MyCheckbox
            onChange={() => {
              Haptics.selectionAsync();
              onChange(!value);
            }}
            checked={value ?? false}
          />
        )}
      />
    </View>

    {typeof errors?.isChecked?.message === 'string' && (
      <Text style={styles.errorText}>{errors.isChecked.message}</Text>
    )}
  </>
);
const styles = StyleSheet.create({
  terms: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    zIndex: 2,
  },

  termsTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  termText: {
    fontSize: Fonts.small + 2,
    color: Colors.primary_100,
  },

  termsLink: {
    fontSize: Fonts.small + 2,
    color: Colors.actions_primary_bg,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#E97451',
    fontSize: Fonts.small,
    marginTop: 2,
  },
});
