import Header from '@/components/header';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';

const EmployeerDetail = () => {
  const navigation = useNavigation();
  const [employeeData] = useState({
    avatar: 'https://i.pravatar.cc/150?img=12', // Avatar URL
    fullName: 'Nguyễn Văn A',
    gender: 'Nam',
    dateOfBirth: new Date('1990-01-01'),
    phone: '0123456789',
    email: 'nguyenvana@example.com',
    educationLevel: 'Đại học',
    major: 'Công nghệ thông tin',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    positionId: 'P123',
    departmentId: 'D456',
    managerId: 'U789',
    hireDate: new Date('2020-05-10'),
    status: 'active',
  });

  return (
    <View style={styles.container}>
      <Header title="Chi tiết nhân viên" onGoBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: employeeData.avatar }} style={styles.avatar} />
          <Text style={styles.fullName}>{employeeData.fullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <InfoItem label="Giới tính" value={employeeData.gender} />
          <InfoItem
            label="Ngày sinh"
            value={employeeData.dateOfBirth.toLocaleDateString('vi-VN')}
          />
          <InfoItem label="Số điện thoại" value={employeeData.phone} />
          <InfoItem label="Email" value={employeeData.email} />
          <InfoItem label="Địa chỉ" value={employeeData.address} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin học vấn</Text>
          <InfoItem
            label="Trình độ học vấn"
            value={employeeData.educationLevel}
          />
          <InfoItem label="Chuyên ngành" value={employeeData.major} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin công việc</Text>
          <InfoItem label="Position ID" value={employeeData.positionId} />
          <InfoItem label="Department ID" value={employeeData.departmentId} />
          <InfoItem label="Manager ID" value={employeeData.managerId} />
          <InfoItem
            label="Ngày vào làm"
            value={employeeData.hireDate.toLocaleDateString('vi-VN')}
          />
          <InfoItem label="Trạng thái" value={employeeData.status} />
        </View>
      </ScrollView>
    </View>
  );
};

// Component con để hiển thị từng dòng thông tin
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default EmployeerDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    backgroundColor: '#f0f2f5', // Nền nhẹ nhàng
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#4CAF50', // Màu viền đẹp mắt
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontWeight: '600',
    color: '#555',
    flex: 0.4, // Phân bổ không gian cho label
    marginRight: 8,
  },
  infoValue: {
    color: '#333',
    flex: 0.6, // Phân bổ không gian cho value
  },
});
