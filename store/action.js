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
