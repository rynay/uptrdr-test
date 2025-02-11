import { createStore } from 'redux';
import { getFromLocalStorage, saveToLocalStorageWithDebounce } from '../helpers/utils';
import projectsReducer, { initialState as projectsInitialState, ProjectsState } from './projects/projectsReducer';

export const initialState = {
  projects: projectsInitialState,
};

const localStorageKey = 'test-app';
const preloadedState = getFromLocalStorage(localStorageKey) || initialState;

export default function rootReducer(
  state = { projects: {} },
  action: any
) {
  return {
    projects: projectsReducer(state.projects, action),
  };
}

export type AppState = {
  projects: ProjectsState,
}

export const store = createStore(rootReducer, preloadedState);

store.subscribe(() => {
  saveToLocalStorageWithDebounce(localStorageKey, store.getState());
});
