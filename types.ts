
export interface StatData {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'slate' | 'blue' | 'amber';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  avatar: string;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refills: number;
  lastFilled: string;
}

export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Offline' | 'On Break';
  avatar: string;
}

export interface WellnessData {
  day: string;
  activityScore: number;
  hydrationLevel: number;
}

export interface PatientDetails {
  fullName: string;
  dateOfBirth: string;
  age: string;
  bloodGroup: string;
  height: string;
  weight: string;
  lastBloodTest: string;
  hasBloodPressure: boolean;
  hasBloodSugar: boolean;
  hasThyroid: boolean;
  recentSurgeries: string;
  previousDoctor: string;
  latestMedicines: string[];
  profilePicture: string | null;
}

export interface DoctorDetails {
  email?: string;
  fullName: string;
  age: string;
  specialization: string;
  hospitalName: string;
  experienceYears: string;
  licenseNumber: string;
  consultationFee: string;
  profilePicture: string | null;
}

export interface BookedAppointment {
  id: string;
  date: string;
  area: string;
  hospital: string;
  doctor: string;
  doctorEmail?: string; // To identify which doctor's dashboard to show this in
  time: string;
  patientEmail: string;
  patientName: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
}
