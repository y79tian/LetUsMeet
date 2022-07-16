import { combineReducers } from "redux";
import eventReducer from "../../features/events/eventReducer";
import testReducer from "../../features/sandbox/testReducer";
import modalReducer from "../common/modals/modalReducer";
import authReducer from "../../features/auth/authReducer";
import asyncReducer from "../async/asyncReducer";
import profileReducer from "../../features/profiles/profileReducer";

const rootReducer = combineReducers({
  test: testReducer,
  event: eventReducer,
  modal: modalReducer,
  auth: authReducer,
  async: asyncReducer,
  profile: profileReducer,
});

export default rootReducer;
