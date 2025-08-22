import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, MapPin, Calendar } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const handleSearch = () => {
    if (origin && destination) {
      // Navigate to search results page with query parameters
      const searchParams = new URLSearchParams({
        origin,
        destination,
        ...(departureDate && { date: departureDate }),
      });
      navigate(`/search?${searchParams.toString()}`);
    } else {
      alert("Please enter both origin and destination");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), 
                        radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                        url('https://readdy.ai/api/search-image?query=modern%20luxury%20bus%20traveling%20on%20scenic%20highway%20with%20beautiful%20landscape%20mountains%20and%20blue%20sky%20in%20background%20professional%20transportation%20photography%20clean%20minimalist%20composition&width=1440&height=600&seq=hero001&orientation=landscape')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-slate-900 mb-6">
          Travel
          <span className="block font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Simplified
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-600 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Book your next bus journey with confidence.
          <br className="hidden md:block" />
          Simple, fast, reliable.
        </p>

        {/* Search section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50">
              <div className="flex flex-col lg:flex-row items-stretch p-2 gap-2 lg:gap-0">
                {/* Origin input */}
                <div className="flex items-center flex-1 px-4 border-r border-slate-100 last:border-r-0">
                  <MapPin className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="From"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="flex-1 text-lg text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none py-4"
                  />
                </div>

                {/* Destination input */}
                <div className="flex items-center flex-1 px-4 border-r border-slate-100 last:border-r-0">
                  <MapPin className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="To"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-1 text-lg text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none py-4"
                  />
                </div>

                {/* Date input */}
                <div className="flex items-center flex-1 px-4 border-r border-slate-100 last:border-r-0">
                  <Calendar className="h-5 w-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="flex-1 text-lg text-slate-900 bg-transparent border-none outline-none py-4"
                  />
                </div>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 group min-w-[140px]"
                >
                  Search
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                const searchParams = new URLSearchParams({
                  origin: "Douala",
                  destination: "Yaoundé",
                });
                navigate(`/search?${searchParams.toString()}`);
              }}
              className="text-sm text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              Douala → Yaoundé
            </button>
            <button
              onClick={() => {
                const searchParams = new URLSearchParams({
                  origin: "Yaoundé",
                  destination: "Bamenda",
                });
                navigate(`/search?${searchParams.toString()}`);
              }}
              className="text-sm text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              Yaoundé → Bamenda
            </button>
            <button
              onClick={() => {
                const searchParams = new URLSearchParams({
                  origin: "Douala",
                  destination: "Kribi",
                });
                navigate(`/search?${searchParams.toString()}`);
              }}
              className="text-sm text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              Douala → Kribi
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/search")}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-colors duration-200 min-w-[160px]"
          >
            Book Now
          </button>
          <button
            onClick={() => navigate("/search")}
            className="text-slate-600 px-8 py-4 rounded-xl font-medium hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 min-w-[160px]"
          >
            View Routes
          </button>
        </div>
      </div>
    </section>
  );
}
