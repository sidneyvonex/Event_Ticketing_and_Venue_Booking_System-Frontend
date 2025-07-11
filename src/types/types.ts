import type { ReactNode } from "react"

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState{
    user:null | any,
    token:string | null,
    isAuthenticated:boolean,
    userRole:null | string,
}

export interface UserLoginInputs{
    email:string,
    password:string
  }

 export  type ProtectedRouteProps={
    children:ReactNode
  }