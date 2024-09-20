import { useContext } from 'react';
import { RequestContext, RequestContextType } from '../contexts/RequestContext';


export const useRequest = (): RequestContextType => {
          const context = useContext(RequestContext);
          if (!context) {
                    throw new Error('useRequest must be used within an RequestProvider');
          }
          return context;
};
