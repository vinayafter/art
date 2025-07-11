import { supabase } from './supabase';
import { WorkoutPlan } from '@/types/workout';

// Get workout plans for a specific client
export const getWorkoutPlansForClient = async (clientId: string): Promise<WorkoutPlan[]> => {
  try {
    console.log('Fetching workout plans for client:', clientId);
    
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }

    console.log('Found workout plans:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getWorkoutPlansForClient:', error);
    return [];
  }
};

// Get a specific workout plan by ID
export const getWorkoutPlanById = async (planId: string): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching workout plan:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getWorkoutPlanById:', error);
    return null;
  }
};

// Create a new workout plan
export const createWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert({
        ...planData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createWorkoutPlan:', error);
    return null;
  }
};

// Update an existing workout plan
export const updateWorkoutPlan = async (planId: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', planId)
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .single();

    if (error) {
      console.error('Error updating workout plan:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateWorkoutPlan:', error);
    return null;
  }
};

// Delete a workout plan
export const deleteWorkoutPlan = async (planId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId);

    if (error) {
      console.error('Error deleting workout plan:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteWorkoutPlan:', error);
    return false;
  }
};

// Get all workout plans for a trainer
export const getWorkoutPlansForTrainer = async (trainerId: string): Promise<WorkoutPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trainer workout plans:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWorkoutPlansForTrainer:', error);
    return [];
  }
};

// Get active workout plans (for admin/overview)
export const getActiveWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        client:profiles!workout_plans_client_id_fkey(id, full_name, email),
        trainer:profiles!workout_plans_trainer_id_fkey(id, full_name, email)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active workout plans:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActiveWorkoutPlans:', error);
    return [];
  }
};