const initialState = {
  token: null,
  email: "",
  didInfo: {
    isSuccessful: false,
    errorCode: null,
    dataHash: "",
  },
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_DID_INFO": // Handle the new action
      return {
        ...state,
        didInfo: {
          isSuccessful: action.payload.isSuccessful,
          errorCode: action.payload.errorCode,
          dataHash: action.payload.dataHash,
        },
      };
    default:
      return state;
  }
};

export default myReducer;
