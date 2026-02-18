
import { CareTeamMember, WellnessData } from './types';

export const CARE_TEAM: CareTeamMember[] = [
  { id: '1', name: 'Dr. Nikhilesh', role: 'Primary Care Physician', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=nikhilesh' },
  { id: '2', name: 'Dr. Kaushik', role: 'Clinical Nurse', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=kaushik' },
  { id: '3', name: 'Dr. Srikanth Marri', role: 'Pharmacy Assistant', status: 'On Break', avatar: 'https://i.pravatar.cc/150?u=srikanth' },
  { id: '4', name: 'Dr. Thraimabica Sastry', role: 'Specialist Assistant', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=thraimabica' },
];

export const WELLNESS_HISTORY: WellnessData[] = [
  { day: 'Mon', activityScore: 65, hydrationLevel: 80 },
  { day: 'Tue', activityScore: 72, hydrationLevel: 75 },
  { day: 'Wed', activityScore: 85, hydrationLevel: 90 },
  { day: 'Thu', activityScore: 40, hydrationLevel: 65 },
  { day: 'Fri', activityScore: 55, hydrationLevel: 85 },
  { day: 'Sat', activityScore: 90, hydrationLevel: 95 },
  { day: 'Sun', activityScore: 80, hydrationLevel: 88 },
];

export const MEDICAL_DATA = {
  areas: [
    {
      name: 'Banjara Hills',
      hospitals: [
        { name: 'Apollo Hospitals', doctors: ['Dr. Nikhilesh', 'Dr. B. Somaraju', 'Dr. Manjula Anagani', 'Dr. S. K. Reddy'] },
        { name: 'Care Hospital', doctors: ['Dr. Kaushik', 'Dr. V. Rao', 'Dr. P. Raghu Ram'] },
        { name: 'Rainbow Children’s Hospital', doctors: ['Dr. Dinesh Kumar', 'Dr. Preeti Sharma'] }
      ]
    },
    {
      name: 'Jubilee Hills',
      hospitals: [
        { name: 'LV Prasad Eye Institute', doctors: ['Dr. Gullapalli N Rao', 'Dr. Prashant Garg', 'Dr. M. Sastry'] },
        { name: 'Apollo Health City', doctors: ['Dr. Sangita Reddy', 'Dr. K. Hari Prasad'] }
      ]
    },
    {
      name: 'Gachibowli',
      hospitals: [
        { name: 'Continental Hospitals', doctors: ['Dr. Guru N Reddy', 'Dr. Meeraji Rao'] },
        { name: 'AIG Hospitals', doctors: ['Dr. D. Nageshwar Reddy', 'Dr. G.V. Rao'] },
        { name: 'Care Hospitals Gachibowli', doctors: ['Dr. T. Venkat', 'Dr. S. Lakshmi'] }
      ]
    },
    {
      name: 'Madhapur',
      hospitals: [
        { name: 'Medicover Hospitals', doctors: ['Dr. Srikanth Marri', 'Dr. Anil Krishna', 'Dr. L. Prasad'] },
        { name: 'Image Hospitals', doctors: ['Dr. Thraimabica Sastry', 'Dr. J. Kumar'] }
      ]
    },
    {
      name: 'Kukatpally',
      hospitals: [
        { name: 'Omni Hospitals', doctors: ['Dr. S. Sekhar', 'Dr. Radha Rani'] },
        { name: 'KIMS Hospitals', doctors: ['Dr. Bhaskar Rao', 'Dr. Sambit Das'] }
      ]
    },
    {
      name: 'Secunderabad',
      hospitals: [
        { name: 'Yashoda Hospitals', doctors: ['Dr. G.S. Rao', 'Dr. P. Sreekanth'] },
        { name: 'Sunshine Hospitals', doctors: ['Dr. A.V. Gurava Reddy', 'Dr. Adarsh Annapareddy'] }
      ]
    },
    {
      name: 'LB Nagar',
      hospitals: [
        { name: 'Kamineni Hospitals', doctors: ['Dr. K. Shashidhar', 'Dr. Surya Prakash'] },
        { name: 'Aware Gleneagles Global', doctors: ['Dr. Sharath reddy', 'Dr. Govind Verma'] }
      ]
    }
  ]
};
