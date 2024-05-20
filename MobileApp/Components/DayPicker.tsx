import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    width: width / 10, // Adjusted for smaller screens
    height: width / 10,
    borderRadius: (width / 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'blue',
  },
  selectedDay: {
    backgroundColor: 'blue',
  },
  dayText: {
    color: 'white',
  },
});

export default DayPicker;
