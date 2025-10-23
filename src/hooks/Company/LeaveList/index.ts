import { useMyAlert } from '@/components/AlertContext';
import request from '@/services/Request';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useLeaveList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const user = useSelector((state: any) => state.user);
  const pageSize = 6;
  const { showAlert } = useMyAlert();

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
        `api/Request/getRequestPaging?userId=${user.Id}&pageIndex=${page}&pageSize=${pageSize}`,
      );
      console.log('response', response);

      return response.Data.Data;
    } catch (error) {}
  };

  const approveRequest = async (item: any, status: number) => {
    try {
      const response = await request.post(
        `/api/Request/approveRequest?requestId=${
          item.ID
        }&status=${status}&categoryId=${item.CategoryID}`,
      );
      if (response.Success) {
        setData((prev) => {
          return prev.map((elm) => {
            if (item.ID === elm.ID) {
              return {
                ...elm,
                Status: status,
              };
            } else {
              return elm;
            }
          });
        });
      }
    } catch (error) {}
  };

  const handleConfirm = async (item: any, status: number) => {
    showAlert({
      title: 'Xác nhận',
      message: 'Bạn có muốn thực hiện',
      buttons: [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Chấp nhận',
          onPress: async () => {
            await approveRequest(item, status);
          },
        },
      ],
    });
  };

  useEffect(() => {
    loadData();
  }, [page]);
  const [categorys] = useState([
    {
      key: 1,
      label: 'Xin đi muộn',
    },
    {
      key: 4,
      label: 'Xin về sớm',
    },
    {
      key: 2,
      label: 'Xin nghỉ phép',
    },
    {
      key: 3,
      label: 'Giải trình',
    },
  ]);
  return {
    getListRequest,
    loadData,
    loading,
    data,
    setPage,
    hasMore,
    handleConfirm,
    categorys,
  };
};
