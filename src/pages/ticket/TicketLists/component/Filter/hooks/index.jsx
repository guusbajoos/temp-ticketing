import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { getBusiness, resetBusinessStatus } from "store/action/BusinessAction"
import { getClinicLocation } from "store/action/ClinicLocationAction"

export const useBusiness = () => {
  const dispatch = useDispatch()
  const business = useSelector((state) => state)

  const getBusinessList = (params) => dispatch(getBusiness(params))

  const resetStatus = () => dispatch(resetBusinessStatus());

  return {
    business,
    getBusinessList,
    resetStatus
  }
}

export const useClinicLocation = () => {
  const dispatch = useDispatch()
  const clinicLocation = useSelector((state) => state)

  const getClinicLocationList = (params) => dispatch(getClinicLocation(params))

  const resetStatus = () => dispatch(resetBusinessStatus());

  return {
    clinicLocation,
    getClinicLocationList,
    resetStatus
  }
}