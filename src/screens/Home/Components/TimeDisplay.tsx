import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Clean up
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <View style={styles.timeInfo}>
      <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
      <Text style={styles.currentDate}>{formatDate(currentTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timeInfo: {},
  currentTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  currentDate: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 2,
  },
});

export default TimeDisplay;
