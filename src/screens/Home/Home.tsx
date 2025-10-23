import { UseHome } from '@/hooks/Home';
import moment from 'moment';
import React, { useRef } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Feather';
import TimeDisplay from './Components/TimeDisplay';
import { requestLocationPermission } from '@/untils/permission/Permission';
import { BASE_URL } from '@env';
const Home = () => {
  const {
    loading,
    attendent,
    handleCheckInOrCheckOut,
    userInfor,
    getAttendent,
    setPosition,
    IdUser,
    Avatar,
    setAttend,
    ensureLocationPermission,
  } = UseHome();

  function subtractTimes(time1: any, time2: any) {
    const [h1, m1, s1] = time1.split(':').map(Number);
    const [h2, m2, s2] = time2.split(':').map(Number);
    const seconds1 = h1 * 3600 + m1 * 60 + s1;
    const seconds2 = h2 * 3600 + m2 * 60 + s2;
    let diff = seconds1 - seconds2;
    if (diff < 0) diff += 24 * 3600; // nếu qua đêm thì cộng thêm 24h
    diff -= 3600;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  const fullUrl = `${BASE_URL}${Avatar}`;
  const hasCalled = useRef(false); // Chỉ gọi 1 lần khi chạm đỉnh

  const handleScroll = async (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0 && !hasCalled.current) {
      hasCalled.current = true;
      if (Platform.OS === 'android') {
        requestLocationPermission(true, true, (isGranted) => {
          if (isGranted) {
            Geolocation.getCurrentPosition(
              (position) => {
                console.log('position', position);
                setPosition(position);
                getAttendent({
                  useId: IdUser,
                  date: moment(new Date()).format('YYYY-MM-DD'),
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  pageIndex: 1,
                  pageSize: 1,
                });
              },
              (error) => {
                console.log(error);
                if (error.code === 2) {
                  setAttend(null);
                }
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
          }
        });
      } else {
        const ok = await ensureLocationPermission();
        if (!ok) return;
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('position', position);
            setPosition(position);
            getAttendent({
              useId: IdUser,
              date: moment(new Date()).format('YYYY-MM-DD'),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              pageIndex: 1,
              pageSize: 1,
            });
          },
          (error) => {
            console.log(error);
            if (error.code === 2) {
              setAttend(null);
            }
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    }
    if (offsetY > 0) {
      hasCalled.current = false;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      onScroll={handleScroll}
      scrollEnabled
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          colors={['#3B82F6']} // Android màu loading
          tintColor="#3B82F6" // iOS màu loading
          title="Đang tải..."
        />
      }
    >
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      <View style={styles.gradient}>
        <View style={styles.gradient}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                {!!Avatar ? (
                  <Image source={{ uri: fullUrl }} style={styles.avatarImage} />
                ) : (
                  <Icon name="user" size={24} color="#fff" />
                )}
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{userInfor?.Name}</Text>
                <Text style={styles.userRole}>{userInfor?.Position}</Text>
              </View>
            </View>
            <TimeDisplay />
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.gpsContainer,
                { borderColor: attendent?.InOut ? '#059669' : '#DC2626' },
              ]}
            >
              <View style={styles.gpsStatus}>
                <Icon
                  name="map-pin"
                  size={24}
                  color={attendent?.InOut ? '#059669' : '#DC2626'}
                />
                <View style={styles.gpsInfo}>
                  <Text
                    style={[
                      styles.gpsTitle,
                      { color: attendent?.InOut ? '#065F46' : '#991B1B' },
                    ]}
                  >
                    {attendent?.InOut
                      ? 'Trong khu vực làm việc'
                      : 'Ngoài khu vực làm việc'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Main Check-in Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleCheckInOrCheckOut}
                disabled={
                  attendent?.InOut !== 1 ||
                  (!!attendent?.Data?.PunchInUserTime &&
                    !!attendent?.Data?.PunchOutUserTime)
                }
                style={[
                  styles.checkInButton,
                  (attendent?.InOut !== 1 ||
                    (!!attendent?.Data?.PunchInUserTime &&
                      !!attendent?.Data?.PunchOutUserTime)) &&
                    styles.disabledButton,
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.gradientButton,
                    attendent?.InOut !== 1
                      ? styles.outOfAreaButton // Ngoài khu vực → đỏ
                      : !!attendent?.Data?.PunchInUserTime &&
                          !attendent?.Data?.PunchOutUserTime
                        ? styles.checkedButton // đã checkin chưa checkout → xanh lá
                        : !!attendent?.Data?.PunchInUserTime &&
                            !!attendent?.Data?.PunchOutUserTime
                          ? styles.checkined // đã checkin và checkout
                          : styles.inAreaButton, // Trong khu vực, chưa chấm công đủ → xanh da trời
                  ]}
                >
                  <Icon
                    name={
                      !attendent?.Data?.PunchInUserTime
                        ? 'check-circle'
                        : 'alert-circle'
                    }
                    size={40}
                    color="white"
                  />
                  {!attendent?.Data?.PunchOutUserTime && (
                    <Text style={styles.buttonText}>CHẤM CÔNG</Text>
                  )}
                  <Text style={styles.buttonSubText}>
                    {!attendent?.Data?.PunchInUserTime
                      ? 'VÀO'
                      : !attendent?.Data?.PunchOutUserTime
                        ? 'RA'
                        : 'ĐÃ CHECK OUT'}
                  </Text>
                </View>
              </TouchableOpacity>
              {attendent?.InOut === 0 ? (
                <Text style={styles.warningText}>
                  Bạn cần ở trong khu vực làm việc để chấm công
                </Text>
              ) : null}
            </View>
            <View style={styles.scheduleContainer}>
              <View style={styles.sectionHeader}>
                <Icon name="clock" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Ca làm việc hôm nay</Text>
              </View>
              <View style={styles.scheduleRow}>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Giờ vào</Text>
                  <Text style={[styles.scheduleValue, { color: '#059669' }]}>
                    {attendent?.Data?.PunchInTime}
                  </Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Giờ ra</Text>
                  <Text style={[styles.scheduleValue, { color: '#F59E0B' }]}>
                    {attendent?.Data?.PunchOutTime}
                  </Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Tổng giờ</Text>
                  <Text style={[styles.scheduleValue, { color: '#3B82F6' }]}>
                    {attendent?.Data &&
                      subtractTimes(
                        attendent?.Data?.PunchOutTime,
                        attendent?.Data?.PunchInTime,
                      )}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.recordsContainer}>
              <View style={styles.sectionHeader}>
                <Icon name="calendar" size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Lịch sử</Text>
              </View>
              <ScrollView style={styles.recordsListScrollView}>
                <View style={styles.recordsList}>
                  {attendent?.Data?.PunchInUserTime && (
                    <View
                      style={[
                        styles.recordItem,
                        {
                          borderBottomWidth: attendent?.Data?.PunchOutUserTime
                            ? 1
                            : 0,
                          borderBottomColor: '#F3F4F6',
                        },
                      ]}
                    >
                      <View style={styles.recordLeft}>
                        <View
                          style={[
                            styles.recordDot,
                            {
                              backgroundColor: '#10B981',
                            },
                          ]}
                        />
                        <View style={styles.recordInfo}>
                          <Text style={styles.recordType}>Chấm công vào</Text>
                        </View>
                      </View>
                      <Text style={styles.recordTime}>
                        {attendent?.Data?.PunchInUserTime?.split(':')
                          .slice(0, 2)
                          .join(':')}
                      </Text>
                    </View>
                  )}
                  {attendent?.Data?.PunchOutUserTime && (
                    <View style={[styles.recordItem, { borderBottomWidth: 0 }]}>
                      <View style={styles.recordLeft}>
                        <View
                          style={[
                            styles.recordDot,
                            {
                              backgroundColor: '#F59E0B',
                            },
                          ]}
                        />
                        <View style={styles.recordInfo}>
                          <Text style={styles.recordType}>Chấm công ra</Text>
                        </View>
                      </View>
                      <Text style={styles.recordTime}>
                        {attendent?.Data?.PunchOutUserTime?.split(':')
                          .slice(0, 2)
                          .join(':')}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>{' '}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    flex: 1,
  },
  gradient: {
    height: Dimensions.get('window').height,
    backgroundColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {},
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  userRole: {
    fontSize: 14,
    color: '#BFDBFE',
    marginTop: 2,
  },
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
  expandButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
  gpsContainer: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    marginVertical: 10,
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsInfo: {
    marginLeft: 15,
    flex: 1,
  },
  gpsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  checkInButton: {
    width: 140,
    height: 140,
    borderRadius: 90,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  disabledButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonSubText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  warningText: {
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  scheduleContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
  },
  expandButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  expandButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 5,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleItem: {
    alignItems: 'center',
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  scheduleValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 30,
  },
  recordsList: {},
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  recordLocation: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  recordTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  noRecords: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 20,
    fontSize: 14,
  },
  recordsListScrollView: {
    maxHeight: 200, // Adjust this value as needed
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 50, // Bằng một nửa của width hoặc height
  },
  outOfAreaButton: {
    backgroundColor: '#FF4D4F', // đỏ: ngoài khu vực
  },
  inAreaButton: {
    backgroundColor: '#1E90FF', // xanh da trời: trong khu vực, chưa chấm công
  },
  checkined: {
    backgroundColor: '#acd926', //xanh lá mạ
  },
  checkedButton: {
    backgroundColor: '#F59E0B', // Cam: đã chấm công đủ
  },
});

export default Home;
