import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getClinicReport, resetClinicReportStatus } from "store/action/ClinicReportAction";

export const useClinicReport = () => {
  const dispatch = useDispatch()
  const clinicReport = useSelector((state) => state)

  const getClinicReportList = (params) => dispatch(getClinicReport(params))

  const resetStatus = () => dispatch(resetClinicReportStatus());

  return {
    clinicReport,
    getClinicReportList,
    resetStatus
  }
}