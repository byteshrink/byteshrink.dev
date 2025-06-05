// app/page.tsx

'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { marked } from 'marked';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setLoading(true);
    setHtml('');
    setError(null);

    const file = acceptedFiles[0];
    const text = await file.text();

    try {
      const json = JSON.parse(text);
      const dependencies = json.dependencies || {};
      const devDependencies = json.devDependencies || {};
      const allDeps = { ...dependencies, ...devDependencies };

      if (Object.keys(allDeps).length === 0) {
        setError("No dependencies found in package.json.");
        setLoading(false);
        return;
      }

      const res = await fetch('https://api.byteshrink.dev/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Model': 'deepseek/deepseek-r1:free',
        },
        body: JSON.stringify({ dependencies: allDeps }),
      });

      if (!res.ok) {
        throw new Error('API call failed.');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const htmlContent = await marked.parse(data.suggestions || '');
      setHtml(htmlContent);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">ByteShrink</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Drop your <code>package.json</code> and we'll suggest ways to shrink your bundle.
      </p>

        <div {...getRootProps()} className="border-4 border-dashed border-gray-400 p-20 rounded-lg cursor-pointer hover:bg-gray-100 transition">
        <input {...getInputProps()} />
        <p className="text-center text-lg text-gray-600">Drag & drop your <code>package.json</code> here, or click to upload</p>
      </div>

      {loading && <p className="mt-6 text-blue-500 animate-pulse">Analyzing your dependencies…</p>}
      {error && <p className="mt-6 text-red-500">❌ {error}</p>}
      {html && (
        <div
          className="prose mt-8 max-w-4xl text-left"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </main>
  );
}