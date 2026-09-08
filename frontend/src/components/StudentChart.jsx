import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUsers,
  FaBook,
  FaStar,
  FaFileAlt
} from "react-icons/fa";

import { Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StudentChart({ students }) {
  const courseCount = {};

  students.forEach((student) => {
    courseCount[student.course] =
      (courseCount[student.course] || 0) + 1;
  });

  const labels = Object.keys(courseCount);
  const values = Object.values(courseCount);

 const barData = {
  labels,
  datasets: [
    {
      label: "Students Per Course",
      data: values,

      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
      ],

      borderRadius: 10,
      borderWidth: 1,
    },
  ],
};
  const pieData = {
  labels: Object.keys(courseCount),
  datasets: [
    {
      data: Object.values(courseCount),

      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ],

      borderWidth: 3,
      borderColor: "#fff",
      hoverOffset: 15,
    },
  ],
};


const doughnutData = {
  labels: Object.keys(courseCount),
  datasets: [
    {
      data: Object.values(courseCount),

      backgroundColor: [
        "#3b82f6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ],

      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 15,
    },
  ],
};
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

 return (
  <>
    {/* Bar Chart */}
    <div className="chart-container">
      <h2>Course Analytics</h2>
      <Bar data={barData} options={options} />
    </div>

    {/* Pie + Doughnut */}
    <div className="bottom-charts">

      <div className="chart-card">
        <h3>Course Distribution</h3>

        <div
          style={{
            width: "320px",
            height: "320px",
            margin: "0 auto",
          }}
        >
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      <div className="chart-card">
        <h3>Course Popularity</h3>

        <div
          style={{
            width: "320px",
            height: "320px",
            margin: "0 auto",
          }}
        >
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "35%",
            }}
          />
        </div>
      </div>

    </div>
  </>
);
}

export default StudentChart;