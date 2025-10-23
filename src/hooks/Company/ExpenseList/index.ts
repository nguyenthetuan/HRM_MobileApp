import { useMyAlert } from '@/components/AlertContext';
import request from '@/services/Request';
import { downloadAndExport } from '@/untils/dowloadFile';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useExpenseList = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const deparments = useSelector((state: any) => state.common.deparments);
  const user = useSelector((state: any) => state.user);

  const pageSize = 6;
  const { showAlert } = useMyAlert();

  const loadData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newData: any = await getListExpense(page);
    if (newData.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...newData]);
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  const getListExpense = async (page: number) => {
    try {
      const response = await request.get(
        `/api/ExRequest/getRequestExPaging?pageIndex=${page}&pageSize=${pageSize}`,
      );
      return response.Data.Data;
    } catch (error) {}
  };

  const approveRequest = async (item: any, status: number) => {
    try {
      const response = await request.post(
        `/api/ExRequest/approveExRequest?requestId=${item.Id}&status=${status}&userIdA=${user.Id}`,
      );
      if (response.Success) {
        setData((prev) => {
          return prev.map((elm) => {
            if (item.Id === elm.Id) {
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

  const downloadFile = async (Attment: string) => {
    const url = `https://hrm.sintecha.com/Uploads/${Attment}`;
    try {
      downloadAndExport(url);
    } catch (err) {
      console.error('❌ Lỗi tải file:', err);
      throw err;
    }
  };
  useEffect(() => {
    loadData();
  }, [page]);

  return {
    getListExpense,
    loadData,
    loading,
    data,
    setPage,
    hasMore,
    handleConfirm,
    deparments,
    user,
    downloadFile,
  };
};
