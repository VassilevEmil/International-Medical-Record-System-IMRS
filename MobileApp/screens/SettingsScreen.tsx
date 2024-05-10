import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

type SettingsScreenNavigationProp = {
  navigate: (screen: string) => void;
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleOptionPress = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Top Options */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => handleOptionPress('ManagePermissions')}>
        <Icon name="shield-outline" style={styles.iconsPictures}  />
        <Text style={styles.text}>Manage Permissions</Text>
        <Icon name="chevron-forward-outline" style={styles.iconsArrows}  />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => handleOptionPress('HelpSupport')}>
        <Icon name="headset-outline" style={styles.iconsPictures}  />
        <Text style={styles.text}>Help & Support</Text>
        <Icon name="chevron-forward-outline" style={styles.iconsArrows} />
      </TouchableOpacity>

      <View style={{ flex: 1 }}></View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleOptionPress('Logout')}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f1f1f1',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  option: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#d1d1d1',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  iconsArrows: {
    fontSize: 30,
    color: "#000",
  },
  iconsPictures: {
    fontSize: 30,
    marginHorizontal: 10,
    color: "#000",
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    color: '#000000',
  },
});

export default SettingsScreen;