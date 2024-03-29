export const setToken = (token) => {
  return {
    type: "SET_TOKEN",
    payload: token,
  };
};

export const setEmailtostore = (email) => {
  return {
    type: "SET_EMAIL",
    payload: email,
  };
};

export const setDIDInfo = (isSuccessful, errorCode, dataHash) => {
  return {
    type: "SET_DID_INFO",
    payload: { isSuccessful, errorCode, dataHash },
  };
};
