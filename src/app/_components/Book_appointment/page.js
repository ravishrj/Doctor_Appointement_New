
"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../firebase/config";
import { FaTrash, FaEdit } from "react-icons/fa";

const Book_appointment = ({ showAppointments }) => {
  const [doctors] = useState([
    { id: 1, name: "Dr. Smith", specialization: "Cardiologist" },
    { id: 2, name: "Dr. Adams", specialization: "Dentist" },
    { id: 3, name: "Dr. Johnson", specialization: "Neurologist" },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "", doctor: "", startTime: "", endTime: "" });
  const [editId, setEditId] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
  
    fetchAppointments();
  }, []);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleAppointmentPopup = (appt) => {
    setSelectedAppointment(appt);
    setPopupOpen(true);
    setFormData({
      name: appt.name,
      category: appt.category,
      doctor: appt.doctor,
      startTime: appt.startTime,
      endTime: appt.endTime,
    });
    setEditId(appt.id);
  };
  


  const fetchAppointments = async () => {
    // const q = query(collection(fireStore, "appointments"), where("userId", "==", currentUser.uid));
    const q = query(collection(fireStore, "appointments"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setAppointments(data);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    // setSelectedAppointment(null);
    setSelectedDate(clickedDate);
    setPopupOpen(true);
    setFormData({ name: "", category: "", doctor: "", startTime: "", endTime: "" });
    setEditId(null);
  };

  const handleInputChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "category") {
      setFormData({ ...formData, doctor: "", [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
  };

  const handleBookAppointment = async () => {
    if (!formData.name || !formData.category || !formData.doctor || !formData.startTime || !formData.endTime) {
      toast.error("All fields are required!");
      return;
    }

    const newAppointment = {
      ...formData,
      date: selectedDate.toLocaleDateString("en-CA"),
     // userId: currentUser.uid,
    };

    try {
      if (editId) {
        await updateDoc(doc(fireStore, "appointments", editId), newAppointment);
        toast.success("Appointment Updated Successfully!");
        setEditId(null);
      } else {
        await addDoc(collection(fireStore, "appointments"), newAppointment);
        toast.success("Appointment Booked Successfully!");
      }
      fetchAppointments();
      setPopupOpen(false);
    } catch (error) {
      toast.error("Failed to Book Appointment!");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(fireStore, "appointments", id));
    toast.success("Appointment Deleted Successfully!");
    fetchAppointments();
  };

  const handleEdit = (appointment) => {

    setFormData(appointment);
    setSelectedDate(new Date(appointment.date));
    setEditId(appointment.id);
    setPopupOpen(true);
    setSelectedAppointment(null);
  };

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl text-white text-center mb-6 font-bold">Doctor Appointment System</h2>

      {/* Month & Year Dropdown */}
      <div className="flex justify-center gap-4 mb-6">
        <select className="border p-2 rounded" onChange={(e) => setMonth(parseInt(e.target.value))} value={month}>
          {months.map((m, index) => (
            <option key={index} value={index}>
              {m}
            </option>
          ))}
        </select>
        <select className="border p-2 rounded" onChange={(e) => setYear(parseInt(e.target.value))} value={year}>
          {Array.from({ length: 10 }, (_, i) => year - 5 + i).map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
    



<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 bg-white p-4 shadow-md rounded-lg border">
  {Array.from({ length: getDaysInMonth() }, (_, i) => {
    const currentDate = new Date(year, month, i + 1).toLocaleDateString("en-CA");
    const appointmentsForDay = appointments.filter((appt) => appt.date === currentDate);

    return (
      <div
        key={i}
        className="relative border bg-gradient-to-r from-blue-50 to-blue-100 p-6 text-center cursor-pointer rounded-lg hover:scale-105 hover:bg-blue-300 transition-all duration-300 shadow-sm"
        onClick={() => handleDateClick(i + 1)}
      >
        <span className="text-xl font-semibold text-gray-800">{i + 1}</span>

        {appointmentsForDay.length > 0 && (
          <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
            {appointmentsForDay.length}
          </div>
        )}

        {appointmentsForDay.length > 0 && (appointmentsForDay.map((appt, index) => (
          <div
            key={index}
            className="text-xs text-gray-700 bg-blue-200 mt-2 rounded-md p-1 cursor-pointer hover:bg-blue-400 transition"
            onClick={() => handleAppointmentPopup(appt)}
          >
            {appt.name} ({appt.startTime} - {appt.endTime})
          </div>
        )))}
      </div>
    );
  })}
</div>



     

{popupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <button
        className="absolute top-2 right-2 text-xl text-red-500 hover:text-red-700"
        onClick={() => {
          setPopupOpen(false);
          setSelectedAppointment(null);
        }}

      >
        ❌
      </button>
      {selectedAppointment ? (
       <>
       <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">
         Appointment Details
       </h3>
     
       <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-4 shadow-md border">
         <p className="text-base font-medium text-gray-700 mb-2">
           <span className="font-semibold text-blue-600">Name:</span> {selectedAppointment.name}
         </p>
         <p className="text-base font-medium text-gray-700 mb-2">
           <span className="font-semibold text-blue-600">Doctor:</span> {selectedAppointment.doctor}
         </p>
         <p className="text-base font-medium text-gray-700 mb-2">
           <span className="font-semibold text-blue-600">Category:</span> {selectedAppointment.category}
         </p>
         <p className="text-base font-medium text-gray-700 mb-2">
           <span className="font-semibold text-blue-600">Date:</span> {selectedAppointment.date}
         </p>
         <p className="text-base font-medium text-gray-700">
           <span className="font-semibold text-blue-600">Time:</span> {selectedAppointment.startTime} - {selectedAppointment.endTime}
         </p>
       </div>
     
       <div className="flex justify-end mt-6 gap-4">
         <button
           className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
           onClick={() => handleEdit(selectedAppointment)}
         >
           <FaEdit /> Edit
         </button>
     
         <button
           className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
           onClick={() => handleDelete(selectedAppointment.id)}
         >
           <FaTrash /> Delete
         </button>
       </div>
     </>
     
      ) : (
        <>
        <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          {editId ? "Update" : "Book"} Appointment for {selectedDate.toLocaleDateString()}
        </h3>
      
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
      
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option>Select Category</option>
              {["Cardiologist", "Dentist", "Neurologist"].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
      
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Doctor</label>
            <select
              name="doctor"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={formData.doctor}
              onChange={handleInputChange}
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter((doc) => doc.specialization === formData.category)
                .map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
            </select>
          </div>
      
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>
      
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
      
          <button
            onClick={handleBookAppointment}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-lg"
          >
            {editId ? "Update Appointment" : "Book Now"}
          </button>
        </div>
      </>
      
      )}
    </div>
  </div>
)}


      {showAppointments && (
       <ul className="mt-6">
       {appointments.map((appointment) => (
         <li
           key={appointment.id}
           className="p-4 mb-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
         >
           <div className="text-sm text-gray-800 font-medium">
             <span className="block text-lg font-semibold text-blue-600">
               {appointment.name}
             </span>
             <span>
               <strong>Date:</strong> {appointment.date}
             </span>{" "}
             <br />
             <span>
               <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
             </span>
           </div>
     
           <div className="flex gap-4 mt-3 sm:mt-0">
             <button
               className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow"
               onClick={() => handleEdit(appointment)}
             >
               <FaEdit /> Edit
             </button>
             <button
               className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow"
               onClick={() => handleDelete(appointment.id)}
             >
               <FaTrash /> Delete
             </button>
           </div>
         </li>
       ))}
     </ul>
     
      )}
    </div>
  );
};

export default Book_appointment;
