import request from '@/services/Request';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useNotification = () => {
  const [data, setData] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);

  const getListExpense = async () => {
    try {
      const response = await request.get(
        `/api/Request/getMessagePagingInd?userId=${user.Id}`,
      );
      setData(response.Data.Data);
    } catch (error) {
      console.log('err', error);
    }
  };

  const deleteNotification = async (id: any) => {
    try {
      const response = await request.delete(
        `/api/Request/deleteMessage?id=${id}`,
      );
    } catch (error) {}
  };

  const updateNotification = async (id: any) => {
    try {
      const response = await request.post(
        `/api/Request/updateMessage?id=${id}`,
      );
      setData((prev) => {
        return prev.map((elm) => (id === elm.ID ? { ...elm, Status: 1 } : elm));
      });
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      getListExpense();
    }, []),
  );

  return {
    getListExpense,
    data,
    user,
    setData,
    updateNotification,
    deleteNotification,
  };
};
