"use client";

import { useState } from "react";
import { marked } from "marked";
import Dropzone from "@/components/dropzone";

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (file: File) => {
    setError(null);
    setLoading(true);
    setResult("");

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const dependencies = json.dependencies || {};
      const devDependencies = json.devDependencies || {};
      const allDeps = { ...dependencies, ...devDependencies };

      if (Object.keys(allDeps).length === 0) {
        setError("No dependencies found in package.json.");
        setLoading(false);
        return;
      }

      const res = await fetch("https://api.byteshrink.dev/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Model": "deepseek/deepseek-r1:free",
        },
        body: JSON.stringify({ dependencies: allDeps }),
      });

      const markdown = await res.text();
      const html = await marked.parse(markdown);
      setResult(html);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the package.json file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">ByteShrink AI</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Drop your <code>package.json</code> and our LLM will suggest ways to shrink your bundle.
      </p>

      <Dropzone onFile={handleUpload} />

      {loading && (
        <p className="mt-6 text-blue-500 text-center animate-pulse">
          Analyzing dependencies…
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-500 text-center">{error}</p>
      )}

      {result && (
        <div
          className="mt-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      )}
    </div>
  );
}
