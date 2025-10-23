import { myEmitter } from '@/components/EventBus';
import { EmitActionConstant } from '@/components/EventBus/components/EmitterConstant';
import request from '@/services/Request';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { pick } from '@react-native-documents/picker'; // import picker
import { Platform } from 'react-native';
import moment from 'moment';
import RNFS from 'react-native-fs';

export const useCreateExpense = () => {
  const user = useSelector((state: any) => state.user);
  const common = useSelector((state: any) => state.common);
  const [showDate, setShowDate] = useState(false);
  const [Errors, setErrors] = useState<any>({});

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const navigation = useNavigation<any>();
  const [formRequest, setFormRequest] = useState({
    ID: 0,
    Status: 0, // trường hợp trưởng phòng xin kinh phí chuyển sang trạng thái 2
    UserID: user.Id,
    DateRequest: moment(new Date()).format('YYYY-MM-DD'),
    Reason: '',
    Amount: '',
    ExpenseType: '',
    DepartmentId: user.DepartmentId,
    ListUserNotify: [],
  });

  const handleSelectFollower = (employeer: any) => {
    setFormRequest((prev: any) => {
      if (
        !prev?.ListUserNotify.find((elm: any) => elm === employeer.ID) ||
        prev?.ListUserNotify?.length === 0
      ) {
        return {
          ...prev,
          ListUserNotify:
            prev.ListUserNotify.length === 0
              ? [employeer.ID]
              : [...prev.ListUserNotify, employeer.ID],
        };
      } else {
        return {
          ...prev,
          ListUserNotify: prev?.ListUserNotify?.filter(
            (elm: any) => elm !== employeer.ID,
          ),
        };
      }
    });
  };

  const handleChange = (key: string, value: any) => {
    setFormRequest((prev: any) => {
      if (key === 'Amount') {
        const numericText = value.replace(/[^0-9]/g, '');
        return {
          ...prev,
          [key]: Math.max(0, parseInt(numericText, 10)),
          Status: 0,
          // Status:
          //   user.PositionId === 1
          //     ? Math.max(0, parseInt(numericText, 10)) >= 10000000
          //       ? 2
          //       : 1
          //     : 0, // leader xin kinh phí lớn hơn 10 triệu thì xin gđ>kết toán. <10 triệu kế toán duyệt luôn
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const validate = () => {
    let valid = true;
    let newErrors: any = {};
    if (!formRequest.Reason || formRequest.Reason.trim() === '') {
      newErrors.Reason = 'Nội dung không được để trống';
      valid = false;
    }
    if (`${formRequest.Amount}` === ``) {
      newErrors.Amount = 'Số tiền không hợp lệ';
      valid = false;
    }
    if (`${formRequest.ExpenseType}` === '') {
      newErrors.ExpenseType = 'Không được để trống';
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
  const handleSave = async () => {
    try {
      const formData = new FormData();
      // append các field trong formRequest
      Object.keys(formRequest).forEach((key) => {
        const value = (formRequest as any)[key];
        if (key === 'ListUserNotify' && value.length > 0) {
          value.forEach((elm: any) => {
            formData.append('ListUserNotify', elm);
          });
        } else if (key !== 'ListUserNotify') {
          formData.append(
            key,
            value != null ? (key === 'Amount' ? parseFloat(value) : value) : '',
          );
        }
      });

      // Xử lý file
      if (selectedFile && selectedFile.length > 0) {
        const file = selectedFile[0];
        const sourcePath = file.fileCopyUri || file.uri;
        const fileName = file.name ?? `upload_${Date.now()}`;
        const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        try {
          // copy file về thư mục DocumentDirectory của app
          if (
            Platform.OS === 'android' &&
            sourcePath.startsWith('content://')
          ) {
            // Trường hợp content://
            await RNFS.copyFile(sourcePath, destPath);
          } else {
            // Trường hợp đã có file://
            const normalizedSource = sourcePath.replace('file://', '');
            await RNFS.copyFile(normalizedSource, destPath);
          }
          // append file sau khi copy
          formData.append('Attachment', {
            uri: `file://${destPath}`, // đường dẫn tuyệt đối
            type: file.type ?? 'application/octet-stream',
            name: fileName,
          } as any);
        } catch (copyErr) {
          console.error('Lỗi copy file:', copyErr);
        }
      }

      // gọi API
      const response = await request.post(
        '/api/ExRequest/createExRequest',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: (data) => data, // giữ nguyên FormData
        },
      );

      console.log('response', response);

      if (response.Success) {
        Toast.show({
          type: 'success',
          text1: 'Bạn tạo đơn thành công',
        });
        myEmitter.emit(EmitActionConstant.GET_LIST_EXPENSE, {});
        navigation.goBack();
      }
    } catch (error) {
      console.error('Lỗi lưu:', error);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra khi lưu đơn',
      });
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await pick({
        type: [
          'application/pdf',
          'image/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ], // pdf, image, doc, docx
      });

      if (result) {
        setSelectedFile(result);
      }
    } catch (err: any) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('Người dùng hủy chọn file');
      } else {
        console.error('Lỗi chọn file:', err);
      }
    }
  };
  return {
    showDate,
    navigation,
    common,
    handleSave,
    setShowDate,
    user,
    formRequest,
    Errors,
    handleChange,
    onSubmit,
    handlePickFile,
    selectedFile,
    handleSelectFollower,
  };
};
