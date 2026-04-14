import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, GraduationCap, X } from "lucide-react";
import { gsap } from "gsap";

/**
 * Premium "Grain Ethereal" Search Box
 * Features: 
 * - Debounced API search (300ms)
 * - Keyboard navigation (Arrows, Enter, Esc)
 * - Click-outside handler
 * - Animated results dropdown
 */
export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // ── Search with Debounce ──────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/courses/search?name=${query}`);
        setResults(res.data);
        setSelectedIndex(-1); // Reset selection on new search
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // ── Click Outside Handler ───────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Keyboard Navigation ──────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        handleNavigate(results[selectedIndex]._id);
      }
    } else if (e.key === "Escape") {
      setResults([]);
      inputRef.current?.blur();
    }
  };

  const handleNavigate = (courseId) => {
    setQuery("");
    setResults([]);
    navigate(`/course/${courseId}`);
  };

  // ── Animations ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (results.length > 0) {
      gsap.fromTo(resultsRef.current, 
        { opacity: 0, y: -10, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [results]);

  return (
    <div ref={containerRef} className="relative group w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-white/30 group-focus-within:text-white/60 transition-colors pointer-events-none">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Search courses, skills, masters..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "12px 40px 12px 44px",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            outline: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(12px)",
          }}
          className="focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5"
        />

        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3.5 p-1 rounded-full hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-[1000] w-full mt-3 bg-white/95 backdrop-blur-3xl rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-white/40 overflow-hidden"
        >
          <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
            {results.map((course, index) => (
              <div 
                key={course._id} 
                onClick={() => handleNavigate(course._id)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`
                  flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer border border-transparent
                  ${selectedIndex === index ? "bg-indigo-600/5 border-indigo-600/10 shadow-sm" : "hover:bg-gray-50/80"}
                `}
              >
                <div className={`
                  w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300
                  ${selectedIndex === index ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-gray-100 text-gray-400"}
                `}>
                   {course.imageUrl ? (
                     <img src={course.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                   ) : (
                     <GraduationCap className="w-5 h-5" />
                   )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`
                    text-sm font-extrabold transition-colors truncate
                    ${selectedIndex === index ? "text-indigo-600" : "text-gray-800"}
                  `}>
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-black">
                      Grain Academy
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                    <span className="text-[10px] font-bold text-indigo-500/80">
                      ₹{course.price}
                    </span>
                  </div>
                </div>

                <div className={`
                  transition-all duration-300 transform
                  ${selectedIndex === index ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"}
                `}>
                  <span className="text-[10px] font-black tracking-widest text-indigo-600 px-3 py-1.5 bg-indigo-600/10 rounded-lg">
                    OPEN
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50/50 p-4 text-center border-t border-gray-100/50">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Press <span className="text-gray-600 px-1 bg-gray-200 rounded mx-0.5">Enter</span> to explore
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
