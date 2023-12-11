import { createContext, useContext } from 'react';
import { AppVariables, TAppContext } from '../meta';

/**
 *
 * @param context
 */
export function setupAppContext(context: TAppContext) {
  return createContext<TAppContext>(context);
}
export const AppContext = setupAppContext(AppVariables);

/**
 *
 */
export function useAppContext() {
  return useContext(AppContext);
}
