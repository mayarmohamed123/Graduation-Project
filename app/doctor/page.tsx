export default function DoctorDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Dashboard content will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample stat cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Patients</h3>
          <p className="text-3xl font-bold text-[#2BBBC5] mt-2">150</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">Today&apos;s Appointments</h3>
          <p className="text-3xl font-bold text-[#2BBBC5] mt-2">8</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">New Messages</h3>
          <p className="text-3xl font-bold text-[#2BBBC5] mt-2">12</p>
        </div>
      </div>

      {/* Welcome message */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your patients, appointments, and messages all in one place.
        </p>
      </div>
    </div>
  );
}
