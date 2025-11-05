import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function DetailScreen({ route }) {
  const { character } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      // ignora o url em si e mapeia os ids dos episodios
      const episodeIds = character.episode.map(url => url.split('/').pop());
      
      // nada
      if (episodeIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
        const episodeData = [].concat(response.data);
        setEpisodes(episodeData);

      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [character.episode]); // se os episodios mudarem (então no geral o personagem mudou) pega denovo os episodios opor razões obvias

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: character.status === 'Alive' ? '#28a745' : (character.status === 'Dead' ? '#dc3545' : '#6c757d') }]}>
              {character.status}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Species:</Text>
            <Text style={styles.infoValue}>{character.species}</Text>
          </View>
          
          {character.type ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{character.type}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{character.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Origin:</Text>
            <Text style={styles.infoValue}>{character.origin.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Known Location:</Text>
            <Text style={styles.infoValue}>{character.location.name}</Text>
          </View>
        </View>

        <View style={styles.episodeSection}>
          <Text style={styles.sectionTitle}>Appearances</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
          ) : (
            episodes.map(episode => (
              <View key={episode.id} style={styles.episodeRow}>
                <View>
                  <Text style={styles.episodeName}>{episode.episode}: {episode.name}</Text>
                  <Text style={styles.episodeDate}>{episode.air_date}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#212529',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoRow_last: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  infoValue: {
    fontSize: 16,
    color: '#495057',
    flexShrink: 1,
    textAlign: 'right',
  },
  episodeSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
  },
  episodeRow: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  episodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  episodeDate: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
});