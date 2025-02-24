"use client"; 
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks") // Remplace par ton endpoint backend
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Bienvenue sur Next.js</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
