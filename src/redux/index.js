import { createStore } from 'redux';
import { getFromLocalStorage, saveToLocalStorageWithDebounce } from '../helpers/utils';
import projectsReducer, { initialState as projectsInitialState } from './projects/projectsReducer';

export const initialState = {
  projects: projectsInitialState,
};

const localStorageKey = 'test-app';
const preloadedState = getFromLocalStorage(localStorageKey) || initialState;

export default function rootReducer(state = {}, action) {
  return {
    projects: projectsReducer(state.projects, action),
  };
}

export const store = createStore(rootReducer, preloadedState);

store.subscribe(() => {
  saveToLocalStorageWithDebounce(localStorageKey, store.getState());
});
