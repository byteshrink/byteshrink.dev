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
      <h1 className="text-3xl font-bold mb-2 text-center">ByteShrink AI</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Drop your <code>package.json</code> below and let our AI model suggest ways to shrink your bundle.
      </p>

        <div {...getRootProps()} className="border-4 border-dashed border-gray-400 p-20 rounded-lg cursor-pointer hover:bg-gray-100 transition">
        <input {...getInputProps()} />
        <p className="text-center text-lg text-gray-600">Drag & drop your <code>package.json</code> here, or click to upload</p>
      </div>

      <p className="text-base text-black mt-4 text-center">Alternatively use our CLI directly in your project root<br />
      <code className="text-lg text-gray-500 mt-8">npx byteshrink ./package.json</code></p>

    
      {loading && <p className="mt-6 text-blue-500 animate-pulse">Analyzing your dependencies…</p>}
      {error && <p className="mt-6 text-red-500">❌ {error}</p>}
      {html && (
        <div
          className="prose mt-8 max-w-4xl text-left"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

        <hr className="border-b-1 border-b-gray-500" />

            <p className="text-sm text-gray-500 mt-2 text-center">
            <strong>Note:</strong> We only analyze dependencies and devDependencies.<br />
            <strong>Tip:</strong> For best results, ensure your <code>package.json</code> is valid JSON.<br />
            <strong>Privacy:</strong> Your <code>package.json</code> is processed securely and not stored.
        </p>

      <p className="text-sm text-gray-500 mt-2">
        <strong>Created with ❤️ by:</strong> <a href="https://denodell.com" className="text-blue-500 hover:underline">Den Odell</a>
      </p>
    </main>
  );
}