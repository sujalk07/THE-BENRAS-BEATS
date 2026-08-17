# The Benaras Beats

### Music for Mind & Soul

**The Benaras Beats** is a full-stack community platform built to promote live music, mental well-being, and cultural engagement in Varanasi. The platform connects audiences, artists, and event organizers through a unified system for event discovery, memberships, registrations, ticketing, and payments.

**Live Website:** [The Benaras Beats](https://thebenarasbeats.com)

---

## Overview

The platform is designed to manage the complete lifecycle of music events, from publishing and discovering events to registration, membership verification, ticketing, and payment processing.

The project was developed as a production-oriented full-stack application with a focus on **scalable architecture, secure data access, responsive UI, and real-world payment workflows**.

### Key Features

* **Event Management** — Create, publish, and manage upcoming music events with venue, capacity, pricing, dates, and event details.
* **User Authentication** — User registration, login, and profile management using Supabase Authentication.
* **Membership Management** — Membership plans with pricing, activation, expiration, and membership-status tracking.
* **Event Registration & Ticketing** — Registration and ticket purchasing with membership-based access rules.
* **Payment Integration** — Razorpay integration for processing online payments.
* **Artist Submissions** — Artists can submit their profiles and performances for consideration.
* **Admin Management** — Administrative workflows for managing events, registrations, performers, memberships, and requests.
* **Database Security** — PostgreSQL database protected using Supabase Row Level Security (RLS).
* **Responsive Interface** — Responsive design optimized for desktop and mobile devices.
* **Modern UI** — Custom-designed interface with animations and a visual identity centered around music and the cultural character of Varanasi.

---

## Technology Stack

| Category          | Technologies                |
| ----------------- | --------------------------- |
| Frontend          | Next.js, React, TypeScript  |
| Styling           | Tailwind CSS                |
| Animations        | Framer Motion               |
| Backend           | Next.js API Routes          |
| Database          | PostgreSQL via Supabase     |
| Authentication    | Supabase Auth               |
| Database Security | Supabase Row Level Security |
| Payments          | Razorpay                    |
| Deployment        | Vercel                      |
| Design            | Figma, Canva                |

---

## System Architecture

```text
                         Users
                           |
                           v
                +----------------------+
                |    Next.js Frontend  |
                | React / TypeScript   |
                | Tailwind CSS         |
                +----------+-----------+
                           |
              +------------+-------------+
              |                          |
              v                          v
     +----------------+          +----------------+
     |    Supabase    |          |    Razorpay    |
     |                |          |                |
     | Auth           |          | Payments       |
     | PostgreSQL     |          | Checkout       |
     | RLS            |          | Verification   |
     +----------------+          +----------------+
              |
              v
     +----------------+
     | Admin Workflows |
     | Event Management|
     | Memberships     |
     | Registrations   |
     +----------------+
```

---

## Core Modules

### 1. Event Management

Events contain information such as:

* Event title and description
* Date and time
* Venue
* Event capacity
* Ticket price
* Event image
* Registration status

The system allows administrators to create and manage events while users can discover and register for available programs.

### 2. Membership System

The membership module manages:

* Membership plans
* Membership pricing
* Membership status
* Start and expiration dates
* Member eligibility
* Event access

The platform also supports limited introductory membership pricing, where availability is controlled based on the number of memberships sold.

### 3. Ticketing and Registration

Users can register for events based on the event's access rules.

The system maintains:

* User information
* Event information
* Registration status
* Ticket information
* Payment information
* Membership eligibility

### 4. Payment Processing

Razorpay is integrated to handle online payments for memberships and event tickets.

The general workflow is:

```text
Select Membership / Ticket
          |
          v
Create Payment Order
          |
          v
Razorpay Checkout
          |
          v
Payment Completion
          |
          v
Payment Verification
          |
          v
Update Database
          |
          v
Membership / Ticket Activation
```

### 5. Artist Management

Artists can submit their information for consideration by the event organizers. Administrators can review submissions and manage performers for upcoming programs.

### 6. Admin System

The administrative functionality provides control over:

* Events
* Event registrations
* Performers
* Artist submissions
* Memberships
* Tickets
* Payment-related records

---

## Database Design

The application uses **Supabase PostgreSQL** as its primary database.

Core tables include:

```text
profiles
    |
    +-- User information

memberships
    |
    +-- Membership plans and status

events
    |
    +-- Event information

event_registrations
    |
    +-- User-event registrations

tickets
    |
    +-- Issued event tickets

events_order
    |
    +-- Payment and order information
```

### Database Security

Supabase Row Level Security (RLS) policies are used to restrict database access based on authentication state and user permissions.

This prevents unauthorized users from accessing or modifying protected records.

---

## Project Structure

A simplified project structure:

```text
the-banaras-beats/
│
├── app/
│   ├── api/
│   ├── admin/
│   ├── events/
│   ├── membership/
│   └── ...
│
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── UpcomingEvents/
│   ├── MembershipBenefits/
│   ├── PerformSection/
│   ├── Founder/
│   └── Footer/
│
├── lib/
│   ├── supabase/
│   └── ...
│
├── public/
│   └── images/
│
├── .env.local
├── package.json
├── tailwind.config.*
└── README.md
```

---

## Local Development

### Prerequisites

* Node.js
* npm
* Supabase project
* Razorpay account

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd the-banaras-beats
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and configure the required credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Deployment

The application is deployed using **Vercel**.

Deployment requires configuring the required environment variables in the Vercel project settings, particularly the Supabase and Razorpay credentials.

---

## Security Considerations

The application follows several security practices:

* Supabase Authentication for user identity
* Row Level Security for database access control
* Server-side handling of sensitive payment operations
* Environment variables for credentials and secrets
* Payment verification before updating transaction records
* Restricted administrative operations

Sensitive credentials should never be committed to the repository.

---

## Future Enhancements

Planned or potential improvements include:

* QR-based ticket verification at event venues
* Automated email and notification system
* Event analytics and reporting
* Automated membership renewal
* Artist portfolio pages
* Improved payment reconciliation
* Cloud-based media storage
* Personalized event recommendations
* Progressive Web App support

---

## Developer

**Sujal Kumar**
B.Tech Chemical Engineering
IIT (BHU), Varanasi

The project demonstrates practical experience in **full-stack development, database design, authentication, API development, payment integration, responsive UI development, security, and production deployment**.

---

## License

This project is intended for the development and operation of The Benaras Beats platform. Licensing and reuse terms should be defined according to the project's intended distribution.
