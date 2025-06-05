"use client";

import { useRef, useState } from "react";

export default function Dropzone({
  onUpload,
}: {
  onUpload: (json: Record<string, unknown>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      onUpload(json);
      setError("");
    } catch {
      setError("Invalid JSON in uploaded file.");
    }
  };

  return (
    <div className="text-center">
      <button
        className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
        onClick={() => inputRef.current?.click()}
      >
        Upload package.json
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/JSON"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}