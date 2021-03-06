import * as actionTypes from './actionTypes';
import axios from '../../axios-sub';

export const fetchSubscriptions = (loading = true) => {
  return (dispatch, getState) => {
    if(loading) {
      dispatch(fetchSubscriptionsStart());
    }
    const { auth } = getState();
    const { userId, token } = auth;

    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get(`/subscriptions.json${queryParams}`).then( res => {
      const subscriptions = [];
      for(let key in res.data) {
        subscriptions.push({
          ...res.data[key],
          id: key
        });
      }
      dispatch(fetchSubscriptionsSuccess(subscriptions));
    }).catch(error => fetchSubscriptionsError(error))
  }
};

const fetchSubscriptionsSuccess = (subscriptions) => {
  return {
    type: actionTypes.FETCH_SUBSCRIPTIONS_SUCCESS,
    subscriptions
  };
};
const fetchSubscriptionsStart = () => {
  return {
    type: actionTypes.FETCH_SUBSCRIPTIONS_START
  };
};
const fetchSubscriptionsError = (error) => {
  return {
    type: actionTypes.FETCH_SUBSCRIPTIONS_ERROR,
    error
  };
};

const removeSubscriptionSuccess = (subscription) => {
  return {
    type: actionTypes.REMOVE_SUBSCRIPTION_SUCCESS,
    subscription
  };
};
const removeSubscriptionStart = () => {
  return {
    type: actionTypes.REMOVE_SUBSCRIPTION_START
  };
};
const removeSubscriptionError = () => {
  return {
    type: actionTypes.REMOVE_SUBSCRIPTION_ERROR,
    error: 'Failed to remove subscription'
  };
};

const updateSubscriptionSuccess = (subscription) => {
  return {
    type: actionTypes.UPDATE_SUBSCRIPTION_SUCCESS,
    subscription
  };
};
const updateSubscriptionStart = (subscription) => {
  return {
    type: actionTypes.UPDATE_SUBSCRIPTION_START,
    subscription
  };
};
const updateSubscriptionError = () => {
  return {
    type: actionTypes.UPDATE_SUBSCRIPTION_ERROR,
    error: 'Failed to update subscription'
  };
};

const addSubscriptionStart = (subscription) => {
  return {
    type: actionTypes.ADD_SUBSCRIPTION_START,
    subscription
  };
};
const addSubscriptionError = () => {
  return {
    type: actionTypes.ADD_SUBSCRIPTION_ERROR,
    error: 'Failed to add a subscription'
  };
};
const addSubscriptionSuccess = () => {
  return {
    type: actionTypes.ADD_SUBSCRIPTION_SUCCESS
  };
};


export const addSubscription = (subscription, token) => {
  return dispatch => {
    dispatch(addSubscriptionStart());
    axios.post(`/subscriptions.json?auth=${token}`, subscription).then( res => {
        dispatch(addSubscriptionSuccess());
        dispatch(fetchSubscriptions( false));
    }).catch(error => {
      dispatch(addSubscriptionError({error}));
    })
  }
};

export const removeSubscription = (subscriptionId, token) => {
  return dispatch => {
    dispatch(removeSubscriptionStart());
    axios.delete(`/subscriptions/${subscriptionId}.json?auth=${token}`).then( res => {
      console.log(res);
      dispatch(removeSubscriptionSuccess());
      dispatch(fetchSubscriptions(false));
    }).catch(error => {
      dispatch(removeSubscriptionError({error}));
    })
  }
};

export const updateSubscription = ({subscription, id}, token) => {
  return dispatch => {
    dispatch(updateSubscriptionStart());
    axios.put(`/subscriptions/${id}.json?auth=${token}`, subscription).then( res => {
      dispatch(updateSubscriptionSuccess());
      dispatch(fetchSubscriptions(false));
    }).catch(error => {
      dispatch(updateSubscriptionError({error}));
    })
  }
};

export const updateEditedSubscriptionValue = (value, formIdentifier) => {
  return {
    type: actionTypes.UPDATE_EDITED_SUBSCRIPTION_FORM_VALUE,
    payload: {value, formIdentifier}
  };
};

const editSubscription = (subscriptionId) => {
  return {
    type: actionTypes.SET_EDITED_SUBSCRIPTION,
    subscriptionId
  };
};

const setFreshSubscription = () => {
  return {
    type: actionTypes.SET_FRESH_EDITED_SUBSCRIPTION
  };
};

export const setEditedSubscription = (subscriptionId) => {
  return dispatch => {
    dispatch(editSubscription(subscriptionId));
    dispatch(toggleEditionModal());
  }
};

export const setFreshEditedSubscription = () => {
  return dispatch => {
    dispatch(setFreshSubscription());
    dispatch(toggleEditionModal());
  }
};

export const toggleEditionModal = () => {
  return {
    type: actionTypes.TOGGLE_EDITION_MODAL
  };
};
