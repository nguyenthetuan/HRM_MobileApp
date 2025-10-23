import request from '@/services/Request';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useEmployeer = () => {
  const [employeers, setEmployeers] = useState([]);
  const user = useSelector((state: any) => state.user);
  const getEmployeers = async (departmentId: number) => {
    try {
      const response = await request.get(
        user.PositionId === 4
          ? `api/Employee/getUserFull`
          : `api/Employee/getEmployeeByDepartmentId?departmentId=${departmentId}`,
      );
      setEmployeers(response.Data.Data);
    } catch (error) {}
  };

  return {
    getEmployeers,
    employeers,
  };
};
