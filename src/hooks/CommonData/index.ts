import request from '@/services/Request';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPositions,
  setDeparments,
  setShifts,
  setEmployeersCommon,
} from '@/redux/slices/CommonDataSlice';

export const useCommonData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const getPositionPaging = async () => {
    try {
      const response = await request.get('api/Position/getPositionPaging');
      if (response.Success) {
        dispatch(setPositions(response.Data.Data));
      }
    } catch (error) {}
  };
  const getDeparmentPaging = async () => {
    try {
      const response = await request.get('/api/Department/getDepartmentPaging');
      if (response.Success) {
        dispatch(setDeparments(response.Data.Data));
      }
    } catch (error) {}
  };
  const getShiftPaging = async () => {
    try {
      const response = await request.get('/api/Shift/getShiftPaging');
      if (response.Success) {
        dispatch(setShifts(response.Data.Data));
      }
    } catch (error) {}
  };
  const getEmployeers = async () => {
    try {
      const response = await request.get(`api/Employee/getUserFull`);
      dispatch(setEmployeersCommon(response.Data.Data));
    } catch (error) {}
  };
  return {
    getPositionPaging,
    getDeparmentPaging,
    getShiftPaging,
    getEmployeers,
  };
};
