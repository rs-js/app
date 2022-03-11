import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistCache} from 'apollo3-cache-persist';
import {ActivityIndicator, StatusBar} from 'react-native';
import {Home} from './screens/main';
import {Works} from './screens/work';

const cache = new InMemoryCache();

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://zencar-backend-dev.dev.zen.car/graphql',
  cache,
  defaultOptions: {watchQuery: {fetchPolicy: 'cache-and-network'}},
});

const Stack = createNativeStackNavigator();

export const App = () => {
  const [loadingCache, setLoadingCache] = useState(true);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    }).then(() => setLoadingCache(false));
  }, []);

  if (loadingCache) {
    return <ActivityIndicator />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Главная'}}
          />
          <Stack.Screen
            name="Works"
            component={Works}
            options={({
              route: {
                params: {name},
              },
            }) => ({headerTitle: name})}
          />
        </Stack.Navigator>
        <StatusBar barStyle={'light-content'} />
      </NavigationContainer>
    </ApolloProvider>
  );
};
