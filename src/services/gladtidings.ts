import axios, { AxiosInstance, AxiosResponse } from "axios";
import { GLAD_TIDINGS_CONFIG } from "../config/gladTidingsConfig";
import { DataPayload, AIRTEL_PLAN, FindDataPayload, FindDataRespose } from '../utils/types/gladTidingsPayload';
import { AppError } from "../utils/HandleErrors";
import { NetworkID } from "../utils/types/networkID";

class GladTidingsService {
    private baseUrl: string;
    private authToken: string;
    private axiosInstance: AxiosInstance;
    private findNetworkPlan: (data: string) => string | undefined;

    constructor() {
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
                throw new AppError("Failed to fetch users from Glad Tidings API");
            }
            const dataService = response.data.Dataplans;
            // console.log(dataService)
            return dataService
        } catch (error: any) {
            throw new AppError(error.message || "Failed to initialize Glad Tidings service");
        }
    };

    // Buy data
    public findData = async (data: string, plan: string): Promise<FindDataRespose | any> => {
        console.log({data})
    
        // if (!data) {
        //     return Error ("Missing required data to find data plan");
        // }
        const networkID = Number(this.findNetworkPlan(data));    
        try {
            const response = await this.initialize();    
            if (!response) {
                return new AppError("Failed to find data plan");
            }
            const networkServices = response[data];    
            const findService = networkServices.ALL.find((service: any) => 
                service.plan == plan
            );
            console.log({data:findService})
    
            // if (!findService || findService.length === 0) {
            //     return new AppError("No matching service found");
            // }
    
            // return findService;
        } catch (error: any) {
            return new Error(error.message || "Failed to find data plan");
        }
    };

    // public purchaseDataFromMErchant = async (data: DataPayload): Promise<any> => {
    //     const { network, mobile_number, plan, ident } = data;
    
    //     if (!network || !mobile_number || !plan || !ident) {
    //         return new AppError("Missing required data to purchase data");
    //     }
    
    //     try {
    //         const response = await this.axiosInstance.post('/purchase', {
    //             network,
    //             mobile_number,
    //             plan,
    //             ident
    //         });
    
    //         if (!response.data || !response.data.success) {
    //             return new AppError("Failed to purchase data from merchant");
    //         }
    
    //         return response.data;
    //     } catch (error: any) {
    //         return new AppError(error.message || "Failed to purchase data from merchant");
    //     }
    }

export const dataService = new GladTidingsService();