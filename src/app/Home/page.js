"use client"
import { useState, useEffect } from 'react';

import { Bars3Icon } from '@heroicons/react/24/outline';

import 'react-calendar/dist/Calendar.css';


import Book_appointment from '../_components/Book_appointment/page';
import Link from 'next/link';

const HomePage = () => {
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
 
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  
  

 

  // useEffect(() => {
  //   const userL = JSON.parse(localStorage.getItem("current-user"));
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       // User is signed in, update the state and local storage
  //       const userData = {
  //         uid: user.uid,
  //         displayName: user.displayName || "User",
  //         email: user.email,
  //         role: user.role,
  //       };
  //       console.log("userData", userData);
  //       setCurrentUser(userData);
  //       if (userData.role == 'Doctor') {

  //         setIsDoctorLoggedIn(true);
  //       }
  //       else
  //         setIsUserLoggedIn(true);

  //       localStorage.setItem("current-user", JSON.stringify(userData));
  //     } else {
  //       // User is signed out

  //       setCurrentUser(null);

  //       localStorage.removeItem("current-user");
  //     }
  //   });
  //   console.log("currentUser", currentUser);
  //   return () => unsubscribe();
  // }, []);


 

 
  const handleBookNow = () => {
  
    setShowBookAppointment(true);
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-5" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      {/* Navigation Bar */}

     
    <nav className="text-white py-4 px-6 flex items-center justify-between rounded-lg shadow-md">
     <Link href={"/"} className="text-xl font-bold">Doctor Booking</Link>

  {/* Mobile Menu Button */}
  <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
    <Bars3Icon className="w-6 h-6" />
  </button>

 
 

 
  <div className="hidden md:flex gap-4">
  
      <>
        <button 
 onClick={() => setShowAppointments(true)}
  className="px-5 py-2 mr-12 border border-gray-800 shadow-md rounded-lg text-gray-800 font-semibold hover:bg-gray-200 hover:text-gray-900 transition-all"
>
  Appointments
</button>



      </>
   
  </div>
</nav>

{/* Mobile Dropdown Menu */}
{isMobileMenuOpen && (
  <div className="md:hidden bg-white text-black shadow-md p-4 mt-2 rounded-lg">
    {/* User/Doctor Login (Only in Mobile Menu) */}
 

    {/* Appointments (Only in Mobile Menu) */}
  
      <button onClick={() => setShowAppointments(!showAppointments)} className="block w-full text-left px-4 py-2">
        Appointments
      </button>
    
  </div>
)}







       {!showBookAppointment &&  <div className="flex justify-center items-center p-4">
        <div className="text-center  p-6 rounded-2xl shadow-lg">
          <p className="text-lg md:text-xl font-bold text-gray-200">
            Patient can book an appointment or  can see their appointments by clicking below.
          </p>
          <button 
  onClick={handleBookNow} 
  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full shadow-md transition-all"
>
  Book_Appointment
</button>

        </div>
      </div>}
     



      {showBookAppointment && <Book_appointment  showAppointments={showAppointments} />}




    </div>
  );
}
export default HomePage;




