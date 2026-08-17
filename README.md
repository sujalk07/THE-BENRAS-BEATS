# The Benaras Beats

### Music for Mind & Soul

**The Benaras Beats** is a full-stack community platform built to promote **live music, mental well-being, and cultural engagement in Varanasi**. The platform provides a centralized system for discovering events, managing memberships, registering for programs, purchasing tickets, submitting artist applications, processing payments, and managing events through an administrative interface.

**Live Website:** https://thebenarasbeats.com

---

## Overview

The Benaras Beats was developed as a production-oriented web application for a community that organizes regular music programs in Varanasi.

The platform connects **audiences, artists, organizers, and sponsors** through a single digital platform. It handles both the public-facing experience and the backend workflows required to manage users, memberships, events, registrations, tickets, payments, and communications.

The project focuses on:

* Clean and responsive user experience
* Secure authentication and database access
* Membership-based event access
* Online ticketing and payment processing
* Artist and performer management
* Administrative workflows
* Transactional email communication
* Production deployment

---

## Key Features

### Event Management

Users can explore upcoming music events with information such as:

* Event title
* Description
* Date and time
* Venue
* Event capacity
* Ticket pricing
* Event images
* Registration availability

Administrators can create, update, and manage events through the administrative system.

### User Authentication

The application uses **Supabase Authentication** for user account management.

Users can:

* Create accounts
* Log in securely
* Maintain their profiles
* Access membership information
* Register for events
* View their ticket-related information

### Membership Management

The platform supports paid memberships with membership-specific benefits.

The membership system handles:

* Membership plans
* Pricing
* Membership status
* Start and expiration dates
* Member eligibility
* Membership verification
* Event access

The platform also supports a limited introductory membership plan. Once the introductory allocation is exhausted, the system prevents the discounted plan from becoming available again.

### Event Registration & Ticketing

Users can register for events depending on their membership and event access rules.

The system maintains:

* User registration
* Event information
* Ticket information
* Payment status
* Membership eligibility
* Ticket ownership

### Razorpay Payment Integration

The application includes **Razorpay integration** for processing online payments for memberships and event tickets.

The general payment workflow is:

```text
User selects Membership / Ticket
            |
            v
Create Payment Order
            |
            v
Razorpay Checkout
            |
            v
Payment Completed
            |
            v
Payment Verification
            |
            v
Database Updated
            |
            v
Membership / Ticket Activated
```

Razorpay webhook support is also configured to handle payment-related events securely.

### Artist Submissions

Artists can submit their information and performance details for consideration.

Administrators can:

* Review artist submissions
* Approve or reject submissions
* Manage performers
* Associate performers with events

### Sponsorship Support

The platform provides a digital channel for organizations and individuals interested in supporting the community's music programs through sponsorship.

### Transactional Emails

The application uses **Resend** for sending transactional emails related to platform workflows.

This can be used for communication such as:

* Registration confirmations
* Payment-related communication
* Membership information
* Event-related notifications
* Other transactional messages

### Certificate Support

The project includes certificate-related functionality using a configurable certificate template URL, allowing certificates to be generated or managed as part of the platform's workflow.

### Admin Dashboard

Administrative functionality provides control over core platform operations, including:

* Events
* Event registrations
* Memberships
* Tickets
* Performers
* Artist submissions
* Payment-related records
* User-related information

---

# Technology Stack

| Category          | Technology                  |
| ----------------- | --------------------------- |
| Frontend          | Next.js, React              |
| Language          | TypeScript                  |
| Styling           | Tailwind CSS                |
| Animations        | Framer Motion               |
| Backend           | Next.js API Routes          |
| Database          | PostgreSQL                  |
| Backend Platform  | Supabase                    |
| Authentication    | Supabase Auth               |
| Database Security | Supabase Row Level Security |
| Payments          | Razorpay                    |
| Email             | Resend                      |
| Deployment        | Vercel                      |
| Design            | Figma, Canva                |

---

# System Architecture

```text
                         ┌───────────────────┐
                         │       Users       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Next.js App     │
                         │ React + TypeScript│
                         │   Tailwind CSS    │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
      ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
      │    Supabase   │    │    Razorpay   │    │    Resend     │
      │               │    │               │    │               │
      │ PostgreSQL    │    │ Payments      │    │ Transactional │
      │ Authentication│    │ Checkout      │    │ Emails        │
      │ RLS           │    │ Webhooks      │    │               │
      └───────────────┘    └───────────────┘    └───────────────┘
              │
              ▼
      ┌───────────────────┐
      │  Admin Workflows  │
      │                   │
      │ Events            │
      │ Memberships       │
      │ Registrations     │
      │ Performers        │
      │ Tickets           │
      └───────────────────┘
```

---

# Database Design

The application uses **Supabase PostgreSQL** as its primary database.

Core tables include:

### `profiles`

Stores user profile information associated with authenticated users.

### `memberships`

Stores membership-related information including:

* User
* Membership plan
* Amount
* Status
* Start date
* Expiration date
* Creation timestamp

### `events`

Stores event information including:

* Event title
* Description
* Event date
* Venue
* Image
* Capacity
* Ticket price
* Creation timestamp

### `event_registrations`

Stores user registrations for events and maintains the relationship between users and events.

### `tickets`

Stores ticket-related information including:

* User
* Event
* Order
* Payment ID
* Amount paid
* Membership-related ticket information
* Creation timestamp

### `events_order`

Stores payment and order information associated with event purchases.

---

# Database Security

Database access is protected using **Supabase Row Level Security (RLS)**.

RLS policies are used to ensure that users can only access or modify data they are authorized to access.

Sensitive server-side operations use the **Supabase Service Role Key** and are kept away from client-side code.

This separation allows the application to maintain different access levels between:

```text
Public / Client
       |
       v
Authenticated User
       |
       v
Authorized Server Operation
       |
       v
Protected Database Operation
```

---

# Environment Variables

The application uses environment variables for Supabase, Razorpay, Resend, site configuration, and certificate-related functionality.

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_ID=your_razorpay_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Resend
RESEND_API_KEY=your_resend_api_key

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Certificates
CERTIFICATE_TEMPLATE_URL=your_certificate_template_url
```

### Environment Variable Reference

| Variable                        | Purpose                                    |
| ------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase client key                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-side administrative Supabase access |
| `NEXT_PUBLIC_RAZORPAY_ID`       | Razorpay client-side identifier            |
| `RAZORPAY_KEY_ID`               | Razorpay server-side key ID                |
| `RAZORPAY_KEY_SECRET`           | Razorpay server-side secret                |
| `RAZORPAY_WEBHOOK_SECRET`       | Razorpay webhook verification secret       |
| `RESEND_API_KEY`                | Resend API authentication                  |
| `NEXT_PUBLIC_SITE_URL`          | Application's production URL               |
| `CERTIFICATE_TEMPLATE_URL`      | Certificate template resource              |

> **Security:** Never commit actual environment variable values to GitHub. In particular, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `RESEND_API_KEY` must remain private.

---

# Project Structure

A simplified project structure:

```text
the-banaras-beats/
│
├── app/
│   ├── api/
│   │   ├── ...
│   │
│   ├── admin/
│   │   ├── ...
│   │
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
│   ├── Sponsors/
│   └── Footer/
│
├── lib/
│   ├── supabase/
│   └── ...
│
├── public/
│   ├── images/
│   └── ...
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.*
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

You will also need:

* A Supabase project
* A Razorpay account
* A Resend account

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd the-banaras-beats
```

Install dependencies:

```bash
npm install
```

---

## Configure Environment Variables

Create:

```text
.env.local
```

Add the required environment variables described in the [Environment Variables](#environment-variables) section.

---

## Run the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

# Production Deployment

The application is designed to be deployed using **Vercel**.

Typical deployment workflow:

```text
GitHub Repository
        |
        v
      Vercel
        |
        v
Build Next.js Application
        |
        v
Production Deployment
```

Before deploying, configure all required environment variables in the Vercel project settings.

The production environment should use production credentials for:

* Supabase
* Razorpay
* Resend
* Webhooks

---

# Security Practices

The project incorporates several security practices:

* Supabase Authentication for user identity
* PostgreSQL Row Level Security
* Server-side handling of sensitive operations
* Environment variables for secrets
* Razorpay payment verification
* Razorpay webhook verification
* Protected administrative operations
* Separation of public and server-side Supabase credentials

### Important

Never expose the following values in frontend code or commit them to version control:

```text
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RESEND_API_KEY
```

If any of these credentials are accidentally exposed, they should be rotated immediately.

---

# Payment Security

Payment-related operations are handled through server-side APIs.

The application does not rely solely on client-side payment status. Payment information is verified before updating important records such as memberships and tickets.

Razorpay webhooks provide an additional mechanism for receiving payment events from Razorpay.

```text
Client
  |
  | Payment Request
  v
Server API
  |
  | Create Order
  v
Razorpay
  |
  | Payment
  v
Razorpay Checkout
  |
  | Verification / Webhook
  v
Server
  |
  v
Supabase Database
```

---

# UI & Design

The interface is designed around the cultural and artistic identity of Varanasi.

The visual system incorporates:

* Dark and golden visual theme
* Typography-focused sections
* Music and cultural imagery
* Responsive layouts
* Motion-based interactions
* Event-focused content hierarchy

The application uses custom typography including:

* Cormorant Garamond
* Great Vibes
* Playfair Display

---

# Screenshots

Add screenshots of the major application sections here:

```text
Home Page
Events
Membership
Event Registration
Artist Submission
Payment Flow
Admin Dashboard
```

Example:

```md
![Home Page](./screenshots/home.png)
![Events](./screenshots/events.png)
![Membership](./screenshots/membership.png)
![Admin Dashboard](./screenshots/admin.png)
```

---

# Challenges & Engineering Considerations

Some of the important engineering challenges addressed during development include:

### Secure Database Access

Implementing Supabase RLS policies to allow authenticated users to access their own data while preventing unauthorized database operations.

### Membership Business Logic

Implementing introductory membership pricing with a permanent allocation limit rather than simply checking the current number of active members.

### Payment Integration

Connecting Razorpay with server-side order creation, payment verification, database updates, and webhook handling.

### Authentication & Authorization

Separating regular user functionality from protected administrative operations.

### Production Deployment

Managing environment variables and server-side configuration while deploying the Next.js application through Vercel.

---

# Future Improvements

Potential future improvements include:

* QR-based ticket verification at event venues
* Automated email notifications
* Automated membership renewal
* Event analytics and reporting
* Artist portfolio pages
* Advanced admin analytics
* Improved payment reconciliation
* Cloud-based media storage optimization
* Personalized event recommendations
* Progressive Web App support

---

# Learning Outcomes

This project provided practical experience in:

* Full-stack application development
* Next.js application architecture
* TypeScript
* React component design
* REST/API development
* PostgreSQL database design
* Supabase Authentication
* Row Level Security
* Payment gateway integration
* Webhook handling
* Environment and secret management
* Responsive UI development
* Production deployment
* Real-world business logic implementation

---

# Developer

**Sujal Kumar**

B.Tech Chemical Engineering
**IIT (BHU), Varanasi**

The Benaras Beats demonstrates practical experience in **full-stack web development, database design, authentication, payment integration, API development, security, responsive UI/UX, and production deployment**.

---

# License

This project is developed for **The Benaras Beats** platform. The source code, branding, content, and design may not be reused or redistributed without appropriate permission.
