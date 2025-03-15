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
    public findData = async (network: string, plan: string, duration: string): Promise<FindDataRespose | any> => {
        let service;
        try {
            const response = await this.initialize();
            if (!response || !response[network] || !response[network].ALL) {
                throw new Error ("Failed to find data plan");
            }
            const networkServices = response[network].ALL;
            const findService = networkServices.filter((service: any) => 
                service.plan == plan 
            && service.month_validate.substring(0, 2) == duration.substring(0, 2)
            );
            for (let index = 0; index < findService.length; index++) {
             service = findService[index];
           }
           if (service.month_validate.includes("CURRENTLY UNAVAILABLE")) {
            throw new Error("Data plan is currently unavailable");
           }
            if (!findService || findService.length === 0) {
                throw new AppError("No matching data service found");
            }
    
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