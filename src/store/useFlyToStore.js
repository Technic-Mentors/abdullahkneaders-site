import { create } from 'zustand';

let nextFlightId = 0;

export const useFlyToStore = create((set) => ({
  flights: [],
  bumps: {},

  /** target: a name registered via registerIconTarget, e.g. 'cart' or 'wishlist'. */
  launch({ imageUrl, fromRect, toRect, target }) {
    if (!imageUrl || !fromRect || !toRect || !target) return;
    const id = ++nextFlightId;
    set((state) => ({ flights: [...state.flights, { id, imageUrl, fromRect, toRect, target }] }));
  },

  completeFlight(id) {
    set((state) => {
      const flight = state.flights.find((f) => f.id === id);
      return {
        flights: state.flights.filter((f) => f.id !== id),
        bumps: flight ? { ...state.bumps, [flight.target]: (state.bumps[flight.target] || 0) + 1 } : state.bumps,
      };
    });
  },
}));
