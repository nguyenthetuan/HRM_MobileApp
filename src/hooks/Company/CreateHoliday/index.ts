import { myEmitter } from '@/components/EventBus';
import { EmitActionConstant } from '@/components/EventBus/components/EmitterConstant';
import request from '@/services/Request';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

export const useCreateHoliday = () => {
  const router = useRoute<any>();
  const user = useSelector((state: any) => state.user);
  const common = useSelector((state: any) => state.common);
  const [showDate, setShowDate] = useState(false);
  const [Errors, setErrors] = useState<any>({});

  const [formRequest, setFormRequest] = useState({
    ID: 0,
    UserID: user.Id,
    CategoryID: router?.params?.type || 0,
    DateRequest: router?.params?.date || new Date(),
    Reason: '',
    Status: 0,
    Time: null,
    ShiftId: 0,
  });

  const handleChange = (key: string, value: any) => {
    setFormRequest((prev: any) => {
      if (key === 'Time') {
        return {
          ...prev,
          [key]: Math.max(0, parseInt(value, 10)),
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

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

  const shift = useMemo(() => {
    return common.shifts.map((elm: any) => {
      return {
        key: elm.ID,
        label: elm.Name,
      };
    });
  }, [common.shifts]);

  const validate = () => {
    let valid = true;
    let newErrors: any = {};
    if (!formRequest.CategoryID) {
      newErrors.CategoryID = 'Loại đơn trống';
      valid = false;
    }
    if (!formRequest.ShiftId && formRequest.CategoryID === 2) {
      newErrors.ShiftId = 'Ca nghỉ trống';
      valid = false;
    }
    if (!formRequest.Reason || formRequest.Reason.trim() === '') {
      newErrors.Reason = 'Nội dung không được để trống';
      valid = false;
    }
    if (
      (!formRequest.Time || `${formRequest.Time}` === '0') &&
      (formRequest.CategoryID === 1 || formRequest.CategoryID === 4)
    ) {
      newErrors.Time = 'Thời gian nghỉ chưa hợp lệ';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const onSubmit = () => {
    if (validate()) {
      handleSave();
    }
  };
  const navigation = useNavigation();
  const handleSave = async () => {
    console.log('formRequest', formRequest);

    try {
      const response = await request.post(
        '/api/Request/createRequest',
        formRequest,
      );
      console.log('response', response);

      if (response.Success) {
        Toast.show({
          type: 'success', // 'success' | 'error' | 'info'
          text1: 'Bạn tạo đơn thành công',
        });
        myEmitter.emit(EmitActionConstant.GET_LIST_REQUEST, {});
        navigation.goBack();
      }
    } catch (error) {}
  };

  return {
    showDate,
    categorys,
    shift,
    navigation,
    common,
    handleSave,
    setShowDate,
    user,
    formRequest,
    Errors,
    handleChange,
    onSubmit,
  };
};
