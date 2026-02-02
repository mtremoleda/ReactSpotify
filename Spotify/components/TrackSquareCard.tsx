import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface TrackSquareCardProps {
  title: string;
  artist: string;
  coverUrl: string;
  onPress: () => void;
}

export const TrackSquareCard: React.FC<TrackSquareCardProps> = ({
  title,
  artist,
  coverUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: coverUrl }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  cover: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  artist: {
    fontSize: 10,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});