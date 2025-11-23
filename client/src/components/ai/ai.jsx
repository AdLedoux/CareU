import React, { useState } from "react";
import api from "../../api";

export default function Ai() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/ai/test/");
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-3 max-w-md mx-auto">
      <h1 className="text-xl font-bold">AI Test Component</h1>

      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Run AI Test"}
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {result && (
        <div className="mt-4 p-3 border rounded-xl bg-gray-50">
          <h2 className="font-semibold">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}