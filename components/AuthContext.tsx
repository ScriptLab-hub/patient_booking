'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// ---------------------
// Type Definitions
// ---------------------
export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: number;
  user_id: string;
  patient_name: string;
  phone: string;
  department: string;
  doctor_name: string;
  date: string;
  time: string;
  symptoms: string;
  ticket_no: string;
  status: 'Pending' | 'Cancelled';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  appointments: Appointment[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password?: string
  ) => Promise<{ error: Error | null }>;
  bookAppointment: (
    appointmentData: Omit<
      Appointment,
      'id' | 'user_id' | 'ticket_no' | 'status' | 'created_at'
    >
  ) => Promise<{ error: Error | null }>;
  cancelAppointment: (appointmentId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------
  // Session Initialization
  // ---------------------
  useEffect(() => {
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('❌ Error getting session:', error.message);
        const session = data?.session;
        setUser(session?.user ?? null);

        if (session?.user) {
          await Promise.all([fetchProfile(session.user), fetchAppointments(session.user)]);
        }
      } catch (err) {
        console.error('❌ Unexpected session init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await Promise.all([fetchProfile(session.user), fetchAppointments(session.user)]);
      } else {
        setProfile(null);
        setAppointments([]);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------------------
  // Profile + Appointments Fetch
  // ---------------------
  const fetchProfile = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) console.error('❌ Error fetching profile:', error.message);
      else setProfile(data);
    } catch (err) {
      console.error('❌ Unexpected profile fetch error:', err);
    }
  };

  const fetchAppointments = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('❌ Error fetching appointments:', error.message);
      else setAppointments(data || []);
    } catch (err) {
      console.error('❌ Unexpected appointments fetch error:', err);
    }
  };

  // ---------------------
  // LOGIN
  // ---------------------
  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { error: new Error('Please enter both email and password.') };
      }

      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      console.log('🧾 Attempting login with:', { cleanEmail, cleanPassword });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        console.error('❌ Supabase login error:', error.message);
        return { error: new Error(error.message) };
      }

      if (!data?.user) {
        return { error: new Error('No user data returned after login.') };
      }

      setUser(data.user);
      await Promise.all([fetchProfile(data.user), fetchAppointments(data.user)]);

      console.log('✅ Login successful:', data.user.email);
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      return { error: new Error(err.message || 'Unexpected login error') };
    }
  };

  // ---------------------
  // REGISTER
  // ---------------------
  const register = async (name: string, email: string, phone: string, password?: string) => {
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password?.trim() ?? '';

      if (cleanPassword.length < 6) {
        return { error: new Error('Password must be at least 6 characters.') };
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signUpError) return { error: new Error(signUpError.message) };
      if (!authData.user) return { error: new Error('Registration succeeded but no user returned.') };

      // Use upsert to prevent "duplicate key" errors on re-registration attempts.
      // This will create the profile if it doesn't exist, or update it if it does.
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: name.trim(),
          phone: phone.trim(),
          email: cleanEmail,
        });

      if (profileError) return { error: new Error(profileError.message) };

      console.log('✅ User registered:', cleanEmail);
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Unexpected registration error') };
    }
  };

  // ---------------------
  // LOGOUT
  // ---------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAppointments([]);
    console.log('👋 User logged out.');
  };

  // ---------------------
  // BOOK APPOINTMENT
  // ---------------------
  const bookAppointment = async (
    appointmentData: Omit<
      Appointment,
      'id' | 'user_id' | 'ticket_no' | 'status' | 'created_at'
    >
  ) => {
    try {
      if (!user) return { error: new Error('User not logged in.') };

      const { data: existing, error: fetchError } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user.id)
        .eq('doctor_name', appointmentData.doctor_name)
        .eq('date', appointmentData.date)
        .eq('time', appointmentData.time)
        .eq('status', 'Pending');

      if (fetchError) return { error: new Error(fetchError.message) };
      if (existing && existing.length > 0)
        return { error: new Error('You already have an appointment with this doctor at the selected time.') };

      const dateStr = appointmentData.date.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const ticket_no = `APT-${dateStr}-${randomSuffix}`;

      const { error } = await supabase.from('appointments').insert({
        ...appointmentData,
        user_id: user.id,
        ticket_no,
        status: 'Pending',
      });

      if (error) return { error: new Error(error.message) };
      await fetchAppointments(user);
      console.log('✅ Appointment booked successfully!');
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Unexpected appointment booking error') };
    }
  };

  // ---------------------
  // CANCEL APPOINTMENT
  // ---------------------
  const cancelAppointment = async (appointmentId: number) => {
    if (!user) return;
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'Cancelled' })
      .eq('id', appointmentId)
      .eq('user_id', user.id);

    if (error) console.error('❌ Error cancelling appointment:', error.message);
    else await fetchAppointments(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        appointments,
        loading,
        login,
        logout,
        register,
        bookAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------
// HOOK
// ---------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
