// hooks/use-branches.ts
import { useState, useEffect } from "react";

export interface Branch {
  id: number;
  name: string | null;
  phone_number: string | null;
  Email_Adress: string | null;
  opening_hours: string | null;
  closing_hours: string | null;
  day_from: string | null;
  day_to: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  facbook_link: string | null;
  instagram_link: string | null;
  twitter_link: string | null;
  linkdin_link: string | null;
  primery_branch: boolean;
}

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/branches/'); // Update with your actual API URL
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBranches(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch branches');
        console.error('Error fetching branches:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return {
    branches,
    isLoading,
    error,
    primaryBranch: branches.find(branch => branch.primery_branch) || null,
    otherBranches: branches.filter(branch => !branch.primery_branch) || []
  };
}