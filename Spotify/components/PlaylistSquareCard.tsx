import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface PlaylistSquareCardProps {
  title: string;
  coverUrl: string;
  songCount: number;
  onPress: () => void;
}

export const PlaylistSquareCard: React.FC<PlaylistSquareCardProps> = ({
  title,
  coverUrl,
  songCount,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: coverUrl }} style={styles.cover} />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.meta}>{songCount} canciones</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 180,
    marginRight: 12,
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  meta: {
    fontSize: 10,
    color: '#B3B3B3',
    textAlign: 'center',
  },
});