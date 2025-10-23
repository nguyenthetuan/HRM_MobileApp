import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const DayCell = React.memo(({ date, state, marking, onPress }) => {
  let bg, textColor;
  let status = marking?.status;

  if (state === 'disabled') {
    textColor = '#d9e1e8';
  } else if (marking?.selected) {
    bg = '#3b82f6';
    textColor = '#fff';
  } else if (status === 'valid') {
    bg = '#22c55e';
    textColor = '#fff';
  } else if (status === 'invalid') {
    bg = '#f97316';
    textColor = '#fff';
  } else if (status === 'leave') {
    bg = '#ef4444';
    textColor = '#fff';
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(date)}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 6,
          backgroundColor: bg,
        }}
      >
        <Text style={{ fontSize: 16, color: textColor ?? '#000' }}>
          {date.day}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
export default DayCell;
