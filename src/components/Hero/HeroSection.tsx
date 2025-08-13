import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function Hero({ searchQuery, setSearchQuery }) {
  return (
    <section
      className="relative min-h-[70vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://readdy.ai/api/search-image?query=modern%20luxury%20bus%20traveling%20on%20scenic%20highway%20with%20beautiful%20landscape%20mountains%20and%20blue%20sky%20in%20background%20professional%20transportation%20photography%20clean%20minimalist%20composition&width=1440&height=600&seq=hero001&orientation=landscape')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animated floating accent */}
      <motion.div
        className="absolute w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "5%" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="backdrop-blur-md bg-white/10 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.4),_-8px_-8px_16px_rgba(255,255,255,0.05)] p-6 sm:p-10 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Book Your Next Bus Trip Easily
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Find the best buses, routes, and prices — all in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for buses, routes, or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base sm:text-lg bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-purple-400 focus:ring-purple-300 rounded-xl"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
              asChild
            >
              <Link to="/agencies">Book Now</Link>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white/50 text-black hover:bg-white/20 transition-all duration-300"
              asChild
            >
              <Link to="/agencies">View Agencies</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
