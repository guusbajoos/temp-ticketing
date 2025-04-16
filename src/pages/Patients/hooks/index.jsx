import { useDispatch } from "react-redux";
import {
  getPatients,
  getPatientByPhone,
  getPatientTicketByPhone,
  updatePatientProfile,
  resetPatientStatus,
  getPatientTicketRelatedByNumber,
  getPatientHistoryByPhoneNumber,
} from "store/action/PatientsAction";
import { useSelector } from "react-redux";

export const usePatients = () => {
  const dispatch = useDispatch();
  const patients = useSelector((state) => state);

  const getPatientList = (params) => dispatch(getPatients(params));

  const getPatientByPhoneNumber = (phone) => dispatch(getPatientByPhone(phone));

  const getPatientTicketsByPhoneNumber = (phone, params) =>
    dispatch(getPatientTicketByPhone(phone, params));

  const getPatientTicketRelated = (ticketNumber) =>
    dispatch(getPatientTicketRelatedByNumber(ticketNumber));

  const getPatientHistory = (phone, params) =>
    dispatch(getPatientHistoryByPhoneNumber(phone, params));

  const updatePatientProfileExtra = (payload) =>
    dispatch(updatePatientProfile(payload));

  const resetStatus = () => dispatch(resetPatientStatus());

  return {
    getPatientList,
    getPatientByPhoneNumber,
    getPatientTicketsByPhoneNumber,
    getPatientTicketRelated,
    getPatientHistory,
    updatePatientProfileExtra,
    resetStatus,
    patients,
  };
};
