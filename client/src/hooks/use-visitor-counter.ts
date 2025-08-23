import { useEffect, useState } from 'react';

export function useVisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Check if this visitor has been counted in this session
        const hasVisited = sessionStorage.getItem('cc_visited');
        
        if (!hasVisited) {
          // Mark as visited for this session
          sessionStorage.setItem('cc_visited', 'true');
          
          // Increment counter in localStorage
          const currentCount = parseInt(localStorage.getItem('cc_total_visits') || '0');
          const newCount = currentCount + 1;
          localStorage.setItem('cc_total_visits', newCount.toString());
          setVisitorCount(newCount);
        } else {
          // Just get the current count
          const currentCount = parseInt(localStorage.getItem('cc_total_visits') || '0');
          setVisitorCount(currentCount);
        }
      } catch (error) {
        // Fallback: use a base number if localStorage fails
        setVisitorCount(1337); // A fun placeholder number
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
  }, []);

  return { visitorCount, loading };
}
