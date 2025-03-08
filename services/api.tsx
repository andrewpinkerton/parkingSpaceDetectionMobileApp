// ../services/api.ts

export type ParkingSpotSummary = {
  total_spots: number;
  occupied_spots: number;
  vacant_spots: number;
  occupancy_rate: number;
  occupied_spot_index: number[];
};

export type ApiResponse = {
  result: ParkingSpotSummary;
};

export const fetchData = async (endpoint: string): Promise<ApiResponse | null> => {
  try {
    const url = `http://127.0.0.1:8000/process${endpoint}`;
    console.log("Fetching data from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }


    const json: ApiResponse = await response.json();
    console.log("Fetched JSON:", json);

    return json;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
