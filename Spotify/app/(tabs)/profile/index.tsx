import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { fetchFirstUser } from '../../../services/users';
import { User } from '../../../interfaces/User';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFirstUser();
  }, []);

  const loadFirstUser = async () => {
    try {
      const userData = await fetchFirstUser();
      setUser(userData);
    } catch (error) {
      console.error('Error al cargar el primer usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>No se pudo cargar el perfil</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Foto de perfil (placeholder) */}
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: 'https://hips.hearstapps.com/hmg-prod/images/elon-musk-gettyimages-2147789844-web-675b2c17301ea.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.nom}</Text>
          <Text style={styles.profileId}>ID: {user.id}</Text>
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información del Perfil</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{user.nom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileId: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  infoSection: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ProfileScreen;