import { createContext, useContext } from 'react';

type ContextProps = {
  selectedOption: string,
  changeSelectedOption: VoidFunction | ((value: string) => void),
}

const defaultContextProps: ContextProps = {
  selectedOption: '',
  changeSelectedOption: () => {},
}

const SelectContext = createContext(defaultContextProps);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Error in creating the context');
  }
  return context;
};

export { useSelectContext, SelectContext };
