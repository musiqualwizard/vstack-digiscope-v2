import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const generateData = () => {
      const ai = Number(localStorage.getItem("vstack_ai_calls") || 0);
      const api = Number(localStorage.getItem("vstack_api_calls") || 0);
      const projects = Number(localStorage.getItem("vstack_project_count") || 0);

      const newPoint = {
        time: new Date().toLocaleTimeString(),
        AI: ai,
        API: api,
        Projects: projects,
      };

      setData((prev) => [...prev.slice(-9), newPoint]);
    };

    generateData();

    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>V-Stack Analytics</h1>
      <p style={styles.subtitle}>
        Real-time system metrics across your platform
      </p>

      <div style={styles.chartBox}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line type="monotone" dataKey="AI" stroke="#d4af37" />
            <Line type="monotone" dataKey="API" stroke="#00e5ff" />
            <Line type="monotone" dataKey="Projects" stroke="#31ff7a" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 30,
    background: "#050505",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    fontSize: 36,
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    marginBottom: 30,
  },
  chartBox: {
    background: "#111",
    padding: 20,
    borderRadius: 20,
    border: "1px solid rgba(212,175,55,0.2)",
  },
};