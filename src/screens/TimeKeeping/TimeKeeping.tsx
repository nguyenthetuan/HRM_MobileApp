import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Header from '@/components/header';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import PopupAction from './Components/PopupAction';
import { UseTimeKeeping } from '@/hooks/TimeKeeping';
import moment from 'moment';
import DayCell from './Components/DayCell';
import Loading from '@/components/Loading';
import { useFocusEffect } from '@react-navigation/native';
import { downloadAndExport } from '@/untils/dowloadFile';

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ],
  dayNames: [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

export default function TimeKeeping() {
  const { getAttendanceByMonth, historyMonth, loading, user } =
    UseTimeKeeping();
  const [dates, setDate] = useState<string | undefined>(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const getMonthRange = (dateInput: any) => {
    const date = new Date(dateInput);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const formatDate = (d: any) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const downloadFile = async () => {
    const url = `https://hrm.sintecha.com/api/Attendance/export-excel?from=${getMonthRange(dates).startDate}&to=${getMonthRange(dates).endDate}&departmentId=${
      user.DepartmentId
    }&userId=${user.Id}&NameFile=timeKeeping.xlsx`;
    console.log('url', url);

    try {
      downloadAndExport(url);
    } catch (err) {
      console.error('❌ Lỗi tải file:', err);
      throw err;
    }
  };

  const refPopAction = useRef<any>(null);

  const markedDates = useMemo(() => {
    const marks: any = {};
    historyMonth.forEach((item) => {
      const dateKey = moment(item.AttendanceDate).format('YYYY-MM-DD');
      let status;
      switch (item.AttendanceStatus) {
        case 8: // Không có mặt, không đơn nghỉ
        case 4: // Nghỉ phép (có duyệt)
          status = 'leave';
          break;
        case 1:
          status = 'valid'; //chấm 2 lầ oke
          break;
        case 2: // Đi muộn
        case 3: // Về sớm
        case 5: // Về sớm
        case 6: // Quên chấm công ra
        case 7: // Quên chấm công vào
          status = 'invalid';
          break;
        default:
          break;
      }
      if (status) {
        marks[dateKey] = { status: status };
      }
    });

    if (dates) {
      marks[moment(dates).format('YYYY-MM-DD')] = {
        ...(marks[moment(dates).format('YYYY-MM-DD')] || {}),
        selected: true,
      };
    }
    return marks;
  }, [dates, historyMonth]);

  const attendanceCount = useMemo(() => {
    const counts = { valid: 0, invalid: 0, leave: 0 };
    Object.values(markedDates).forEach((item: any) => {
      if (item.status === 'valid') counts.valid += 1;
      if (item.status === 'invalid') counts.invalid += 1;
      if (item.status === 'leave') counts.leave += 1;
    });
    return counts;
  }, [markedDates]);

  const plus = () => {
    refPopAction?.current?.open();
  };

  const historyDay = useMemo(() => {
    return historyMonth.find((elm) => elm.AttendanceDate === dates);
  }, [dates, historyMonth]);

  useEffect(() => {
    const month = moment(new Date()).get('month');
    const year = moment(new Date()).get('year');
    getAttendanceByMonth(month + 1, year);
  }, []);
  useFocusEffect(
    useCallback(() => {
      const month = moment(new Date()).get('month');
      const year = moment(new Date()).get('year');
      getAttendanceByMonth(month + 1, year);
    }, []),
  );

  const hasCalled = useRef(false); // Chỉ gọi 1 lần khi chạm đỉnh
  const handleScroll = async (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0 && !hasCalled.current) {
      hasCalled.current = true;
      const month = moment(dates).get('month');
      const year = moment(dates).get('year');
      getAttendanceByMonth(month + 1, year);
    }
    if (offsetY > 0) {
      hasCalled.current = false;
    }
  };

  return (
    <ScrollView
      scrollEnabled
      style={style.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {loading && <Loading />}
      <Header
        title="Bảng chấm công"
        rightButton={
          <TouchableOpacity onPress={() => downloadFile()}>
            <SimpleLineIcons
              name="arrow-down-circle"
              size={20}
              color={'#fff'}
            />
          </TouchableOpacity>
        }
      />
      <View style={style.body}>
        <View style={style.datePicker}>
          <Calendar
            onDayPress={(day) => {
              const selectedDateStr = moment(day.dateString).format(
                'YYYY-MM-DDT00:00:00',
              );
              setDate(selectedDateStr);
            }}
            current={moment().format('YYYY-MM-DD')}
            markedDates={markedDates}
            dayComponent={DayCell}
            onMonthChange={(date) =>
              getAttendanceByMonth(date.month, date.year)
            }
          />
        </View>
        <View style={style.inforMonth}>
          <View style={style.work}>
            <View style={style.wrapFinger}>
              <View style={style.finger}>
                <MaterialIcons name="fingerprint" size={25} color={'#22c55e'} />
              </View>
              <Text>{attendanceCount.valid}</Text>
            </View>
            <Text>Làm việc</Text>
          </View>
          <View style={style.work}>
            <View style={style.wrapFinger}>
              <View style={style.bag}>
                <Feather name="calendar" size={25} color={'red'} />
              </View>
              <Text>{attendanceCount.leave}</Text>
            </View>
            <Text>Ngày nghỉ</Text>
          </View>
          <View style={style.work}>
            <View style={style.wrapFinger}>
              <View style={style.bag}>
                <MaterialIcons
                  name="warning-amber"
                  size={25}
                  color={'#f97316'}
                />
              </View>
              <Text>{attendanceCount.invalid}</Text>
            </View>
            <Text>Cảnh báo</Text>
          </View>
        </View>
        <View style={style.deatailDay}>
          <View style={style.headerDetail}>
            <Text style={style.txtDetail}>CHI TIẾT NGÀY</Text>
            <TouchableOpacity onPress={plus} style={style.btnCreate}>
              <Text style={style.txtCreate}>Tạo đơn</Text>
              <Fontisto name="plus-a" size={14} color={'#3b82f6'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.detailDay}>
          {historyDay && (
            <>
              {historyDay?.PunchInUserTime && (
                <View style={style.recordItem}>
                  <View style={style.recordLeft}>
                    <View
                      style={[
                        style.recordDot,
                        {
                          backgroundColor: '#10B981',
                        },
                      ]}
                    />
                    <View style={style.recordInfo}>
                      <Text style={style.recordType}>Chấm công vào</Text>
                    </View>
                  </View>
                  <Text style={style.recordTime}>
                    {historyDay?.PunchInUserTime?.split(':')
                      .slice(0, 2)
                      .join(':')}
                  </Text>
                </View>
              )}
              {historyDay?.PunchOutUserTime && (
                <View style={style.recordItem}>
                  <View style={style.recordLeft}>
                    <View
                      style={[
                        style.recordDot,
                        {
                          backgroundColor: '#F59E0B',
                        },
                      ]}
                    />
                    <View style={style.recordInfo}>
                      <Text style={style.recordType}>Chấm công ra</Text>
                    </View>
                  </View>
                  <Text style={style.recordTime}>
                    {historyDay?.PunchOutUserTime?.split(':')
                      .slice(0, 2)
                      .join(':')}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <PopupAction ref={refPopAction} dates={dates} />
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    height: Dimensions.get('window').height,
    flex: 1,
  },
  calendar: {
    backgroundColor: '#fff',
  },
  headerDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    backgroundColor: '#fff',
  },
  deatailDay: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  txtDetail: {
    fontWeight: 'bold',
  },
  finger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'blue',
  },
  wrapFinger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inforMonth: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginTop: 2,
    paddingVertical: 5,
  },
  work: {
    alignItems: 'center',
  },
  bag: {
    padding: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingLeft: 16,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  deleteBtn: {
    padding: 6,
  },
  detailDay: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  txtCreate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginRight: 5,
  },
  btnCreate: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
