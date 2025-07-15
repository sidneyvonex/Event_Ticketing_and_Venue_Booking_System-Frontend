import type { ReactNode } from "react"

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState{
    user:null | any,
    token:string | null,
    isAuthenticated:boolean,
    userRole:null | string,
    profileUrl:null | string,
}

export interface UserLoginInputs{
    email:string,
    password:string
  }

 export  type ProtectedRouteProps={
    children:ReactNode
  }

   export interface EventsDataTypes{
    category:string,
    description:string,
    createdAt:string,
    eventId:number,
    eventImageUrl:string,
    eventDate:string,
    eventTime:string,
    eventTitle:string,
    ticketPrice:string,
    ticketsSold:number,
    updatedAt:string,
    venue:{
      venueName:string
      venueId:number,
      venueAddress:string,
      venueCapacity:number
    }
  
  }

  