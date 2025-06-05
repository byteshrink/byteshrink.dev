"use client";

import Dropzone from "../components/Dropzone";
import SuggestionsBox from "../components/SuggestionsBox";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (json: {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}) => {
    const dependencies = json.dependencies || {};
    const devDependencies = json.devDependencies || {};
    const allDeps = { ...dependencies, ...devDependencies };

    if (Object.keys(allDeps).length === 0) {
      setError("No dependencies found in package.json.");
      return;
    }

    try {
      setError("");
      const res = await fetch("https://api.byteshrink.dev/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Model": "deepseek/deepseek-r1:free",
        },
        body: JSON.stringify({ dependencies: allDeps }),
      });

      const json = await res.json();
      if (json.suggestions) {
        setResult(json.suggestions);
      } else if (json.error) {
        setResult(`Error: ${json.error}`);
      } else {
        setResult("Unknown response format.");
      }
    } catch (e) {
      setError("Failed to fetch suggestions.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">ByteShrink AI</h1>
      <p className="mb-8 text-gray-600">Upload your package.json to get optimization suggestions.</p>
      <Dropzone onUpload={handleUpload} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && <SuggestionsBox result={result} />}
    </main>
  );
}