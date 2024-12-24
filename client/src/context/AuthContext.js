import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {


   return (
       <AuthContext.Provider value={{ /* state  */ }}>
           {children}
       </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}