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
      const searchParams = new URLSearchParams({
        origin,
        destination,
        ...(departureDate && { date: departureDate }),
      });
      navigate(`/search?${searchParams.toString()}`);
    } else {
      alert("Please enter both origin and destination.");
    }
  };

  const popularRoutes = [
    { from: "Douala", to: "Yaoundé" },
    { from: "Yaoundé", to: "Bamenda" },
    { from: "Douala", to: "Kribi" },
  ];

  const handleRouteClick = (route) => {
    const searchParams = new URLSearchParams({
      origin: route.from,
      destination: route.to,
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white">
      {/* Background Image and Dark Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20luxury%20bus%20traveling%20on%20scenic%20highway%20with%20beautiful%20landscape%20mountains%20and%20blue%20sky%20in%20background%20professional%20transportation%20photography%20clean%20minimalist%20composition&width=1440&height=600&seq=hero001&orientation=landscape')`,
          }}
        />
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>

      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
          Travel{" "}
          <span className="block font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Simplified
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-300 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
          Book your next bus journey with confidence. Simple, fast, reliable.
        </p>

        {/* Search Form Card */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            {/* Origin & Destination Inputs */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin input */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="From"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-lg text-slate-900 placeholder-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Origin"
                />
              </div>

              {/* Destination input */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="To"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-lg text-slate-900 placeholder-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Destination"
                />
              </div>
            </div>

            {/* Date and Search Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
               {/* Date input */}
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                 <input
                   type="date"
                   value={departureDate}
                   onChange={(e) => setDepartureDate(e.target.value)}
                   className="w-full text-lg text-slate-900 bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   aria-label="Departure Date"
                 />
               </div>
            </div>
          </div>
           {/* Search button */}
           <div className="mt-4">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 group"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
          <span className="text-slate-300 text-sm font-medium">
            Popular routes:
          </span>
          {popularRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleRouteClick(route)}
              className="text-sm text-white hover:text-indigo-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors duration-200"
            >
              {route.from} → {route.to}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}