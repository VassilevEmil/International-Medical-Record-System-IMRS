import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Switch, PermissionsAndroid, Platform } from 'react-native';
import IconFace from 'react-native-vector-icons/FontAwesome';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DayPicker from './DayPicker';
import { request, PERMISSIONS } from 'react-native-permissions';

const Reminder = ({ onReminderSet, drugName, record }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [repeatOption, setRepeatOption] = useState('Never');
  const [reminderInfo, setReminderInfo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  
 
  const handleSelectDay = (day) => {
    setCurrentDay(day);
    setShowTimePicker(true);
  };

  const handleConfirmTime = (time) => {
    setShowTimePicker(false);
    setSelectedTimes((prevSelectedTimes) => ({
      ...prevSelectedTimes,
      [currentDay]: time,
    }));
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(currentDay)
        ? prevSelectedDays
        : [...prevSelectedDays, currentDay]
    );
  };

  const handleSaveReminder = () => {
    const reminderInfo = `${selectedDays.join(', ')} at ${Object.values(selectedTimes).map(time => time.toLocaleTimeString()).join(', ')} repeat: ${repeatOption}`;
    AsyncStorage.setItem(`reminderInfo_${drugName}`, reminderInfo);
    setReminderInfo(reminderInfo);

    selectedDays.forEach((day) => {
      scheduleNotification(day, selectedTimes[day]);
    });

    setIsEditing(false);
  };

  const scheduleNotification = (day, time) => {
    const notificationTime = getNextDayOfWeek(day, time);
    let repeatType;

    switch (repeatOption) {
      case 'Daily':
        repeatType = 'day';
        break;
      case 'Every Other Day':
        repeatType = 'day';
        break;
      case 'Forever':
        repeatType = 'week';
        break;
      case 'Twice a Day':
        scheduleMultipleNotifications(day, time, 2);
        return;
      case 'Three Times a Day':
        scheduleMultipleNotifications(day, time, 3);
        return;
      default:
        repeatType = undefined;
    }

    PushNotification.localNotificationSchedule({
      message: `Time to take ${drugName}`,
      date: notificationTime,
      channelId: 'default-channel-id',
      repeatType: repeatType === 'Every Other Day' ? 'day' : repeatType,
      repeatTime: repeatOption === 'Every Other Day' ? 2 : undefined,
      userInfo: {
        drugName: drugName,
        notificationTime: time,
      },
    });

    console.log(`Notification scheduled for ${drugName} on ${day} at ${notificationTime} with repeat ${repeatType}`);
  };

  const scheduleMultipleNotifications = (day, time, timesPerDay) => {
    for (let i = 0; i < timesPerDay; i++) {
      const notificationTime = getNextDayOfWeek(day, time, i, timesPerDay);
      PushNotification.localNotificationSchedule({
        message: `Time to take ${drugName}`,
        date: notificationTime,
        channelId: 'default-channel-id',
        repeatType: 'day',
        userInfo: {
          drugName: drugName,
          notificationTime: time,
        },
      });
      console.log(`Notification scheduled for ${drugName} on ${day} at ${notificationTime}`);
    }
  };

  const getNextDayOfWeek = (day, time, index = 0, timesPerDay = 1) => {
    const dayIndex = daysOfWeek.indexOf(day);
    const now = new Date();
    now.setDate(now.getDate() + ((dayIndex - now.getDay() + 7) % 7));
    now.setHours(time.getHours(), time.getMinutes(), 0, 0);
    now.setHours(now.getHours() + (index * 24 / timesPerDay));
    return now;
  };

  const handleRepeatOptionSelect = (option) => {
    setRepeatOption(option);
    setShowRepeatOptions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <IconFace name="bell" size={15} color="grey" />
        {(!reminderInfo || isEditing) && <Text> Remind me: </Text>}
        {!isEditing && reminderInfo ? (
          <View style={styles.reminderInfoContainer}>
            <Text
              style={styles.reminderInfoText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {reminderInfo}
            </Text>
          </View>
        ) : null}
        {isEditing && (
          <>
            <DayPicker
              selectedDays={selectedDays}
              onSelectDay={handleSelectDay}
            />
            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="time"
              date={selectedTimes[currentDay] || new Date()}
              onConfirm={handleConfirmTime}
              onCancel={() => setShowTimePicker(false)}
            />
            <View style={styles.repeatDailyContainer}>
              <TouchableOpacity onPress={() => setShowRepeatOptions(true)} style={styles.setRepeatButton}>
                <Text style={styles.setRepeatText}>Repeat: {repeatOption}</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={showRepeatOptions} transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Repeat Options</Text>
                  {['Never', 'Daily', 'Every Other Day', 'Forever', 'Twice a Day', 'Three Times a Day'].map((option) => (
                    <TouchableOpacity key={option} onPress={() => handleRepeatOptionSelect(option)} style={styles.optionButton}>
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setShowRepeatOptions(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                handleSaveReminder();
              } else {
                setIsEditing(true);
              }
            }}
            style={styles.setReminderButton}
          >
            <Text style={styles.setReminderText}>{isEditing ? "Save" : "Edit"}</Text>
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
    flexWrap: 'wrap',
    width: '100%',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setReminderButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  setReminderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  setRepeatButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  setRepeatText: {
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
    maxWidth: '90%',
  },
  repeatDailyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Reminder;
