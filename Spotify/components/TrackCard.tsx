import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface TrackCardProps {
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  onPress: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  title,
  artist,
  album,
  duration,
  coverUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: coverUrl }} style={styles.cover} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        <Text style={styles.meta}>{album} • {duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#121212',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#535353',
  },
});