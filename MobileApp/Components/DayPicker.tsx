// DayPicker.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Dimensions } from 'react-native';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const { width } = Dimensions.get('window');

const DayPicker = ({ selectedDays, onSelectDay }) => {
  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day}
          onPress={() => onSelectDay(day)}
          style={[
            styles.day,
            selectedDays.includes(day) && styles.selectedDay,
          ]}
        >
          <Text style={styles.dayText}>{day[0]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  day: {
    width: width / 10,
    height: width / 10,
    borderRadius: (width / 10) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'blue',
  },
  selectedDay: {
    backgroundColor: '#2196F3',
  },
  dayText: {
    color: 'white',
  },
});

export default DayPicker;
