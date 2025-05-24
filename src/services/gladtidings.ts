import axios, { AxiosInstance, AxiosResponse } from "axios";
import { GLAD_TIDINGS_CONFIG } from "../config/gladTidingsConfig";
import { DataPayload, AIRTEL_PLAN, FindDataPayload, FindDataRespose } from '../utils/types/gladTidingsPayload';
import { AppError } from "../utils/HandleErrors";
import { NetworkID } from "../utils/types/networkID";
import { error } from "console";

class GladTidingsService {
    private baseUrl: string;
    private authToken: string;
    private axiosInstance: AxiosInstance;
    public findNetworkPlan: (data: string) => string | undefined;

    constructor() {
        //find the network number identifier
        this.findNetworkPlan = (data: string): string | undefined => {
            for (const network in NetworkID) {
              if (NetworkID[network] == data) {
                return network;
              }
            }
            return undefined;
          }
        if (!GLAD_TIDINGS_CONFIG.baseUrl || !GLAD_TIDINGS_CONFIG.authToken) {
            throw new Error("Missing required Glad Tidings base URL or token");
        }
        this.baseUrl = GLAD_TIDINGS_CONFIG.baseUrl;
        this.authToken = GLAD_TIDINGS_CONFIG.authToken;
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Token ${this.authToken}`,
                "Content-Type": "application/json",
            },
            timeout: 10000
        });


    }

    public initialize = async (): Promise<any> => {
        try {
            const response: AxiosResponse = await this.axiosInstance.get('/user');
            if (!response.data || !response.data.user) {
                throw new Error("Failed to fetch users from Glad Tidings API");
            }
            const dataService = response.data.Dataplans;
            // console.log(dataService)S
            return dataService
        } catch (error: any) {
            throw new AppError(error.message || "Failed to initialize Glad Tidings service");
        }
    };

    // Buy data
    /**
     * Finding Available Data Plan from gladtidings API
     * @param network 
     * @param plan 
     * @param duration 
     * @returns data object or error message
     * @throws AppError if the data plan is not found or unavailable
     */
    public findData = async (network: string, plan: string, duration: string): Promise<FindDataRespose | any> => {
        let service;
        let cheapestData;
        try {
            const response = await this.initialize();
            if (!response || !response[network] || !response[network].ALL) {
                throw new Error("Failed to find data plan");
            }
            
            const networkServices = response[network].ALL;
            const durationNumber = duration.split(" ")[0]; // Gets "30" from "30 days"
            
            // First filter out null/undefined and ensure properties exist
            const findService = networkServices
                .filter((service: any) =>
                    // service &&
                    // service.month_validate &&
                    // service.plan &&
                    // console.log(service.month_validate.split(" ")[0] == durationNumber)
                    service.month_validate.split(" ")[0] == durationNumber &&
                    service.plan === plan &&
                    service.plan_amount &&
                    service.plan_amount.substring(0, 6).length >= 6
                );
                console.log({findService})
            // Check if we found any services
            if (!findService || findService.length === 0) {
                throw new Error("No matching data service found");
            }
            //find the cheapest data if data is more than one
            if (findService.length > 1) {
                cheapestData = findService.reduce((prev: any, cur: any) => {
                    return parseFloat(cur.plan_amount) < parseFloat(prev.plan_amount) ? cur : prev;
                })
            }
            console.log({cheapestData})
            
            //Assign the cheapest
            service = findService[0];
            // Now we know service exists, so we can safely check its properties
            if (service?.month_validate.includes("CURRENTLY UNAVAILABLE")) {
                throw new Error("Data plan is currently unavailable");
            }
            // console.log({service})
            return service;
        } catch (error: any) {
            return new Error(error.message || "Failed to find data plan");
        }
    };

    public purchaseDataFromMErchant = async (payload: DataPayload): Promise<any> => {
        const { network, mobile_number, plan, Ported_number, ident } = payload;
        console.log({network, mobile_number, plan, Ported_number, ident})
    
        if (!network || !mobile_number || !plan || !ident) {
            return new AppError("Missing required information to purchase data");
        }
    
        try {
            const response = await this.axiosInstance.post('/data/', {
                network,
                mobile_number,
                Ported_number,
                plan,
                ident
            });
            console.log(response.data)
    
            if (response.data.success !== "successful") {
                return new AppError("Failed to purchase data from merchant");
            }
    
            return response.data;
        } catch (error: any) {
            return new AppError(error.message || "Failed to purchase data from merchant");
        }
    }
}

export const dataService = new GladTidingsService();