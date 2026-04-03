import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search, Loader2, GraduationCap } from "lucide-react";
import { gsap } from "gsap";

/**
 * Premium "Grain Ethereal" Search Box
 * Features: Real-time API search, GSAP-animated results dropdown, Ethereal styling.
 */
export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      setLoading(true);
      try {
        const res = await axios.get(`/api/courses/search?name=${value}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (results.length > 0) {
      gsap.fromTo(resultsRef.current, 
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [results]);

  return (
    <div className="relative group w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-white/40 group-focus-within:text-white/70 transition-colors pointer-events-none">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
        <input
          type="text"
          placeholder="Explore Academy wisdom..."
          value={query}
          onChange={handleSearch}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
            padding: "9px 16px 9px 38px",
            color: "white",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.3s",
            backdropFilter: "blur(8px)",
          }}
          onFocus={(e) => {
            e.target.style.background = "rgba(255,255,255,0.13)";
            e.target.style.borderColor = "rgba(124,58,237,0.6)";
            e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
          }}
          onBlur={(e) => {
            e.target.style.background = "rgba(255,255,255,0.08)";
            e.target.style.borderColor = "rgba(255,255,255,0.12)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-[101] w-full mt-3 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden"
        >
          <div className="p-2 space-y-1">
            {results.map((course) => (
              <div 
                key={course._id} 
                className="group/item flex items-center gap-3 p-3 hover:bg-[var(--primary)]/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-[var(--primary)]/10"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover/item:bg-white transition-colors">
                   <GraduationCap className="w-5 h-5 text-gray-400 group-hover/item:text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 group-hover/item:text-[var(--primary)] transition-colors truncate">
                    {course.title}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Grain Masterclass
                  </p>
                </div>
                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-[var(--primary)] px-2 py-1 bg-[var(--primary)]/10 rounded-md">
                    VIEW
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50/80 p-3 text-center border-t border-gray-100">
             <button className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[var(--primary)] transition-colors">
                See all results in the Lab
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
