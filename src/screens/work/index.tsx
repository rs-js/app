import React from 'react';
import {FlatList} from 'react-native';
import {Parent} from '../main';

export const Works = ({
  route: {
    params: {children},
  },
  navigation: {navigate},
}) => {
  return (
    <FlatList
      numColumns={2}
      data={children}
      renderItem={({item}) => (
        <Parent item={item} onPress={() => navigate('Works', item.children)} />
      )}
    />
  );
};
