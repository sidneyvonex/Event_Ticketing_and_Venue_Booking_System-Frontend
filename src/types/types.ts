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

  export interface BookingsDataTypes{
    bookingId:number,
    userId:number,
    eventId:number,
    quantity:number,
    totalAmount:number,
    bookingStatus:string,
    createdAt:string,
    upadtedAt:string,
    event:{
      eventTitle:string,
      eventDate:string,
      eventTime:string,
      ticketPrice:number,
      ticketsTotal:number,

      venue:{
        venueName:string,
      },
    },
    payments:{
      amount:number,
      paymentStatus:string,
      transactionId:string,
    }
  }

 export  interface PaymentDataTypes{
  paymentId:number,
  bookingId:number,
  amount:number,
  paymentStatus:string,
  paymentDate:string,
  paymentMethod:string,
  transactionId:string,
  createdAt:string,
  updatedAt:string,
  booking:{
    userId:number,
    eventId:number,
    bookingStatus:string,
    quantity:number,
    totalAmount:number,
    event:{
      eventTitle:string,
      eventDate:string,
      eventTime:string,
      venue:{
        venueName:string,
      }
    }

  },
 }

 export interface SupportTicketDataTypes{
  ticketId:number,
  userId:number,
  subject:string,
  description:string,
  category:string,
  supportTicketStatus:string,
  createdAt:string,
  updatedAt:string,
  user:{
    firstName:string,
    lastName:string,
    email:string,
  }
 }

export interface UserDataTypes{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
}