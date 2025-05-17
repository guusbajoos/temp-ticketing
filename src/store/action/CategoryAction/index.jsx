import CategoryApi from "api/category";

import {
  GET_CATEGORY_BUSINESS_STATUS_LOADING,
  GET_CATEGORY_BUSINESS_STATUS_SUCCESS,
  GET_CATEGORY_BUSINESS_STATUS_FAILED,
  RESET_CATEGORY_BUSINESS_STATUS,
  GET_CATEGORY_BY_BUSINESS_STATUS_LOADING,
  GET_CATEGORY_BY_BUSINESS_STATUS_SUCCESS,
  GET_CATEGORY_BY_BUSINESS_STATUS_FAILED,
  RESET_CATEGORY_BY_BUSINESS_STATUS,
  GET_CATEGORY_LIST,
} from "../../type";

import { queryStringify, removeEmptyAttributes } from "utils/index";

export const getCategoryList = (param) => async (dispatch) => {
  const { data } = await CategoryApi.getCategoryList(param);

  dispatch({
    type: GET_CATEGORY_LIST,
    payload: data,
  });
};

export const getCategoryBusiness = (params) => async (dispatch) => {
  dispatch({
    type: GET_CATEGORY_BUSINESS_STATUS_LOADING,
  });

  try {
    const { data } = await CategoryApi.getCategoryBusiness(
      queryStringify(removeEmptyAttributes(params))
    );

    dispatch({ type: GET_CATEGORY_BUSINESS_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_BUSINESS_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    });
  } finally {
    dispatch({ type: RESET_CATEGORY_BUSINESS_STATUS });
  }
};

export const resetCategoryBusinessStatus = () => (dispatch) => {
  dispatch({
    type: RESET_CATEGORY_BUSINESS_STATUS,
  });
};

export const getCategoryByBusiness = (params) => async (dispatch) => {
  dispatch({
    type: GET_CATEGORY_BY_BUSINESS_STATUS_LOADING,
  });

  try {
    const { data } = await CategoryApi.getCategoryByBusiness(
        queryStringify(removeEmptyAttributes(params))
    );

    console.log(data, "data");

    dispatch({ type: GET_CATEGORY_BY_BUSINESS_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_BY_BUSINESS_STATUS_FAILED,
      error: {
        message: "Failed to fetch data",
        description: error.response.data.message,
      },
    });
  } finally {
    dispatch({ type: RESET_CATEGORY_BY_BUSINESS_STATUS});
  }
};