import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

interface ListeningEntry {
  id: string;
  user: string;
  song: string;
  timestamp: Date;
}

const FriendsListeningScreen = () => {
  const [listeningList, setListeningList] = useState<ListeningEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectToServer();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectToServer = () => {
    console.log('Conectando al servidor...');
    const ws = new (global as any).WebSocket('ws://172.23.58.247:5085/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Conectado al servidor WebSocket');
      // Identificarte como "monitor" para no enviar canción
      ws.send(`USUARIO:Monitor-${Date.now()}`);
    };

    ws.onmessage = (event: any) => {
      const message = event.data;
      console.log('📢 Mensaje recibido:', message);

      // Formato esperado: "Usuario X está reproduciendo: Canción Y"
      if (message.includes('está reproduciendo:')) {
        const parts = message.split(' está reproduciendo: ');
        if (parts.length === 2) {
          const user = parts[0];
          const song = parts[1];

          const newEntry: ListeningEntry = {
            id: `${user}-${Date.now()}`,
            user,
            song,
            timestamp: new Date(),
          };

          setListeningList(prev => {
            // Actualizar si ya existe el usuario, o añadir nuevo
            const existingIndex = prev.findIndex(item => item.user === user);
            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = newEntry;
              return updated;
            } else {
              return [...prev, newEntry];
            }
          });
        }
      }
    };

    ws.onerror = (error: any) => {
      console.error('❌ Error WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('🔒 Conexión WebSocket cerrada');
    };
  };

  const renderFriendItem = ({ item }: { item: ListeningEntry }) => (
    <View style={styles.friendItem}>
      <Text style={styles.userName}>{item.user}</Text>
      <Text style={styles.songName}>{item.song}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lo que están escuchando tus amigos</Text>
      <FlatList
        data={listeningList}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  friendItem: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  songName: {
    fontSize: 16,
    color: '#b3b3b3',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default FriendsListeningScreen;