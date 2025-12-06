export enum RelationshipType {
  LOVE = 'Love',
  FRIENDSHIP = 'Friendship',
  FAMILY = 'Family',
  RIVALRY = 'Rivalry'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

// Underlying Visual Archetypes (Hidden from user, derived from answers)
export enum CosmicShape {
  CRYSTAL = 'Crystal', // Sharp, Structured
  NEBULA = 'Nebula',   // Soft, Cloud-like
  THUNDER = 'Thunder'  // Chaotic, Branching
}

export enum CosmicMotion {
  GLASS = 'Glass', // Slow rotation
  STEEL = 'Steel', // Locked, vibrating
  WATER = 'Water'  // Flowing
}

// We no longer use CosmicColor enum for logic, as color is now determined by RelationshipType per PRD 3.B
// But we keep Q2 answer index or mapping for AI context.

export interface UserInput {
  name1: string;
  gender1: Gender;
  name2: string;
  gender2: Gender;
  relationship: RelationshipType;

  // Visual Logic Drivers (Derived)
  qShape: CosmicShape;
  qMotion: CosmicMotion;

  // Text for AI Prompt (The actual text user selected)
  q1Text: string;
  q2Text: string;
  q3Text: string;

  // The actual question asked (Context for AI)
  q1Question: string;
  q2Question: string;
  q3Question: string;
}

export interface SimulationResult {
  archetypeTitle: string;
  quote: string;
  score: number;
  insight: string;
}

export type AppStep = 'INPUT' | 'SIMULATING' | 'RESULT';