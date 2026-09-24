import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create(
  persist(
    (set) => ({
      items: [],

      addProduct(product) {
        set((state) => {
          const withoutCurrent = state.items.filter((item) => item.id !== product.id);
          return { items: [product, ...withoutCurrent].slice(0, MAX_ITEMS) };
        });
      },
    }),
    { name: 'ma-universal-recently-viewed' },
  ),
);
