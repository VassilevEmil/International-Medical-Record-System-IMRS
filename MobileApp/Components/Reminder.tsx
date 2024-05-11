import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IconFace from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';


const Reminder = ({ onReminderSet, drugName, record }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleConfirm = (date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };



  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

 const  handleSaveReminder = (record: any, selectedDate: Date, selectedTime: Date) => {

  console.log("time from user input: ", selectedDate);

  

  // Schedule the push notification for the specified date and time
  PushNotification.localNotificationSchedule({
    message: `Time to take ${drugName}`,
    date: selectedDate,
    // smallIcon: 'tablets',
    // color: 'light-blue',
    userInfo: {
      drugName: drugName,
      notificationTime: selectedTime,
    },
    
  });

  console.log(`Reminder for ${drugName} has been set for:`, selectedDate);
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePickerModal}>
        <View style={styles.container}>
          <IconFace name="calendar" size={20} color="blue" />
          <Text style={styles.buttonText}>Set Reminder</Text>
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={selectedDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePickerModal}
      />
      <TouchableOpacity onPress={() => handleSaveReminder(record, selectedDate, selectedTime)}>
  <View style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Save Reminder</Text>
  </View>
</TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 8,
    color: 'blue',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Reminder;