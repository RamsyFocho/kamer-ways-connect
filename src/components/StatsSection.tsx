import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bus, Users, MapPin, Shield } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[^0-9]/g, ''));
      const suffix = value.replace(/[0-9]/g, '');
      
      if (start === end) {
        setCount(value);
        return;
      }

      // Faster animation with fewer steps
      const totalSteps = 20; // Reduced from continuous increment
      const increment = Math.ceil(end / totalSteps);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end + suffix);
          clearInterval(timer);
        } else {
          setCount(current + suffix);
        }
      }, duration / totalSteps);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
  const stats = [
    { icon: Bus, label: "Active Buses", value: "200+" },
    { icon: Users, label: "Happy Customers", value: "50K+" },
    { icon: MapPin, label: "Cities Connected", value: "25+" },
    { icon: Shield, label: "Safety Rating", value: "99.9%" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        duration: 0.6
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group relative p-6 rounded-xl  backdrop-blur-sm border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {/* Icon with faster animation */}
              <motion.div
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl mb-4 mx-auto"
                variants={iconVariants}
                whileHover={{
                  scale: 1.1,
                  rotate: 2,
                  transition: { duration: 0.15 }
                }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>

              {/* Faster counter animation */}
              <motion.div
                className="text-2xl md:text-3xl font-bold text-primary mb-2 font-mono"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.3 }}
              >
                <AnimatedCounter value={stat.value} duration={600} />
              </motion.div>

              {/* Label */}
              <motion.div
                className="text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;