import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import IconFace from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reminder = ({ onReminderSet, drugName, record }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [reminderInfo, setReminderInfo] = useState("No Reminders");

  useEffect(() => {

    // for the reminder, after the screen is re-expanded
    
    AsyncStorage.getItem(`reminderInfo_${drugName}`).then((storedReminderInfo) => {
      if (storedReminderInfo) {
        setReminderInfo(storedReminderInfo);
      }
    });
  }, [drugName]);

  const handleConfirm = (date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      handleSaveReminder(record, date, selectedTime);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleSaveReminder = (record: any, selectedDate: Date, selectedTime: Date) => {

    // Schedule the push notification for the specified date and time
    PushNotification.localNotificationSchedule({
      message: `Time to take ${drugName}`,
      date: selectedDate,
      repeatType: repeatDaily ? 'day' : undefined,
      userInfo: {
        drugName: drugName,
        notificationTime: selectedTime,
      },
    });

    const reminderDateTime = selectedDate.toLocaleString('default', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    const reminderInfo = repeatDaily ? `Reminder set for daily at ${selectedTime.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric' })}` : `Reminder set for ${reminderDateTime}`;
  
    AsyncStorage.setItem(`reminderInfo_${drugName}`, reminderInfo);
  
    setReminderInfo(reminderInfo);
  };

  const handleRepeatDailyToggle = () => {
    setRepeatDaily(!repeatDaily);
    const newReminderInfo = repeatDaily ? "No Reminders" : "Reminder set for daily";
    setReminderInfo(newReminderInfo);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <IconFace name="bell" size={15} color="grey" />
        <Text> Remind me: </Text>
        <View style={styles.reminderInfoContainer}>
          <Text style={styles.reminderInfoText}>{reminderInfo}</Text>
        </View>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="datetime"
          date={selectedDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePickerModal}
        />
        <View style={styles.repeatDailyContainer}>
          <Text>Repeat Daily</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={repeatDaily ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleRepeatDailyToggle}
            value={repeatDaily}
          />
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity onPress={showDatePickerModal} style={styles.setReminderButton}>
            <Text style={styles.setReminderText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setReminderButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  setReminderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reminderInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderInfoText: {
    textAlign: 'center',
  },
  repeatDailyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default Reminder;
