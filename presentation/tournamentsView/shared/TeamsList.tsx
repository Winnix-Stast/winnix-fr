import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors, Fonts } from '@/presentation/styles/global-styles';

const TeamsList = () => {
  const [favorite, setFavorite] = useState<boolean>(false);

  const handleSaveFavorite = () => {
    setFavorite(!favorite);
  };
  return (
    <View
      style={{
        backgroundColor: Colors.gray,
        borderRadius: 15,
        padding: 20,
        minHeight: 100,
      }}
    >
      <Pressable onPress={() => {}} style={[styles.container]}>
        <Image
          source={require('../../../assets/icons/tournament.png')}
          style={{ width: 150, height: 100 }}
        />

        {/* Botón de favoritos */}
        <Pressable onPress={handleSaveFavorite} style={styles.favorites}>
          <WinnixIcon
            name={favorite ? 'heart' : 'heart-outline'}
            size={30}
            color={favorite ? Colors.primary : Colors.gray}
          />
        </Pressable>

        <WinnixIcon
          style={styles.details}
          name={'chevron-forward-outline'}
          size={30}
          color={Colors.gray}
        />

        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.label]}>
          Test
        </Text>
      </Pressable>
    </View>
  );
};

export default TeamsList;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },

  label: {
    fontSize: Fonts.large,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'white',
    width: 150,
  },
  favorites: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 2,
  },

  details: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
});
