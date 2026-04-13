import { useMemo, useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Sparkles,
  FileText,
  Copy,
  Wand2,
  RotateCcw,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/summarize";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const wordCount = useMemo(() => {
    const cleaned = text.trim();
    return cleaned ? cleaned.split(/\s+/).length : 0;
  }, [text]);

  const charCount = text.length;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    setCopied(false);

    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to generate summary.");
      }

      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Copy failed.");
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,214,224,0.55),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(196,225,255,0.55),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(221,214,254,0.5),_transparent_28%)] bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.08),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.08),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.08),_transparent_24%)] dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Sparkles className="h-4 w-4" />
              WhisperBloom Theme
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              AI Text Summarizer
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              A soft pastel summarizer interface with light and dark mode.
              Paste your paragraph, article, or notes and get a clean summary in
              one click.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur-md transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-4 w-4" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                Light Mode
              </>
            )}
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-rose-100 p-3 dark:bg-rose-400/10">
                <FileText className="h-5 w-5 text-rose-500 dark:text-rose-300" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Input Text</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Enter at least 20 words for better summarization.
                </p>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              className="h-80 w-full resize-none rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-violet-200 focus:ring-2 focus:ring-violet-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">
                {wordCount} words
              </span>

              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
                {charCount} characters
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-300 via-violet-300 to-sky-300 px-5 py-3 text-sm font-semibold text-slate-800 shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Wand2 className="h-4 w-4" />
                {loading ? "Summarizing..." : "Generate Summary"}
              </button>

              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:scale-[1.02] dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 dark:bg-sky-400/10">
                  <Sparkles className="h-5 w-5 text-sky-500 dark:text-sky-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Summary Output</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your generated summary appears here.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopy}
                disabled={!summary}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex min-h-[20rem] rounded-2xl border border-sky-100 bg-sky-50/70 p-4 dark:border-white/10 dark:bg-slate-900/70">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                {summary ||
                  "Your summary will be shown here after you click Generate Summary."}
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-pink-100 via-violet-100 to-sky-100 p-4 text-sm text-slate-700 dark:from-white/5 dark:via-white/10 dark:to-white/5 dark:text-slate-300">
              <span className="font-semibold">Theme Name:</span> WhisperBloom
              <br />
              A calm pastel theme using blush pink, lavender, baby blue, and
              soft slate tones that look elegant in both light and dark mode.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}