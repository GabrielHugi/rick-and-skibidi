import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Dimensions, StyleSheet, Text, View, Button, FlatList, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import SearchBar from '../components/SearchBar';

const API_URL = 'https://rickandmortyapi.com/api/character';

const { width } = Dimensions.get('window');
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (width / 2) - (ITEM_MARGIN * 2);


export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef({});
  const [input, setInput] = useState('');
  const isLoadingRef = useRef(false);
  const [data, setData] = useState([]);
  const currentPageRef = useRef(1);
  const hasMoreDataRef = useRef(true);

  // para pesquisa
  const handleLoadAgain = async () => {
    if (isLoadingRef.current) {
      return;
    }
    currentPageRef.current = 1;
    hasMoreDataRef.current = true;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: currentPageRef.current,
          ...searchRef.current,
        }
      });
      currentPageRef.current++;
      // só novo
      setData(response.data.results);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.log("None found.");
        Alert.alert("None found");
      } else {
        console.error(err);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };


  const handleLoadMore = async () => {
    if (isLoadingRef.current || !hasMoreDataRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: currentPageRef.current,
          ...searchRef.current,
        }
      });
      currentPageRef.current++;
      // antigo + novo
      setData(prevData => [...prevData, ...response.data.results]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.log("Reached the end of the pages. No more data to load.");
        Alert.alert("Reached the end of the pages. No more data to load.");
        hasMoreDataRef.current = false;
      } else {
        console.error(err);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  // roda uma vez quando o app abre
  useEffect(() => {
    handleLoadMore();
  }, []);

  const handleSubmitSearch = () => {
    searchRef.current = {name: input};
    handleLoadAgain();
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value = {input}
        onChangeText = {setInput}
        onSubmit = {handleSubmitSearch}
      />
      <FlatList
        numColumns={2} 
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => {
              navigation.navigate('Character Detail', { character: item });
            }}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemDetails} numberOfLines={1}>Species: {item.species}</Text>
                <Text style={styles.itemDetails} numberOfLines={1}>Status: 
                  <Text style={{ 
                    fontWeight: 'bold',
                    color: item.status === 'Alive' ? '#28a745' :
                          item.status === 'Dead'  ? '#dc3545' :
                          '#6c757d'
                  }}>
                    {item.status}
                  </Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <Text style={styles.listHeader}>Rick and Morty Characters</Text>
        }
        onEndReached={handleLoadMore} 
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoading ? <ActivityIndicator style={{ margin: 20 }} size="large" color="#0000ff" /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  itemContent: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },
  itemWrapper: {
    flex: 0.5,
  },
});