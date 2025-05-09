import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import ReportTrendChart from "./ReportTrendChart";
import UserTrendChart from "./UserTrendChart.JSX";

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {/* عرض الكومبوننتات بشكل منظم */}
      <div className="row">
        {/* بطاقة النماذج */}
        <div className="col-md-4">
          {/* <ModelsCard /> */}
        </div>

        {/* رسم بياني لاتجاه تسجيل المستخدمين */}
        <div className="col-md-4">
          <UserTrendChart />
        </div>

        {/* رسم بياني لاتجاه التقارير */}
        <div className="col-md-4">
          <ReportTrendChart />
        </div>
      </div>

      {/* يمكن إضافة مزيد من الكومبوننتات هنا مثل التقارير أو المستخدمين الجدد */}
    </div>
  );
};

export default AdminDashboard;
