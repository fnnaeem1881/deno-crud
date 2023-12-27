export interface Trip {
    id?: string;
    car_name: string;
    pick_up_location: string;
    destination: string;
    driver_id?: string;
    user_id: string;
    status?: number;
  }