'use client';

import { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Notification = {
  id: number;
  initials: string;
  zone: string;
  city: string;
};

export function PurchaseNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // 1. Liste enrichie (+20 profils internationaux)
    const fakeNames = [
      "J&M", "Sarah & Tom", "Pierre & Marie", "K.W.", "Liu & Zhang", 
      "Amour2024", "David & Jen", "Elena & Igor", "Sofia & Luca", 
      "Hiro & Yuki", "Sven & Astrid", "Carlos & Maria", "John & Doe", 
      "Liam & Emma", "Noah & Olivia", "Ethan & Mia", "Lucas & Clara", 
      "Hans & Grete", "Mateo & Isabella", "Ali & Fatima", "Ravi & Priya", 
      "Chen & Wei", "Min-Ho & Ji-U", "Alejandro & Sofia", "Ben & Jerry",
      "Adam & Eve", "Romeo & Juliet", "Bonnie & Clyde"
    ];
    
    const fakeZones = ["Eiffel View", "Standard", "Sky Balloon", "Eiffel View", "Standard"];
    
    const fakeCities = [
      "London", "New York", "Tokyo", "Paris", "Berlin", "Dubai", 
      "Sydney", "Rome", "Toronto", "Rio de Janeiro", "Mumbai", 
      "Seoul", "Amsterdam", "Madrid", "Los Angeles", "Chicago", 
      "Singapore", "Hong Kong", "Barcelona", "Vienna", "Lisbon"
    ];

    const interval = setInterval(() => {
      // 2. Apparition toutes les 30 secondes (aléatoire)
      if (Math.random() > 0.3) {
        setNotification({
          id: Date.now(),
          initials: fakeNames[Math.floor(Math.random() * fakeNames.length)],
          zone: fakeZones[Math.floor(Math.random() * fakeZones.length)],
          city: fakeCities[Math.floor(Math.random() * fakeCities.length)]
        });
        
        // 3. Disparition rapide (3 secondes)
        setTimeout(() => setNotification(null), 3000);
      }
    }, 30000); // <--- Intervalle de 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    // Positionnement : En bas à gauche (Desktop) / En bas centré (Mobile)
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-40 pointer-events-none flex justify-center md:justify-start">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            // Design : Plus petit sur mobile (p-3, text-xs) pour ne pas gêner les CTA
            className="bg-white/95 backdrop-blur-md border border-slate-200 p-3 md:p-4 rounded-xl shadow-xl flex items-center gap-3 w-auto md:w-80 pointer-events-auto max-w-[90vw]"
          >
            {/* Icone plus petite sur mobile */}
            <div className="bg-rose-100 p-1.5 md:p-2 rounded-full text-[#e11d48] shrink-0">
              <Heart size={16} fill="#e11d48" className="md:w-5 md:h-5" />
            </div>
            
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-slate-900 font-bold truncate">
                {notification.initials} secured a spot!
              </p>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={10}/> {notification.city}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="text-[#e11d48] font-medium truncate hidden md:inline">
                  {notification.zone}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}