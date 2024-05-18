import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DayPicker = ({ selectedDays, onSelectDay }) => {
  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCircle,
            selectedDays.includes(day) && styles.selectedDayCircle
          ]}
          onPress={() => onSelectDay(day)}
        >
          <Text style={styles.dayText}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  dayCircle: {
    width: 48,
    height: 48,
    borderRadius: 25,
    backgroundColor: '#81b0ff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  selectedDayCircle: {
    backgroundColor: '#f0f0f0',
  },
  dayText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default DayPicker;
