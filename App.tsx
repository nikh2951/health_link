
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HealthChart } from './components/HealthChart';
import { CARE_TEAM, MEDICAL_DATA } from './constants';
import { PatientDetails, DoctorDetails, BookedAppointment, StatData } from './types';
import { getHealthInsight } from './services/geminiService';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

// --- GLOBAL STORAGE HELPERS ---
const getGlobalDoctors = (): DoctorDetails[] => {
  const data = localStorage.getItem('healthlink_global_doctors');
  return data ? JSON.parse(data) : [];
};

const saveGlobalDoctor = (doctor: DoctorDetails) => {
  const current = getGlobalDoctors();
  const filtered = current.filter(d => d.email !== doctor.email);
  localStorage.setItem('healthlink_global_doctors', JSON.stringify([...filtered, doctor]));
};

const getGlobalAppointments = (): BookedAppointment[] => {
  const data = localStorage.getItem('healthlink_global_appointments');
  return data ? JSON.parse(data) : [];
};

const saveGlobalAppointment = (appt: BookedAppointment) => {
  const current = getGlobalAppointments();
  localStorage.setItem('healthlink_global_appointments', JSON.stringify([...current, appt]));
};

const getPatientDataByEmail = (email: string): PatientDetails | null => {
  const key = `healthlink_data_patient_${email.toLowerCase().trim()}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data).details;
};

const calculateAge = (dob: string): string => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : '0';
};

// --- COMPONENTS ---

const ProfileModal = ({ isOpen, onClose, details, role, email }: { isOpen: boolean, onClose: () => void, details: any, role: string, email: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">✕</button>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
            {details?.profilePicture ? <img src={details.profilePicture} className="w-full h-full object-cover" /> : <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">{details?.fullName || 'User'}</h2>
            <p className="text-slate-500 font-medium">{email}</p>
            <span className="inline-block mt-2 bg-[#004D40] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{role}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Vital Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Age</p><p className="font-bold">{details?.age} Yrs</p></div>
              <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</p><p className="font-bold">{details?.bloodGroup || 'N/A'}</p></div>
              <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Weight</p><p className="font-bold">{details?.weight} kg</p></div>
              <div className="p-3 bg-slate-50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold uppercase">Height</p><p className="font-bold">{details?.height} cm</p></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Medical History</h3>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Recent Surgeries</p>
              <p className="text-sm font-medium">{details?.recentSurgeries || 'No surgeries reported.'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Medicines</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {details?.latestMedicines?.map((m: string, i: number) => (
                  <span key={i} className="text-[10px] bg-white border px-2 py-0.5 rounded-md font-bold text-slate-600">{m}</span>
                )) || 'None'}
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-10 bg-[#004D40] text-white font-bold py-4 rounded-2xl hover:bg-[#00382D] transition-all shadow-xl">Done</button>
      </div>
    </div>
  );
};

const SettingsView = ({ details, role, email, onUpdate }: { details: any, role: string, email: string, onUpdate: (newDetails: any) => void }) => {
  const [formData, setFormData] = useState(details);

  useEffect(() => {
    setFormData(details);
  }, [details]);

  const handleSave = () => {
    onUpdate(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Personal Records & Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Core Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Full Name</label>
              <input readOnly value={details?.fullName} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none text-slate-500 font-medium cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Age</label>
              <input readOnly value={details?.age} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none text-slate-500 font-medium cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Email</label>
            <input readOnly value={email} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none text-slate-500 font-medium cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Blood Group</label>
            <input readOnly value={details?.bloodGroup} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none text-slate-500 font-bold cursor-not-allowed" />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-[#004D40] uppercase tracking-widest mb-4">Editable Records</h3>
          {role === 'patient' && (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Body Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData?.weight} 
                  onChange={e => setFormData({...formData, weight: e.target.value})} 
                  className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#004D40] font-bold" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Update Surgeries History</label>
                <textarea 
                  rows={2}
                  value={formData?.recentSurgeries} 
                  onChange={e => setFormData({...formData, recentSurgeries: e.target.value})} 
                  className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#004D40] text-sm font-medium" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Current Medicines (Comma separated)</label>
                <textarea 
                  rows={2}
                  value={formData?.latestMedicines?.join(', ')} 
                  onChange={e => setFormData({...formData, latestMedicines: e.target.value.split(',').map(s => s.trim())})} 
                  className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#004D40] text-sm font-medium" 
                />
              </div>
            </>
          )}
          <button onClick={handleSave} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#00382D] transition-all">Update My Records</button>
        </div>
      </div>
    </div>
  );
};

const AppointmentsView = ({ appointments }: { appointments: BookedAppointment[] }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Appointment History</h2>
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map(a => (
            <div key={a.id} className="p-6 bg-slate-50 rounded-[32px] border border-transparent hover:border-[#004D40] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#004D40] shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{a.paymentStatus}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{a.doctor}</h3>
              <p className="text-slate-500 text-sm font-medium mb-4">{a.hospital}, {a.area}</p>
              <div className="flex items-center gap-4 text-[#004D40]">
                <div className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-xs font-bold">{a.date}</span></div>
                <div className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-xs font-bold">{a.time}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium italic">No appointments booked yet.</p>
        </div>
      )}
    </div>
  </div>
);

const PrescriptionsView = ({ medicines }: { medicines: string[] }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
      <h2 className="text-3xl font-black text-slate-900 mb-8">My Prescriptions & Medicines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicines && medicines.length > 0 && medicines[0] !== "" ? medicines.map((med, idx) => (
          <div key={idx} className="p-6 bg-slate-50 rounded-[32px] border-2 border-transparent hover:border-[#004D40] hover:bg-white transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-[#004D40] text-white rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{med}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Self Reported Medicine</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Currently listed in your active medication records.</p>
          </div>
        )) : (
          <div className="col-span-2 py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 italic">No current medicines listed in your profile.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const WelcomeView = ({ onSelectRole }: { onSelectRole: (role: 'patient' | 'doctor') => void }) => (
  <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#F8FAFC] p-6 overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
    <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="w-20 h-20 bg-[#004D40] rounded-[28px] flex items-center justify-center mb-8 shadow-2xl">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h1 className="text-6xl font-black text-[#004D40] tracking-tighter mb-4">Health Link</h1>
      <p className="text-slate-500 text-xl font-medium max-w-lg mb-12">Select your portal to continue.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button onClick={() => onSelectRole('patient')} className="group relative bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all text-left overflow-hidden">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#004D40] transition-colors">
            <svg className="w-7 h-7 text-[#004D40] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Patient Portal</h3>
          <p className="text-slate-500 text-sm">Book appointments and track your wellness.</p>
        </button>
        <button onClick={() => onSelectRole('doctor')} className="group relative bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all text-left overflow-hidden">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <svg className="w-7 h-7 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Doctor Portal</h3>
          <p className="text-slate-500 text-sm">Manage patients and your medical practice.</p>
        </button>
      </div>
    </div>
  </div>
);

const LoginView = ({ role, onLoginSuccess, onBack }: { role: 'patient' | 'doctor', onLoginSuccess: (email: string) => void, onBack: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return alert('Invalid email');
    if (password.length !== 6) return alert('Enter 6-digit PIN');
    onLoginSuccess(email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-500">
        <button onClick={onBack} className="absolute -top-12 left-0 text-slate-400 font-bold text-sm hover:text-slate-900">← Back to Portal Selection</button>
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${role === 'doctor' ? 'bg-blue-600' : 'bg-[#004D40]'}`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Health Link</h2>
          <p className="text-slate-500 font-medium mb-8 capitalize">{role} Login</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#004D40]" />
            <input required type="password" placeholder="6-digit PIN" maxLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#004D40]" />
            <button type="submit" className={`w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all ${role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#004D40] hover:bg-[#00382D]'}`}>Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const OnboardingView = ({ role, email, onComplete }: { role: 'patient' | 'doctor', email: string, onComplete: (details: any) => void }) => {
  const [patientData, setPatientData] = useState<PatientDetails>({
    fullName: '', dateOfBirth: '', age: '', bloodGroup: '', height: '', weight: '', lastBloodTest: '',
    hasBloodPressure: false, hasBloodSugar: false, hasThyroid: false,
    recentSurgeries: '', previousDoctor: '', latestMedicines: [], profilePicture: null
  });

  const [doctorData, setDoctorData] = useState<DoctorDetails>({
    fullName: '', age: '', specialization: '', hospitalName: '', experienceYears: '', licenseNumber: '', consultationFee: '', profilePicture: null, email: email
  });

  const hospitals = useMemo(() => MEDICAL_DATA.areas.flatMap(a => a.hospitals.map(h => h.name)), []);
  const specializations = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'General Physician', 'Dermatology'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'patient') onComplete(patientData);
    else onComplete(doctorData);
  };

  const handleDobChange = (dob: string) => {
    const age = calculateAge(dob);
    if (role === 'patient') {
      setPatientData({ ...patientData, dateOfBirth: dob, age });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
        <h2 className={`text-4xl font-black mb-8 ${role === 'doctor' ? 'text-blue-600' : 'text-[#004D40]'}`}>Create Your {role} Profile</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {role === 'patient' ? (
            <>
              <div className="space-y-6">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">1. Full Name</label><input required placeholder="Enter name" value={patientData.fullName} onChange={e => setPatientData({...patientData, fullName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">2. DOB</label><input required type="date" value={patientData.dateOfBirth} onChange={e => handleDobChange(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">3. Age (Auto)</label><input readOnly placeholder="Age" value={patientData.age} className="w-full bg-slate-100 border-none rounded-2xl py-3 px-4 outline-none text-slate-400 cursor-not-allowed" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">4. Blood Group</label><input required placeholder="O+" value={patientData.bloodGroup} onChange={e => setPatientData({...patientData, bloodGroup: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">5. Height (cm)</label><input required placeholder="cm" value={patientData.height} onChange={e => setPatientData({...patientData, height: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                </div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">6. Weight (kg)</label><input required placeholder="kg" value={patientData.weight} onChange={e => setPatientData({...patientData, weight: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={patientData.hasBloodPressure} onChange={e => setPatientData({...patientData, hasBloodPressure: e.target.checked})} /> BP</label>
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={patientData.hasBloodSugar} onChange={e => setPatientData({...patientData, hasBloodSugar: e.target.checked})} /> Sugar</label>
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={patientData.hasThyroid} onChange={e => setPatientData({...patientData, hasThyroid: e.target.checked})} /> Thyroid</label>
                </div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">10. Recent Surgeries</label><input placeholder="List any recent surgeries" value={patientData.recentSurgeries} onChange={e => setPatientData({...patientData, recentSurgeries: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">11. Previous Doctor</label><input placeholder="Dr. Name" value={patientData.previousDoctor} onChange={e => setPatientData({...patientData, previousDoctor: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">12. Current Medicines (Comma separated)</label>
                  <textarea placeholder="Paracetamol, Cetirizine..." value={patientData.latestMedicines.join(', ')} onChange={e => setPatientData({...patientData, latestMedicines: e.target.value.split(',').map(m => m.trim())})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" rows={3} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label><input required placeholder="Dr. Enter name" value={doctorData.fullName} onChange={e => setDoctorData({...doctorData, fullName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Specialization</label>
                  <select required value={doctorData.specialization} onChange={e => setDoctorData({...doctorData, specialization: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none">
                    <option value="">Select Specialty</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current Hospital</label>
                  <select required value={doctorData.hospitalName} onChange={e => setDoctorData({...doctorData, hospitalName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none">
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Age</label><input required placeholder="Years" type="number" value={doctorData.age} onChange={e => setDoctorData({...doctorData, age: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Experience</label><input required placeholder="Yrs Exp" type="number" value={doctorData.experienceYears} onChange={e => setDoctorData({...doctorData, experienceYears: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" /></div>
                </div>
                <input required placeholder="Medical License Number" value={doctorData.licenseNumber} onChange={e => setDoctorData({...doctorData, licenseNumber: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" />
                <input required placeholder="Consultation Fee (INR)" type="number" value={doctorData.consultationFee} onChange={e => setDoctorData({...doctorData, consultationFee: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 outline-none" />
              </div>
            </>
          )}
          <button type="submit" className={`md:col-span-2 w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all ${role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#004D40] hover:bg-[#00382D]'}`}>Complete Registration</button>
        </form>
      </div>
    </div>
  );
};

const DashboardView = ({ details, appointments, onOpenBooking }: { details: PatientDetails, appointments: BookedAppointment[], onOpenBooking: () => void }) => {
  const [insight, setInsight] = useState("Analyzing your vitals for today...");
  
  useEffect(() => {
    getHealthInsight({ bp: "120/80", hr: "72bpm" }).then(setInsight);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900">Health Overview</h2>
        <button onClick={onOpenBooking} className="bg-[#004D40] text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 hover:scale-105 transition-all">Book Appointment</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Weight</p><p className="text-2xl font-black text-slate-900">{details.weight} kg</p></div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p><p className="text-2xl font-black text-slate-900">{details.bloodGroup}</p></div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Age</p><p className="text-2xl font-black text-slate-900">{details.age} yrs</p></div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Height</p><p className="text-2xl font-black text-slate-900">{details.height} cm</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#004D40] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div><span className="font-bold text-sm">AI Health Insight</span></div>
              <p className="text-lg font-medium leading-relaxed italic">"{insight}"</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"><h3 className="font-black text-slate-900 mb-6">Activity History</h3><HealthChart /></div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6">Confirmed Bookings</h3>
            <div className="space-y-4">
              {appointments.slice(0, 3).map(a => (
                <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                  <p className="font-black text-slate-900 text-sm">{a.doctor}</p>
                  <p className="text-xs text-slate-500">{a.hospital}</p>
                  <p className="text-[10px] font-black text-[#004D40] mt-2 uppercase tracking-wider">{a.date} @ {a.time}</p>
                  <span className="inline-block mt-2 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-lg">{a.paymentStatus}</span>
                </div>
              ))}
              {appointments.length === 0 && <p className="text-xs text-slate-400 italic">No bookings found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = ({ details, appointments }: { details: DoctorDetails, appointments: BookedAppointment[] }) => {
  const [viewingPatient, setViewingPatient] = useState<string | null>(null);
  const myQueue = appointments.filter(a => a.doctorEmail === details.email);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Consultations</p><p className="text-3xl font-black text-blue-600">{myQueue.length}</p></div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Clinic Fee</p><p className="text-3xl font-black text-emerald-600">₹{details.consultationFee}</p></div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"><p className="text-[10px] font-bold text-slate-400 uppercase">Practice</p><p className="text-xl font-black text-slate-900 truncate">{details.hospitalName}</p></div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50"><h3 className="text-2xl font-black text-slate-900">Patient Queue</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Patient</th>
                <th className="px-8 py-4">Schedule</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myQueue.map(appt => (
                <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6"><span className="font-bold text-slate-900">{appt.patientName}</span></td>
                  <td className="px-8 py-6 font-bold text-slate-600 text-sm">{appt.date} • {appt.time}</td>
                  <td className="px-8 py-6"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{appt.paymentStatus}</span></td>
                  <td className="px-8 py-6 text-right"><button onClick={() => setViewingPatient(appt.patientEmail)} className="text-blue-600 text-xs font-bold hover:underline">Medical Record</button></td>
                </tr>
              ))}
              {myQueue.length === 0 && <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">Queue is empty.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {viewingPatient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
            <button onClick={() => setViewingPatient(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">✕</button>
            <h2 className="text-3xl font-black text-slate-900 mb-8">Patient History</h2>
            {getPatientDataByEmail(viewingPatient) ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-[10px] font-bold text-slate-400">Vitals</p><p className="font-bold">{getPatientDataByEmail(viewingPatient)?.age} Yrs • {getPatientDataByEmail(viewingPatient)?.bloodGroup}</p></div>
                  <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-[10px] font-bold text-slate-400">Conditions</p><p className="text-xs font-bold">{[getPatientDataByEmail(viewingPatient)?.hasBloodPressure && 'BP', getPatientDataByEmail(viewingPatient)?.hasBloodSugar && 'Sugar', getPatientDataByEmail(viewingPatient)?.hasThyroid && 'Thyroid'].filter(Boolean).join(', ') || 'None Reported'}</p></div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Medical History & Surgeries</h4>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">{getPatientDataByEmail(viewingPatient)?.recentSurgeries || 'No recent surgeries reported.'}</p>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Medicines Reported</h4>
                  <div className="flex flex-wrap gap-2">
                    {getPatientDataByEmail(viewingPatient)?.latestMedicines?.map((m, i) => (
                      <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border font-bold text-slate-600">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : <p>Record not found.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, onBook, patientName, patientEmail }: { isOpen: boolean, onClose: () => void, onBook: (appt: BookedAppointment) => void, patientName: string, patientEmail: string }) => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<{name: string, email?: string} | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const registeredDoctors = getGlobalDoctors();
  const doctorsList = useMemo(() => {
    const area = MEDICAL_DATA.areas.find(a => a.name === selectedArea);
    const hosp = area?.hospitals.find(h => h.name === selectedHospital);
    const staticDocs = hosp?.doctors.map(d => ({ name: d })) || [];
    const dynamicDocs = registeredDoctors.filter(d => d.hospitalName === selectedHospital).map(d => ({ name: `Dr. ${d.fullName}`, email: d.email }));
    return [...staticDocs, ...dynamicDocs];
  }, [selectedArea, selectedHospital, registeredDoctors]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">✕</button>
        <h2 className="text-3xl font-black text-slate-900 mb-8">Book Appointment</h2>
        <div className="space-y-6">
          <select value={selectedArea} onChange={e => {setSelectedArea(e.target.value); setSelectedHospital('');}} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#004D40]">
            <option value="">Select Area</option>
            {MEDICAL_DATA.areas.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
          <select disabled={!selectedArea} value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none disabled:opacity-50 focus:ring-2 focus:ring-[#004D40]">
            <option value="">Select Hospital</option>
            {MEDICAL_DATA.areas.find(a => a.name === selectedArea)?.hospitals.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
          </select>
          <select disabled={!selectedHospital} onChange={e => {
            const doc = doctorsList.find(d => d.name === e.target.value);
            if (doc) setSelectedDoctor(doc);
          }} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none disabled:opacity-50 focus:ring-2 focus:ring-[#004D40]">
            <option value="">Select Doctor</option>
            {doctorsList.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none" />
            <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none">
              <option value="">Time</option>
              {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={() => {
            if (!selectedDoctor || !selectedDate || !selectedTime) return alert('Fill all fields');
            onBook({ id: Math.random().toString(), date: selectedDate, time: selectedTime, area: selectedArea, hospital: selectedHospital, doctor: selectedDoctor.name, doctorEmail: selectedDoctor.email, patientEmail, patientName, paymentStatus: 'Paid' });
            onClose();
          }} className="w-full bg-[#004D40] text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-105 transition-all">Confirm & Pay Fee</button>
        </div>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

const App = () => {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [view, setView] = useState<'welcome' | 'login' | 'onboarding' | 'home' | 'dashboard' | 'prescriptions' | 'settings' | 'appointments'>('welcome');
  const [userEmail, setUserEmail] = useState('');
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [appointments, setAppointments] = useState<BookedAppointment[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setAppointments(getGlobalAppointments());
  }, [view, showBooking]);

  const handleLoginSuccess = (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    setUserEmail(normalizedEmail);
    const key = `healthlink_data_${role}_${normalizedEmail}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      if (role === 'patient') setPatientDetails(data.details); else setDoctorDetails(data.details);
      setView('home');
    } else setView('onboarding');
  };

  const handleOnboardingComplete = (details: any) => {
    if (role === 'patient') setPatientDetails(details); else { setDoctorDetails(details); saveGlobalDoctor({ ...details, email: userEmail }); }
    localStorage.setItem(`healthlink_data_${role}_${userEmail.toLowerCase().trim()}`, JSON.stringify({ details }));
    setView('home');
  };

  const handleUpdateDetails = (newDetails: any) => {
    if (role === 'patient') setPatientDetails(newDetails); else { setDoctorDetails(newDetails); saveGlobalDoctor({...newDetails, email: userEmail}); }
    localStorage.setItem(`healthlink_data_${role}_${userEmail.toLowerCase().trim()}`, JSON.stringify({ details: newDetails }));
  };

  const handleBooking = (a: BookedAppointment) => {
    saveGlobalAppointment(a);
    setAppointments(prev => [...prev, a]);
  };

  const handleLogout = () => { setView('welcome'); setUserEmail(''); setPatientDetails(null); setDoctorDetails(null); setShowProfileModal(false); };

  if (view === 'welcome') return <WelcomeView onSelectRole={r => { setRole(r); setView('login'); }} />;
  if (view === 'login') return <LoginView role={role} onLoginSuccess={handleLoginSuccess} onBack={() => setView('welcome')} />;
  if (view === 'onboarding') return <OnboardingView role={role} email={userEmail} onComplete={handleOnboardingComplete} />;

  const displayName = role === 'patient' ? patientDetails?.fullName : doctorDetails?.fullName;
  const filteredAppointments = appointments.filter(a => role === 'patient' ? a.patientEmail === userEmail : a.doctorEmail === userEmail);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        activeView={view} 
        onViewChange={v => v === 'logout' ? handleLogout() : setView(v as any)} 
        appointmentBadge={filteredAppointments.length}
      />
      <main className="flex-1 ml-64 p-8 transition-all duration-500">
        <TopBar 
          userName={displayName || 'User'} 
          userEmail={userEmail} 
          profilePic={role === 'patient' ? patientDetails?.profilePicture : doctorDetails?.profilePicture} 
          notificationCount={filteredAppointments.length} 
          onProfileClick={() => setShowProfileModal(true)} 
        />
        
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in-95 duration-500">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl text-white ${role === 'doctor' ? 'bg-blue-600' : 'bg-[#004D40]'}`}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className={`text-6xl font-black mb-6 ${role === 'doctor' ? 'text-blue-600' : 'text-[#004D40]'}`}>Hello, {displayName?.split(' ')[0]}!</h1>
            <p className="text-slate-500 mb-10 max-w-lg">Welcome to Health Link. Your healthcare portal is updated and ready.</p>
            <button onClick={() => setView('dashboard')} className={`text-white text-lg font-bold py-4 px-12 rounded-2xl shadow-xl hover:scale-105 transition-all ${role === 'doctor' ? 'bg-blue-600' : 'bg-[#004D40]'}`}>Open Your Dashboard</button>
          </div>
        )}

        {view === 'dashboard' && role === 'patient' && patientDetails && <DashboardView details={patientDetails} appointments={filteredAppointments} onOpenBooking={() => setShowBooking(true)} />}
        {view === 'dashboard' && role === 'doctor' && doctorDetails && <DoctorDashboard details={doctorDetails} appointments={appointments} />}
        
        {view === 'appointments' && <AppointmentsView appointments={filteredAppointments} />}
        {view === 'prescriptions' && role === 'patient' && <PrescriptionsView medicines={patientDetails?.latestMedicines || []} />}
        
        {view === 'settings' && <SettingsView details={role === 'patient' ? patientDetails : doctorDetails} role={role} email={userEmail} onUpdate={handleUpdateDetails} />}
      </main>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} onBook={handleBooking} patientName={patientDetails?.fullName || ''} patientEmail={userEmail} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} details={role === 'patient' ? patientDetails : doctorDetails} role={role} email={userEmail} />
    </div>
  );
};

export default App;
