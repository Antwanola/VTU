import { GSubzAirtimePayload } from '../../utils/types/gsubz_service_Enums';
import axios from 'axios';
import { AxiosInstance } from 'axios';
class GSubzAirtime {
private apiKey: string = process.env.GSUBZ_AUTH_TOKEN as string;
private baseURL: string = process.env.GSUBZ_BASE_URL as string;
private AxiosInstance: AxiosInstance;

    constructor() {
        this.AxiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    public async purchaseAirtime( phone: string, amount:string, serviceID:string): Promise<any> {
        console.log(phone, amount, serviceID)
        const payload = {
            phone,
            amount,
            serviceID,
            api: this.apiKey
        }
        try {
            const response = await this.AxiosInstance.post('/api/pay/', payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            throw new Error(`Airtime purchase failed: ${error.message}`);
        }
    }
}
export const gSubzAirtime = new GSubzAirtime()