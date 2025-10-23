import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Entypo from 'react-native-vector-icons/Entypo'; // 👈 dùng bộ icon này

type DropdownItem = {
  key: string | number;
  label: string;
};

type DropdownProps = {
  label?: string;
  data: DropdownItem[];
  defaultValue?: string | number;
  onSelect: (item: DropdownItem, index: number) => void;
  placeholder?: string;
  style?: any;
};

const CommonDropdown: React.FC<DropdownProps> = ({
  label,
  data,
  defaultValue,
  onSelect,
  placeholder = '',
  style,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <SelectDropdown
        data={data}
        onSelect={(selectedItem, index) => {
          onSelect(selectedItem, index);
        }}
        defaultValue={
          defaultValue
            ? data.find((item) => item.key === defaultValue) // tìm object theo key
            : undefined
        }
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={[styles.dropdownButtonStyle, style]}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.label) || `${placeholder}`}
              </Text>
              <Entypo
                name={isOpened ? 'triangle-up' : 'triangle-down'}
                style={styles.dropdownButtonArrowStyle}
                color={'#eeeeee'}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: '#D2D9DF' }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
};

export default CommonDropdown;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
  container: {
    flex: 1,
    display: 'flex',
  },
  dropdownButtonStyle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
    color: '#666666',
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
