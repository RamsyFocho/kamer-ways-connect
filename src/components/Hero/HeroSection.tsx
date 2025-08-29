import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, MapPin, Calendar, X } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  // List of major cities in Cameroon
  // const cameroonCities = [
  //   "Douala", "Yaoundé", "Bamenda", "Bafoussam", "Garoua", "Maroua", "Ngaoundéré",
  //   "Kumba", "Kribi", "Limbe", "Buea", "Edea", "Foumban", "Dschang", "Nkongsamba",
  //   "Bertoua", "Ebolowa", "Mbalmayo", "Sangmélima", "Bafang"
  // ];
  const cameroonCities = [
    "Douala",
    "Yaounde",
    "Bamenda",
    "Bafoussam",
    "Garoua",
    "Maroua",
    "Ngaoundéré",
    "Kumba",
    "Kribi",
    "Limbe",
    "Buea",
    "Edea",
    "Foumban",
    "Dschang",
    "Nkongsamba",
    "Bertoua",
    "Ebolowa",
    "Mbalmayo",
    "Sangmélima",
    "Bafang",
    "Akonolinga",
    "Batouri",
    "Tiko",
    "Mutengene",
    "Mbouda",
    "Melong",
    "Manjo",
    "Bafia",
    "Abong-Mbang",
    "Kaélé",
    "Guider",
    "Tibati",
    "Wum",
    "Mokolo",
    "Fundong",
    "Bangangté",
    "Bangem",
    "Eseka",
    "Yokadouma",
    "Obala",
    "Nanga Eboko",
    "Mbanga",
    "Lolodorf",
    "Muyuka",
    "Mamfe",
    "Kousseri",
    "Pitoa",
    "Banyo",
    "Ngambe Tikar",
    "Bali",
    "Akom II",
    "Mora",
    "Kontcha",
    "Mbandjock",
    "Makénéné",
    "Ngoulemakong",
    "Ombessa",
    "Dimako",
    "Nkoteng",
    "Yabassi",
    "Garoua-Boulaï",
    "Batibo",
    "Mundemba",
    "Idenau",
    "Ekondo-Titi",
    "Jakiri",
    "Widikum",
    "Loum",
    "Bonabéri",
    "Penja",
    "Mbonge",
    "Nguti",
    "Mbengwi",
    "Ndu",
    "Babanki",
    "Bali Kumbat",
    "Kumbo",
    "Njinikom",
    "Foumbot",
    "Magba",
    "Tonga",
    "Bankim",
    "Ngaoui",
    "Tcholliré",
    "Poli",
    "Meiganga",
    "Rey Bouba",
    "Djohong",
    "Touboro",
    "Gashiga",
    "Bogo",
    "Tokombéré",
    "Gazawa",
    "Hina",
    "Kar-Hay",
    "Mindif",
    "Moulvoudaye",
    "Yagoua",
    "Guidiguis",
    "Lagdo",
    "Mayo-Oulo",
    "Demsa",
    "Bibemi",
    "Beka",
    "Bélabo",
    "Messamena",
    "Moloundou",
    "Ngoyla",
    "Lomié",
    "Kette",
    "Doumé",
    "Dimako",
    "Messok",
  ];

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
    { from: "Bafoussam", to: "Yaounde" },
    { from: "Douala", to: "Limbe" },
    { from: "Douala", to: "Kribi" },
  ];

  const handleRouteClick = (route) => {
    setOrigin(route.from);
    setDestination(route.to);
    const searchParams = new URLSearchParams({
      origin: route.from,
      destination: route.to,
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  // Filter cities based on input
  const getFilteredCities = (input, currentValue) => {
    if (!input) return cameroonCities;
    return cameroonCities.filter(
      (city) =>
        city.toLowerCase().includes(input.toLowerCase()) &&
        city !== currentValue
    );
  };

  const handleCitySelect = (city, type) => {
    if (type === "origin") {
      setOrigin(city);
      setShowOriginSuggestions(false);
    } else {
      setDestination(city);
      setShowDestinationSuggestions(false);
    }
  };

  const clearInput = (type) => {
    if (type === "origin") {
      setOrigin("");
      setShowOriginSuggestions(true);
    } else {
      setDestination("");
      setShowDestinationSuggestions(true);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".suggestion-container")) {
        setShowOriginSuggestions(false);
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <div className="relative suggestion-container">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="From (e.g., Douala)"
                  value={origin}
                  onChange={(e) => {
                    setOrigin(e.target.value);
                    setShowOriginSuggestions(true);
                  }}
                  onFocus={() => setShowOriginSuggestions(true)}
                  className="w-full text-lg text-slate-900 placeholder-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Origin"
                />
                {origin && (
                  <button
                    onClick={() => clearInput("origin")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {showOriginSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getFilteredCities(origin, destination).map(
                      (city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city, "origin")}
                          className="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-900 text-sm transition-colors"
                        >
                          {city}
                        </button>
                      )
                    )}
                    {getFilteredCities(origin, destination).length === 0 && (
                      <div className="px-4 py-3 text-slate-500 text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Destination input */}
              <div className="relative suggestion-container">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="To (e.g., Yaoundé)"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowDestinationSuggestions(true);
                  }}
                  onFocus={() => setShowDestinationSuggestions(true)}
                  className="w-full text-lg text-slate-900 placeholder-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Destination"
                />
                {destination && (
                  <button
                    onClick={() => clearInput("destination")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {showDestinationSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                    {getFilteredCities(destination, origin).map(
                      (city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city, "destination")}
                          className="w-full text-left px-4 py-3 hover:bg-slate-100 text-slate-900 text-sm transition-colors"
                        >
                          {city}
                        </button>
                      )
                    )}
                    {getFilteredCities(destination, origin).length === 0 && (
                      <div className="px-4 py-3 text-slate-500 text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                )}
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
