export interface Mentor {
  id: string;
  name: string;
  photo: string;
  college: string;
  branch: string;
  year: string;
  studentsGuided: number;
  verified: boolean;
}

export interface Batch {
  id: string;
  name: string;
  tag: string;
  urgencyTag: string;
  description: string;
  batchStrength: number;
  seatsRemaining: number;
  highlights: string[];
  duration: string;
  originalPrice: number;
  discountedPrice: number;
  mentors: Mentor[];
}

export interface BatchFeature {
  title: string;
  description: string;
  icon: string;
}
