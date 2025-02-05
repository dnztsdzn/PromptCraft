import googlethis from 'googlethis';

export async function performSearch(query: string): Promise<string> {
  try {
    const options = {
      page: 0,
      safe: true,
      additional_params: {
        hl: 'en'
      }
    };

    const response = await googlethis.search(query, options);
    
    // Format the search results
    const formattedResults = response.results
      .slice(0, 3) // Take top 3 results
      .map((result: any) => ({
        title: result.title,
        description: result.description,
        url: result.url
      }))
      .map((result: any) => 
        `Title: ${result.title}\nDescription: ${result.description}\nURL: ${result.url}\n`
      )
      .join('\n');

    return formattedResults;
  } catch (error: any) {
    console.error('Search error:', error);
    return "Could not perform search at this time.";
  }
}
