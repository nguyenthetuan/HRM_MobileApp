import { useEmitter } from '@/components/EventBus';
import { EmitActionConstant } from '@/components/EventBus/components/EmitterConstant';
import request from '@/services/Request';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

export const useMyExpenseList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector((state: any) => state.user);
  const pageSize = 10;
  const loadData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newData: any = await getListRequest(page);

    if (newData.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...newData]);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  const getListRequest = async (page: number) => {
    try {
      const response = await request.get(
        `/api/ExRequest/getRequestExPagingInvid?userId=${user.Id}&pageIndex=${page}&pageSize=${pageSize}`,
      );
      return response.Data.Data;
    } catch (error) {}
  };

  useEffect(() => {
    loadData();
  }, [page]);

  useEmitter(EmitActionConstant.GET_LIST_EXPENSE, (payload) => {
    setData([]);
    loadData();
  });
  const deleteRequestEx = async (id: any) => {
    try {
      const response = await request.delete(
        `/api/ExRequest/deleteExRequest?id=${id}`,
      );
      if (!response.Success && response.Message === 'Request send ') {
        Alert.alert('Thông báo', 'Đơn đã dược duyệt không thể xoá');
      }
      if (response.Success) {
        setData((prev) => prev.filter((item) => item.Id !== id));
      }
    } catch (error) {}
  };
  return {
    getListRequest,
    loadData,
    loading,
    data,
    setPage,
    hasMore,
    setData,
    deleteRequestEx,
  };
};
