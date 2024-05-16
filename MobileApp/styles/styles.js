// styles.js
import { StyleSheet } from 'react-native';

export const tabBarOptions = {
  activeTintColor: '#0340B6',
  inactiveTintColor: '#474747',
  style: StyleSheet.create({
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    elevation: 1.5,
    paddingBottom: 3,
    height: 70,
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  labelStyle: {
    fontSize: 12,
    marginBottom: 8,
  },
  iconStyle: {
    marginTop: 10,
  }
};
