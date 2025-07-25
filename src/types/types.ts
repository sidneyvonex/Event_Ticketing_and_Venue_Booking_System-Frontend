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
    totalAmount:string,
    bookingStatus:string,
    createdAt:string,
    upadtedAt:string,
    user?: {
      firstName: string;
      lastName: string;
      email: string;
  };
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

 export interface PaymentDataTypes{
  paymentId: number;
  userId?: number;
  bookingId: number;
  amount: string; // API returns as string like '300.00'
  paymentMethod: string;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentDate: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Note: booking, user, event details are not included in current API response
  booking?: {
    bookingId: number;
    userId: number;
    eventId: number;
    quantity: number;
    totalAmount: number;
    bookingStatus: string;
    createdAt: string;
    user: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      contactPhone: string;
      profilePicture: string;
    };
    event: {
      eventId: number;
      eventTitle: string;
      description: string;
      eventImageUrl: string;
      category: string;
      eventDate: string;
      eventTime: string;
      ticketPrice: number;
      ticketsTotal: number;
      ticketsSold: number;
      venue: {
        venueId: number;
        venueName: string;
        venueAddress: string;
        venueCapacity: number;
      };
    };
  };
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
  },
  responses?: SupportTicketResponseTypes[]
 }

 export interface SupportTicketResponseTypes{
  responseId: number,
  ticketId: number,
  responderId: number,
  responderType: 'user' | 'admin',
  message: string,
  createdAt: string,
  responder: {
    firstName: string,
    lastName: string,
    email: string,
    role?: string
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