// import {createContext,useContext,useEffect,useState,type ReactNode,} from "react";

// import { getCurrentUser } from "./getUserData";

// interface UserMetadata {
//   name?: string;
//   job_title?: string;
// }

// interface UserData {
//   user_metadata?: UserMetadata;
// }

// interface AuthContextType {
//   user: UserData | null;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserData | null>(null);


//   useEffect(() => {
//     getCurrentUser()
//       .then((data) => setUser(data))
//       .catch(() => setUser(null));
      
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return context;
// };
