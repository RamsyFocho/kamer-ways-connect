import React from "react";
import { CircularTestimonials } from '@/components/ui/circular-testimonials';

const testimonials = [
  {
    quote:
      "Booking my trip was so easy and fast! The platform is very intuitive, and I loved how I could instantly see available seats and routes. Traveling has never been this stress-free.",
    name: "Tamar Mendelson",
    designation: "Frequent Traveler",
    src:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "This system exceeded my expectations! I was able to book tickets for my whole family in minutes. The real-time updates on departure and arrival made the journey smooth and reliable.",
    name: "Joe Charlescraft",
    designation: "Family Traveler",
    src:
      "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
  },
  {
    quote:
      "Global Bush Quick Ride is a hidden gem! The seamless payment process, clear seat selection, and timely notifications made my journey super convenient. I highly recommend using this platform.",
    name: "Martina Edelweist",
    designation: "Satisfied Customer",
    src:
      "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
  },
  {
    quote:
      "As an agency owner, Global Bush Quick Ride has transformed how we manage bookings. No more manual seat tracking — everything is automated, clear, and accessible in real-time. It saves us hours every day!",
    name: "Samuel Nkwenti",
    designation: "Agency Owner",
    src:
      "https://previews.123rf.com/images/wavebreakmediamicro/wavebreakmediamicro1606/wavebreakmediamicro160620766/59228731-portrait-of-smiling-bus-driver-showing-thumbs-up-in-front-of-bus.jpg",
  },
  {
    quote:
      "Driving has become less stressful since passengers book online. I get updated manifests instantly, and I know exactly how many people are boarding. It's efficient and well-organized.",
    name: "Alice Fomum",
    designation: "Bus Driver",
    src:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
];


export const Testimonials = () => (
  <section>   

    {/* Dark testimonials section */}
    <div className=" p-16 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
      <div
        className="items-center justify-center relative flex"
        style={{ maxWidth: "1024px" }}
      >
        <CircularTestimonials
          testimonials={testimonials}
          autoplay={true}
          colors={{
            name: "#f7f7ff",
            designation: "#e1e1e1",
            testimony: "#f1f1f7",
            arrowBackground: "#0582CA",
            arrowForeground: "#141414",
            arrowHoverBackground: "#f7f7ff",
          }}
          fontSizes={{
            name: "28px",
            designation: "20px",
            quote: "20px",
          }}
        />
      </div>
    </div>
  </section>
);
