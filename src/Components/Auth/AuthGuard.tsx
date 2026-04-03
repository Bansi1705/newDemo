import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface authProps {
  redirect?: string;
  required?: boolean;
  children: ReactNode;
}
export function AuthGuard({
  children,
  redirect = "/",
  required = true,
}: authProps) {
  const authData=sessionStorage.getItem("LoginUser");
  const authorized=!!authData;

  if(required && !authorized){
    return <Navigate to={redirect} replace />
  }
   if(!required && authorized){
    return <Navigate to="/home" replace />
  }
  return <>{children}</>;
}
