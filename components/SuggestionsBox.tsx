export default function SuggestionsBox({ result }: { result: string }) {
  return (
    <textarea
      readOnly
      className="w-full max-w-3xl mt-8 bg-white text-black border border-gray-300 p-4 rounded-lg h-[600px]"
      value={result}
    />
  );
}