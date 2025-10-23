import request from '@/services/Request';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const UseTimeKeeping = () => {
  const [historyMonth, setHistoryMonth] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((elm: any) => elm.user);

  const getAttendanceByMonth = async (month: any, year: any) => {
    try {
      setLoading(true);
      const response = await request.get(
        `/api/Attendance/getAttendanceByMonth?thang=${month}&nam=${year}&userId=${user.Id}&pageIndex=1&pageSize=50`,
      );
      setLoading(false);
      setHistoryMonth(response.Data.Data);
    } catch (error) {}
  };

  return {
    historyMonth,
    getAttendanceByMonth,
    loading,
    user,
  };
};
