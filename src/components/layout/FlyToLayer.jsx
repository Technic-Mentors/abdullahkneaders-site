import { AnimatePresence, motion } from 'framer-motion';
import { useFlyToStore } from '../../store/useFlyToStore';

export default function FlyToLayer() {
  const flights = useFlyToStore((s) => s.flights);
  const completeFlight = useFlyToStore((s) => s.completeFlight);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <AnimatePresence>
        {flights.map((flight) => {
          const fromCenterX = flight.fromRect.left + flight.fromRect.width / 2;
          const fromCenterY = flight.fromRect.top + flight.fromRect.height / 2;
          const toCenterX = flight.toRect.left + flight.toRect.width / 2;
          const toCenterY = flight.toRect.top + flight.toRect.height / 2;

          return (
            <motion.img
              key={flight.id}
              src={flight.imageUrl}
              alt=""
              style={{
                position: 'fixed',
                left: flight.fromRect.left,
                top: flight.fromRect.top,
                width: flight.fromRect.width,
                height: flight.fromRect.height,
                objectFit: 'cover',
              }}
              className="rounded-xl shadow-xl ring-2 ring-gold-500/40"
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: toCenterX - fromCenterX,
                y: toCenterY - fromCenterY,
                scale: 0.12,
                opacity: 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.45, 0, 0.55, 1] }}
              onAnimationComplete={() => completeFlight(flight.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
