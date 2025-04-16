import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { getTicketCategories, resetTicketCategoriesStatus } from "store/action/TicketCategoriesAction"

export const useTicketCategories = () => {
  const dispatch = useDispatch()
  const ticketCategories = useSelector((state) => state)
  
  const getTicketCategoriesList = (params) => dispatch(getTicketCategories(params))

  const resetStatus = () => dispatch(resetTicketCategoriesStatus());

  return {
    ticketCategories,
    getTicketCategoriesList,
    resetStatus
  }
}