"use client";

import React, { useState } from "react";
import RagChat from "../../components/rag-chat";
import styles from "./page.module.css";

const WindcompliPage = () => {
  const [projectSize, setProjectSize] = useState("");
  const [contractType, setContractType] = useState("");
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Windcompli Assistant</h1>
      <div className={styles.inputs}>
        <label>
          Project size:
          <input
            type="text"
            value={projectSize}
            onChange={(e) => setProjectSize(e.target.value)}
          />
        </label>
        <label>
          Contract type:
          <input
            type="text"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label>
          Schedule:
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </label>
        <label>
          Upload document:
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>
      <<RagChat />
    </main>
  );
};

export default WindcompliPage;
