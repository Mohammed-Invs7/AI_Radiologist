const AdminDashboard = () => {
  const stats = [
    { title: "Users", value: 128, icon: "bx bx-user", color: "primary" },
    { title: "Reports", value: 64, icon: "bx bx-file", color: "success" },
    { title: "Images", value: 92, icon: "bx bx-image", color: "warning" },
  ];

  const recentReports = [
    { id: 1, patient: "Mohammed Ahmed", date: "2025-04-24", status: "Normal" },
    {
      id: 2,
      patient: "Sara Khalid",
      date: "2025-04-23",
      status: "Needs Review",
    },
    { id: 3, patient: "Ahmed Ali", date: "2025-04-22", status: "Positive" },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Statistics Cards */}
      <div className="row mb-5">
        {stats.map((item, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className={`card text-white bg-${item.color} shadow`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <h3>{item.value}</h3>
                </div>
                <i className={`${item.icon} bx-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default AdminDashboard;
