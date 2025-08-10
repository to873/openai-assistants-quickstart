"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Indicator {
  type: string;
  name: string;
  value: number;
  unit?: string;
  timestamp?: string;
  source?: string;
}

export default function WindcompliDashboard() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  // Fetch indicators from API
  useEffect(() => {
    async function fetchIndicators() {
      try {
        const res = await fetch("/api/indicators");
        const json = await res.json();
        setIndicators(json.indicators || []);
      } catch (error) {
        console.error("Failed to fetch indicators", error);
      }
    }
    fetchIndicators();
  }, []);

  // Load Plotly script and draw chart when indicators change
  useEffect(() => {
    // If there are no indicators yet, skip chart drawing
    if (indicators.length === 0) return;

    const script = document.createElement("script");
    script.src = "https://cdn.plot.ly/plotly-latest.min.js";
    script.async = true;
    script.onload = () => {
      const Plotly = (window as any).Plotly;
      if (!Plotly) return;

      // Prepare data arrays for leading and lagging indicators
      const leading = indicators.filter((i) => i.type === "leading");
      const lagging = indicators.filter((i) => i.type === "lagging");

      const data: any[] = [];
      if (leading.length > 0) {
        data.push({
          x: leading.map((i) => i.name),
          y: leading.map((i) => i.value),
          type: "bar",
          name: "Leading",
        });
      }
      if (lagging.length > 0) {
        data.push({
          x: lagging.map((i) => i.name),
          y: lagging.map((i) => i.value),
          type: "bar",
          name: "Lagging",
        });
      }

      const layout = {
        title: "Project Indicators",
        barmode: "group",
        margin: { t: 40, r: 30, b: 40, l: 40 },
      };

      Plotly.newPlot("chart", data, layout);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [indicators]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Windcompli Dashboard</h1>
      <div id="chart" className={styles.chart}></div>
    </main>
  );
}
