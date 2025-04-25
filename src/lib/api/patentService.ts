// src/lib/api/patentService.ts

interface SearchParams {
    query: string;
    filters: Record<string, string>;
  }
  
  interface PatentResult {
    title: string;
    number: string;
    applicant: string;
    inventors: string[];
    filingDate: string;
    abstract: string;
    thumbnailUrl?: string;
    patentUrl: string;
  }
  
  export async function fetchPatentResults(params: SearchParams): Promise<PatentResult[]> {
    try {
      const response = await fetch('/api/patent-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch patent results: ${errorText}`);
      }
  
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching patent results:', error);
      throw error;
    }
  }