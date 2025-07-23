import { logger } from "../../utils/logger";
import {
  GSubzBuyData,
  GSubzServiceEnums,
  GSubzDataPlanResponse,
  GsubzDataPlan,
  groupedServices,
} from "../../utils/types/gsubz_service_Enums";

import axios, { AxiosInstance } from "axios";
// import { AxiosInstance } from 'axios';

export class GsubzService {
  private baseUrl: string;
  private authToken: string;
  private axiosInstance: AxiosInstance;
  constructor() {
    this.baseUrl = process.env.GSUBZ_BASE_URL || "https://api.gsubz.com";
    this.authToken = process.env.GSUBZ_AUTH_TOKEN as string;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Get All Services for a Provider
  public getAllServicesFor = (provider: string): string[] => {
    return groupedServices[provider.toLowerCase()] ?? [];
  };

  // Get All Services
  public getAllServicesBYProvider = async (provider: string): Promise<any> => {
    // Get all subservices for a provider (like ['mtn_sme', 'mtn_gifting', ...])
    const allProviderServices = this.getAllServicesFor(provider);

    const requests = allProviderServices.map((service) =>
      this.axiosInstance.get(`/api/plans?service=${service}`)
    );

    try {
      //Await all response in parallel
      const responses = await Promise.all(requests);

      // Flatten the results into a single array
      const allData = responses.map((response) => response.data);
      const filteredData = allData
        .filter((data) => data && Array.isArray(data.plans))
        .flatMap((data) => data.plans);
        console.log(`${provider}: `, filteredData)
      return filteredData;
    } catch (error: any) {
      console.error("Error fetching services:", error.message);
      // throw new Error(`Failed to fetch services for provider ${provider}: ${error.message}`);
    }
  };
  //Create Random String for Request ID
  private createRandomString = (): string => {
    const prefix = "GSubz";
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const randString = Math.random().toString(36).substring(2, 7);
    const paddeNum = randomNum.toString().padStart(4, "0");
    return `${prefix}-${randString}-${paddeNum}`;
  };

  //Find Network Service Plan
  public findNetworkServicePlan = (
    networkService: string
  ): string | undefined => {
    const services = Object.keys(GSubzServiceEnums).find(
      (Key) => Key === networkService
    );
    if (!services) {
      throw new Error(`Network service ${networkService} not found`);
    }
    console.log("Network Service Plan:", services);
    return services;
  };

  // Get Gsubz Data by Network Service
  public getGsubzDataBYNetworkService = async (
    plan_category: string
  ): Promise<GSubzDataPlanResponse> => {
    const networkService = this.findNetworkServicePlan(plan_category);
    console.log("Network Service:", networkService);
    try {
      const response = await this.axiosInstance.get(
        `/api/plans?service=${networkService}`
      );
      if (!response.data) {
        throw new Error("Failed to fetch data from Gsubz API");
      }
      const dataService = response.data;
      // console.log("Data Service:", dataService);
      return dataService;
    } catch (error: any) {
      console.log(error.message);
      return error.message;
    }
  };

  public findOneData = async (
    provider: string,
    plan: string,
    duration: string
  ): Promise<GsubzDataPlan | Error> => {
    try {
      const dataPlans = await this.getAllServicesBYProvider(provider);
      if (!dataPlans) {
        throw new Error(
          `No data plans found for the specified network service`
        );
      }

      const matched = dataPlans.find(
        (item: any) =>
          item.displayName.includes(plan) && item.displayName.includes(duration)
      );
      if (!matched) {
        throw new Error("No matched data found on Gsubz network");
      }
      console.log({ matched });
      return matched;
    } catch (error: any) {
      console.log("Error finding data:", error.message);
      return error.message;
    }
  };
     public buyGsubzDataPlan = async ( {plan, phone, value}: { plan: string, phone: string, value: string}): Promise<AxiosInstance | Error> => {
        try {
            const requestID = this.createRandomString()
          const requestBody: GSubzBuyData = {
              // serviceID: "",
              plan: value,
              api: this.authToken,
              amount: "",
              phone: phone,
              request_id: requestID,
          };
          const response = await this.axiosInstance.post(
            `/api/pay/`,
            requestBody
          );
          if (response.status !== 200) {
            throw new Error("Failed to buy data plan");
          }
          console.log("Data plan purchased successfully:", response.data);
          return response.data;
        } catch (error: any) {
          logger.error("Error buying Gsubz data plan:", error.message);
          return error.message;
        }
      }
    }
