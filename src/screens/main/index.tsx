import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from '@apollo/client';
import {wizardWorks} from './wizardWorks';
import FastImage from 'react-native-fast-image';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {wizardSymptoms} from '../symptom/query';

export const Parent = ({item: {name, image}, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {image?.file?.url && (
        <FastImage
          style={styles.image}
          source={{
            uri: image?.file?.url,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

const ListHeaderComponent = ({selectedIndex, setSelectedIndex}) => {
  return (
    <View>
      <SegmentedControl
        onChange={({nativeEvent: {selectedSegmentIndex}}) =>
          setSelectedIndex(selectedSegmentIndex)
        }
        values={['Выбрать услуги', 'Описать симптомы']}
        selectedIndex={selectedIndex}
      />
      <Text>
        {selectedIndex === 0
          ? 'Какой узел автомобиля нуждается в ремонте?'
          : 'Какой симптом описывает проблему с вашим автомобилем?'}
      </Text>
    </View>
  );
};

export const Home = ({navigation: {navigate}}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isWizardWorks = selectedIndex === 0;
  const works = useQuery(wizardWorks);
  const symptoms = useQuery(wizardSymptoms);

  return works.loading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      ListHeaderComponent={
        <ListHeaderComponent
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      }
      numColumns={2}
      data={
        isWizardWorks
          ? works?.data?.wizardWorks.filter(({parentId}) => !parentId)
          : symptoms?.data?.wizardSymptoms.filter(({parentId}) => !parentId)
      }
      renderItem={({item}) => (
        <Parent
          item={item}
          onPress={() =>
            navigate('Works', {children: item.children, name: item.name})
          }
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '49%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {width: 50, height: 50},
});
