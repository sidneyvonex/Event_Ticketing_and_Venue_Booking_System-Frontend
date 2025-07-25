# 🎫 Event Ticketing and Venue Booking System - Frontend

A modern, responsive web application for managing events, venues, bookings, and payments. Built with React, TypeScript, and Vite for optimal performance and developer experience.

## 🌟 Features

### 🏠 **Public Features**
- **Event Discovery**: Browse and search upcoming events
- **Venue Information**: View detailed venue information and capacity
- **User Registration & Authentication**: Secure account creation and login
- **Event Booking**: Book tickets for events with real-time availability
- **Payment Processing**: Secure payment integration with multiple methods
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👑 **Admin Dashboard**
- **Event Management**: Create, edit, delete, and manage events
- **Venue Management**: Add and manage event venues
- **User Management**: View and manage user accounts
- **Booking Oversight**: Monitor all bookings and ticket sales
- **Payment Administration**: Track payments, process refunds, update statuses
- **Support System**: Handle user support tickets and inquiries
- **Analytics & Reporting**: Export data and view comprehensive statistics

### 👤 **User Dashboard**
- **Profile Management**: Update personal information and profile pictures
- **Booking History**: View past and upcoming bookings
- **Payment History**: Track payment transactions
- **Support Tickets**: Create and manage support requests
- **Event Notifications**: Stay updated on booked events

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Redux Toolkit with RTK Query for API management
- **Styling**: Tailwind CSS for responsive, utility-first design
- **Icons**: Lucide React for consistent iconography
- **Notifications**: Sonner for elegant toast notifications
- **Alerts**: SweetAlert2 for beautiful confirmation dialogs
- **Image Upload**: Cloudinary integration for media management
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
src/
├── Components/
│   ├── AdminDashboard/           # Admin-specific components
│   │   ├── AdminDashboardOverview.tsx
│   │   ├── AdminEvents.tsx
│   │   ├── AdminProfile.tsx
│   │   ├── AllBookings.tsx
│   │   ├── AllPayments.tsx       # Payment management with admin actions
│   │   ├── AllSupportTickets.tsx
│   │   └── AllVenues.tsx         # Venue CRUD operations
│   ├── Blog/                     # Blog-related components
│   │   └── AllBlogs.tsx
│   ├── DashboardDesign/          # Layout and navigation components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSideNav.tsx
│   │   ├── DashboardTopbar.tsx
│   │   ├── UserLayout.tsx
│   │   └── UserSideNav.tsx
│   ├── Events/                   # Event display components
│   │   ├── AllEvents.tsx
│   │   └── EventDetails.tsx
│   ├── Home/                     # Landing page components
│   │   ├── Hero.tsx
│   │   ├── UpcomingEvents.tsx
│   │   ├── Stats.tsx
│   │   └── WelcomeSection.tsx
│   ├── Login/                    # Authentication components
│   │   └── FormSec.tsx
│   ├── Register/
│   │   └── RegisterForm.tsx
│   └── UserDashboard/            # User-specific components
│       ├── UserDashboardOverview.tsx
│       ├── Events.tsx
│       ├── UserBookings.tsx
│       ├── UserPaymentsPage.tsx
│       ├── UserProfile.tsx
│       └── UserSupport.tsx
├── Features/                     # Redux store and API
│   ├── api/                      # RTK Query API endpoints
│   │   ├── BookingsApi.ts
│   │   ├── EventApi.ts
│   │   ├── PaymentsApi.ts        # Payment management API
│   │   ├── SupportTicketApi.ts
│   │   ├── userApi.ts
│   │   ├── VenueApi.ts           # Venue management API
│   │   └── uploadApi.ts          # Cloudinary image upload
│   ├── app/
│   │   └── store.ts              # Redux store configuration
│   └── auth/
│       └── authSlice.ts          # Authentication state management
├── Pages/                        # Route components
│   ├── AdminDashboard.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── Events.tsx
│   ├── Help.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── UserDashboard.tsx
│   └── Venues.tsx
├── types/
│   └── types.ts                  # TypeScript type definitions
├── utils/
│   └── imageUploadUtils.ts       # Image validation utilities
├── assets/                       # Static assets
│   ├── Hero.jpeg
│   ├── Logo.svg
│   └── react.svg
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Event_Ticketing_and_Venue_Booking_System-Frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://event-ticketing-and-venue-booking-system.onrender.com/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
# or
npm run build
```

## 🎯 Key Features Implementation

### 🔐 **Authentication System**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Protected routes and route guards
- Persistent login state with Redux

### 💳 **Payment Management**
- Multiple payment methods (M-Pesa, Card, Bank Transfer)
- Real-time payment status tracking
- Admin payment oversight with quick actions:
  - Mark payments as completed/failed
  - Process refunds for completed payments
  - Export payment reports to CSV
- Secure payment processing integration

### 🏢 **Venue Management**
- Complete CRUD operations for venues
- Search and filter capabilities
- Capacity management and tracking
- Venue statistics and analytics

### 📊 **Admin Dashboard Features**
- Comprehensive analytics and statistics
- User management and oversight
- Event and booking management
- Support ticket handling
- Payment administration tools
- Data export capabilities

### 👤 **User Experience**
- Intuitive dashboard with booking history
- Profile management with image upload
- Real-time notifications and updates
- Responsive design for all devices
- Dark/light mode support (if implemented)

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and better IDE support
- **Prettier**: Code formatting (if configured)

### State Management
- **Redux Toolkit**: Efficient state management
- **RTK Query**: Powerful data fetching and caching
- **Persistent state**: User authentication and preferences

### UI/UX
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive design**: Mobile-first approach
- **Component-based architecture**: Reusable UI components
- **Loading states**: Smooth user experience during API calls

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with complex layouts
- **Tablet**: Adapted layouts with touch-friendly interfaces
- **Mobile**: Streamlined experience with mobile-optimized navigation

## 🌐 API Integration

The frontend integrates with a comprehensive backend API providing:
- **RESTful endpoints** for all resources
- **Authentication & authorization**
- **File upload capabilities**
- **Real-time data synchronization**
- **Error handling and validation**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Integration with more payment providers
- [ ] Event recommendation system
- [ ] Social media integration

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

