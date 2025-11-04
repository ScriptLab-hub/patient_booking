
# MedEase – Patient Booking System (Technical Documentation)

MedEase is a modern, web-based patient appointment booking system designed to streamline the process of connecting patients with doctors. It provides a clean, user-friendly interface for user registration, login, department browsing, doctor selection, and appointment management.

This document serves as a deep technical guide for developers to understand the internal workings, architecture, and logic of the MedEase application.

---

## 🧭 Project Overview

MedEase solves the common problem of inefficient and time-consuming manual appointment booking. It offers a digital platform where:

-   **Patients** can register, log in, view medical departments, select a doctor, and book an appointment for a specific date and time.
-   **Patients** can also view and cancel their upcoming appointments.
-   **The system** provides a secure and persistent user session, ensuring a smooth user experience across browser sessions.

The application is designed as a **Single Page Application (SPA)**, where UI components are rendered dynamically without full page reloads, managed by a simple state-based routing logic in `App.tsx`.

## 🧩 Tech Stack

-   **Framework**: Vite + React
-   **Language**: TypeScript
-   **Backend-as-a-Service (BaaS)**: Supabase (Authentication & Database)
-   **Styling**: Tailwind CSS (via CDN)
-   **State Management**: React Context API (`AuthContext`)

## 📂 Folder Structure

The project follows a standard React component-based architecture.

```
medease-–-your-smart-appointment-partner/
├── components/             # Reusable React components and page components
│   ├── AuthContext.tsx     # ✅ Global state management for auth and data
│   ├── LoginPage.tsx       # ✅ User login form and logic
│   ├── RegisterPage.tsx    # ✅ User registration form and logic
│   ├── BookPage.tsx        # Appointment booking form
│   ├── MyAppointmentsPage.tsx # Displays user's appointments
│   ├── Header.tsx          # Site-wide navigation header
│   └── ... (other UI components)
├── lib/                    # Core utility libraries
│   └── supabaseClient.ts   # ✅ Initializes and exports the Supabase client
├── .env.local              # Environment variables (must be created manually)
├── index.html              # The main HTML entry point for the Vite app
├── App.tsx                 # Root component with routing logic
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite configuration file
```

---

## 🧱 How the App Works: Data Flow

The application's logic revolves around a central `AuthContext` that manages user state and interacts with Supabase.

**User Journey:**
`HomePage` → `RegisterPage` → **Supabase Auth (Sign Up)** → **`profiles` Table (Insert)** → `LoginPage` → **Supabase Auth (Sign In)** → `MyAppointmentsPage` → `BookPage` → **`appointments` Table (Insert)**

---

## 🔐 Authentication Flow

#### 1. User Registration

1.  **UI (`RegisterPage.tsx`):** A user fills in their name, email, phone, and password.
2.  **Context Call:** On submission, `handleSubmit` calls the `register` function from `AuthContext`.
3.  **Supabase Auth (`AuthContext.tsx`):**
    -   The `register` function calls `supabase.auth.signUp()` with the user's email and password. This creates a new user in the `auth.users` table in Supabase.
4.  **Profile Creation:**
    -   If `signUp` is successful, it returns the new user's data, including a unique `id`.
    -   The code then calls `supabase.from('profiles').insert()` to create a new row in the `public.profiles` table, linking it with the `auth.users` table via the `id`.

#### 2. User Login

1.  **UI (`LoginPage.tsx`):** A user enters their email and password.
2.  **Context Call:** `handleSubmit` calls the `login` function from `AuthContext`.
3.  **Supabase Auth (`AuthContext.tsx`):**
    -   The `login` function calls `supabase.auth.signInWithPassword()`.
    -   Supabase verifies the credentials. If successful, it returns a `session` object containing a JWT. This token is automatically stored by `supabase-js` in the browser's local storage.

#### 3. Session Restoration

1.  **Initial Load (`AuthContext.tsx`):**
    -   When `AuthProvider` mounts, a `useEffect` hook runs `supabase.auth.getSession()`.
    -   This checks local storage for a valid session token. If found, the user's session is restored.
2.  **State Changes (`onAuthStateChange`):**
    -   `AuthProvider` subscribes to `supabase.auth.onAuthStateChange`. This listener detects auth events in real-time (e.g., `SIGNED_IN`, `SIGNED_OUT`) and updates the global `user` state.

---

## 🧠 Core Components Explained

#### `AuthContext.tsx`

This is the brain of the application. It's a global state provider for user data, authentication status, and all data-related functions.

-   **`AuthProvider` Component**: Wraps the entire app to provide context.
-   **State Variables**:
    -   `user`: Stores the logged-in user object from Supabase.
    -   `profile`: Stores the public profile data (`full_name`, `phone`) from the `profiles` table.
    -   `appointments`: An array of the user's appointments.
-   **`useEffect` (Session Management)**: On initial load, it restores the user session from local storage and subscribes to auth state changes.
-   **`login(email, password)`**: Trims inputs and calls `supabase.auth.signInWithPassword()`. On success, it fetches the user's profile and appointments.
-   **`register(...)`**: Calls `supabase.auth.signUp()` and then inserts a new record into the `profiles` table.
-   **`logout()`**: Calls `supabase.auth.signOut()` and clears all user-related state.
-   **`bookAppointment(...)`**: Checks for duplicates, generates a unique ticket number, and inserts a new row into the `appointments` table.
-   **`useAuth()` Hook**: A custom hook for easy access to the context values.

#### `LoginPage.tsx`

-   **Functionality**: Renders the sign-in form.
-   **State**: Manages `email`, `password`, `error`, and `loading` for the form.
-   **`handleSubmit(e)`**:
    -   Calls the `login` function from `AuthContext`.
    -   If successful, calls `navigate('my-appointments')` to redirect the user.
    -   If it fails, it displays the error message returned from the context.

#### `RegisterPage.tsx`

-   **Functionality**: Renders the sign-up form.
-   **`handleSubmit(e)`**:
    -   Performs client-side validation (e.g., password length, phone format).
    -   Calls the `register` function from `AuthContext`.
    -   On success, shows a success message and redirects the user to their dashboard.

---

## 🗃️ Database Schema

The Supabase database consists of two primary tables. Doctor and department data is currently hardcoded in the frontend.

#### `profiles` table

Stores public user information, linked one-to-one with the `auth.users` table.

| Column      | Type      | Description                                     |
| ----------- | --------- | ----------------------------------------------- |
| `id`        | `uuid`    | **Primary Key**. Foreign key to `auth.users.id`. |
| `full_name` | `text`    | The user's full name.                           |
| `phone`     | `text`    | The user's phone number.                        |
| `email`     | `text`    | The user's email address.                       |

#### `appointments` table

| Column         | Type        | Description                                       |
| -------------- | ----------- | ------------------------------------------------- |
| `id`           | `bigint`    | **Primary Key**. Auto-incrementing integer.       |
| `user_id`      | `uuid`      | Foreign key to `auth.users.id`.                   |
| `patient_name` | `text`      | Name of the patient for the appointment.          |
| `department`   | `text`      | The medical department (e.g., 'Cardiology').      |
| `doctor_name`  | `text`      | The name of the selected doctor.                  |
| `date`         | `date`      | The scheduled date of the appointment.            |
| `time`         | `time`      | The scheduled time of the appointment.            |
| `ticket_no`    | `text`      | A unique, generated ticket number for reference.  |
| `status`       | `text`      | The current status ('Pending' or 'Cancelled').    |

---

## ⚙️ Supabase Configuration

The connection to Supabase is configured in `lib/supabaseClient.ts`.

-   **`import.meta.env`**: It reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the `.env.local` file. This is the standard way to access environment variables in a Vite project.
-   **Validation**: The file includes a crucial check to ensure these variables are defined. If they are missing, it throws a descriptive error in the console, which is extremely helpful for debugging setup issues.
-   **`createClient`**: This function from `@supabase/supabase-js` initializes the Supabase client.
-   **`export const supabase`**: It exports a single, shared instance of the client to be used throughout the application.

---

## 🧰 Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd medease-–-your-smart-appointment-partner
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env.local` file:**
    -   In the project root, create a file named `.env.local`.
    -   Add your Supabase credentials to it:
        ```
        VITE_SUPABASE_URL="https://<your-project-id>.supabase.co"
        VITE_SUPABASE_ANON_KEY="your-public-anon-key"
        ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 🔒 Security Notes

By default, Supabase tables are created with **Row Level Security (RLS) disabled**. This was useful for initial testing, but it is a major security risk in production. Without RLS, any user with the public `anon_key` could potentially read, modify, or delete all data in your tables.

**Action Required:** You must enable RLS and create policies to secure your data.

**Example RLS Policy for `appointments`:**
This policy ensures that users can only see and manage their own appointments.

```sql
-- 1. Enable RLS on the table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy for authenticated users
CREATE POLICY "Users can manage their own appointments."
ON public.appointments FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## ⚡ Common Issues & Fixes

-   **Issue**: `400 Bad Request` or `"Invalid login credentials"` on login.
    -   **Cause**: This almost always means the email/password is wrong, or the user's email has not been verified. By default, Supabase requires email confirmation.
    -   **Fix**: For development, you can disable email confirmation in your Supabase Dashboard under **Authentication → Providers → Email**. For production, ensure users check their email for a verification link.

-   **Issue**: `"Supabase URL or Anon Key not set"` error on startup.
    -   **Cause**: The `.env.local` file is missing, or the variables are named incorrectly.
    -   **Fix**: Ensure the file exists in the project root and that the variables are prefixed with `VITE_`. Restart the dev server after making changes.

-   **Issue**: Data (like appointments) is not showing up after login, and you see a `401 Unauthorized` error in the network tab.
    -   **Cause**: RLS is enabled on your table, but you have not created a `SELECT` policy to allow logged-in users to read data.
    -   **Fix**: Add the appropriate RLS policies as described in the "Security Notes" section.

---

## 🎓 Viva Notes (How to Explain the Project)

"My project, MedEase, is a patient appointment booking system built with React and Supabase."

"The core of the application is the **`AuthContext`**. It's a global state manager that handles everything related to the user. When the app loads, it checks if the user has a session. When a user logs in, the `login` function in this context calls Supabase, gets the user data, and then fetches their profile and appointments. This data is then available to all other components."

"The **authentication flow** is straightforward: a user signs up, which creates a record in Supabase's `auth` system and also a corresponding record in our public `profiles` table. Login validates against the `auth` system."

"For the **database**, I used Supabase to create `profiles` and `appointments` tables. To keep data secure, I would implement **Row Level Security**, which means writing SQL rules so that a user can only see and manage their own appointments. For example, the rule is `auth.uid() = user_id`."

"The frontend is a **Single Page Application**. I used a state variable in the main `App.tsx` component to manage which page is currently visible, creating a fast, responsive user experience without full page reloads."



## 🏗️ System Architecture (Visual Representation)

```text
             ┌────────────────────────────┐
             │        👤 User              │
             │  (Patient using browser)   │
             └────────────┬───────────────┘
                          │
                          │ interacts via UI
                          ▼
         ┌─────────────────────────────────────────┐
         │         💻 Frontend – MedEase App       │
         │  (React + TypeScript + Tailwind CSS)    │
         │─────────────────────────────────────────│
         │ Components:                             │
         │ - RegisterPage.tsx                      │
         │ - LoginPage.tsx                         │
         │ - BookPage.tsx                          │
         │ - MyAppointmentsPage.tsx                │
         │                                         │
         │ Context Logic:                          │
         │ - AuthContext.tsx handles:              │
         │   → signUp / signIn                     │
         │   → getSession / logout                 │
         │   → fetchAppointments / book / cancel   │
         └─────────────────────┬───────────────────┘
                               │ API Calls via Supabase SDK
                               ▼
             ┌───────────────────────────────────────┐
             │   🔐 Supabase Backend (BaaS)           │
             │  - Auth Service (signUp/signIn)        │
             │  - Database (PostgreSQL)               │
             │  - Row Level Security (optional)       │
             └─────────────────────┬─────────────────┘
                                   │
                                   ▼
        ┌──────────────────────────────────────────────┐
        │         🗃️ Database Schema (PostgreSQL)       │
        │----------------------------------------------│
        │  auth.users                                  │
        │   ├── id (uuid)                              │
        │   ├── email                                  │
        │   └── password (hashed)                      │
        │                                              │
        │  public.profiles                             │
        │   ├── id (fk → auth.users.id)                │
        │   ├── full_name                              │
        │   ├── phone                                  │
        │   └── email                                  │
        │                                              │
        │  public.appointments                         │
        │   ├── id (pk)                                │
        │   ├── user_id (fk → auth.users.id)           │
        │   ├── doctor_name, department, date, time     │
        │   ├── ticket_no                              │
        │   └── status ('Pending' / 'Cancelled')       │
        └──────────────────────────────────────────────┘



> 💡 **Note:**  
> The frontend and backend are decoupled — meaning React handles UI and state,  
> while Supabase provides backend APIs for authentication and database operations.  
> This makes the app serverless, scalable, and easy to deploy on platforms like Netlify or Vercel.
