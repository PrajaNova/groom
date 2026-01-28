"use client";

import { useEffect, useState } from "react";
import ConfessionCard from "./ConfessionCard";

interface Confession {
  id: string;
  content: string;
  createdAt: string;
}

const ConfessionList: React.FC = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  useEffect(() => {
    // Fetch from proxy route which forwards to groom-ms
    fetch("/api/confessions")
      .then((res) => res.json())
      .then((data) => setConfessions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch confessions", err));
  }, []);

  return (
    <>
      {confessions.map((confession) => (
        <ConfessionCard key={confession.id} {...confession} />
      ))}
    </>
  );
};

export default ConfessionList;
