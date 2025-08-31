export const dataList: {
  [key: string]: { size: string; serviceType: string; duration?: string; price?: string }[];
} = {
  MTN: [
    // Daily Plans (1 day)
    { size: "75MB", serviceType: "mtn_sme", duration: "1 day", price: "75" },
    { size: "110MB", serviceType: "mtn_sme", duration: "1 day", price: "100" },
    { size: "230MB", serviceType: "mtn_sme", duration: "1 day", price: "200" },
    { size: "500MB", serviceType: "mtn_sme", duration: "1 day", price: "350" },
    { size: "1GB + 1.5 mins", serviceType: "mtn_sme", duration: "1 day", price: "500" },
    { size: "2.5GB", serviceType: "mtn_sme", duration: "1 day", price: "750" },

    // 2-Day Plans
    { size: "1.5GB", serviceType: "mtn_sme", duration: "2 days", price: "600" },
    { size: "2GB", serviceType: "mtn_sme", duration: "2 days", price: "750" },
    { size: "2.5GB", serviceType: "mtn_sme", duration: "2 days", price: "900" },
    { size: "3.2GB", serviceType: "mtn_sme", duration: "2 days", price: "1000" },
    { size: "7GB", serviceType: "mtn_sme", duration: "2 days", price: "1800" },

    // Weekly Plans (7 days)
    { size: "500MB", serviceType: "mtn_sme", duration: "7 days", price: "500" },
    { size: "1GB", serviceType: "mtn_sme", duration: "7 days", price: "800" },
    { size: "1.5GB", serviceType: "mtn_sme", duration: "7 days", price: "1000" },
    { size: "3.5GB", serviceType: "mtn_sme", duration: "7 days", price: "1500" },
    { size: "6GB", serviceType: "mtn_sme", duration: "7 days", price: "2500" },
    { size: "11GB", serviceType: "mtn_sme", duration: "7 days", price: "3500" },
    { size: "20GB", serviceType: "mtn_sme", duration: "7 days", price: "5000" },

    // Monthly Plans (30 days)
    { size: "2GB + 2 mins", serviceType: "mtn_sme", duration: "30 days", price: "1500" },
    { size: "2.7GB + 2 mins", serviceType: "mtn_sme", duration: "30 days", price: "2000" },
    { size: "3.5GB + 5 mins", serviceType: "mtn_sme", duration: "30 days", price: "2500" },
    { size: "7GB", serviceType: "mtn_sme", duration: "30 days", price: "3500" },
    { size: "10GB + 10 mins", serviceType: "mtn_sme", duration: "30 days", price: "4500" },
    { size: "12.5GB", serviceType: "mtn_sme", duration: "30 days", price: "5500" },
    { size: "16.5GB + 10 mins", serviceType: "mtn_sme", duration: "30 days", price: "6500" },
    { size: "18.6GB Always On", serviceType: "mtn_sme", duration: "30 days", price: "5500" },
    { size: "20GB", serviceType: "mtn_sme", duration: "30 days", price: "7500" },
    { size: "25GB", serviceType: "mtn_sme", duration: "30 days", price: "9000" },
    { size: "36GB", serviceType: "mtn_sme", duration: "30 days", price: "11000" },
    { size: "45GB Always On", serviceType: "mtn_sme", duration: "30 days", price: "9000" },
    { size: "65GB", serviceType: "mtn_sme", duration: "30 days", price: "16000" },
    { size: "75GB", serviceType: "mtn_sme", duration: "30 days", price: "18000" },
    { size: "165GB", serviceType: "mtn_sme", duration: "30 days", price: "35000" },
    { size: "250GB", serviceType: "mtn_sme", duration: "30 days", price: "55000" },

    // 2-Month Plans (60 days)
    { size: "90GB", serviceType: "mtn_sme", duration: "60 days", price: "25000" },
    { size: "150GB", serviceType: "mtn_sme", duration: "60 days", price: "40000" },

    // 3-Month Plans (90 days)
    { size: "480GB", serviceType: "mtn_sme", duration: "90 days", price: "90000" },

    // Yearly Plan (365 days)
    { size: "800GB", serviceType: "mtn_sme", duration: "365 days", price: "125000" },
  ],

   GLO: [
    // Short-Term Plans
    { size: "105MB", serviceType: "glo_data", duration: "2 days", price: "100" },
    { size: "350MB", serviceType: "glo_data", duration: "4 days", price: "200" },

    // Monthly Plans (30 days)
    { size: "2.5GB", serviceType: "glo_data", duration: "30 days", price: "1000" },
    { size: "5.8GB", serviceType: "glo_data", duration: "30 days", price: "2000" },
    { size: "7.7GB", serviceType: "glo_data", duration: "30 days", price: "2500" },
    { size: "10GB", serviceType: "glo_data", duration: "30 days", price: "3000" },
    { size: "13.25GB", serviceType: "glo_data", duration: "30 days", price: "4000" },
    { size: "18.25GB", serviceType: "glo_data", duration: "30 days", price: "5000" },
    { size: "29.5GB", serviceType: "glo_data", duration: "30 days", price: "8000" },
    { size: "50GB", serviceType: "glo_data", duration: "30 days", price: "10000" },
    { size: "93GB", serviceType: "glo_data", duration: "30 days", price: "15000" },
    { size: "119GB", serviceType: "glo_data", duration: "30 days", price: "18000" },
    { size: "138GB", serviceType: "glo_data", duration: "30 days", price: "20000" },

    // SME-specific plans (30 days)
    { size: "200MB", serviceType: "glo_sme", duration: "14 days", price: "70" },
    { size: "1GB", serviceType: "glo_sme", duration: "30 days", price: "320" },
    { size: "3GB", serviceType: "glo_sme", duration: "30 days", price: "960" },
    { size: "10GB", serviceType: "glo_sme", duration: "30 days", price: "3100" },
  ],

 AIRTEL: [
    // Daily Plans (1 day)
    { size: "40MB", serviceType: "airtel_sme", duration: "1 day", price: "50" },
    { size: "75MB", serviceType: "airtel_sme", duration: "1 day", price: "75" },
    { size: "100MB", serviceType: "airtel_sme", duration: "1 day", price: "100" },
    { size: "300MB", serviceType: "airtel_sme", duration: "1 day", price: "300" },
    { size: "1GB", serviceType: "airtel_sme", duration: "1 day", price: "350" },
    { size: "200MB", serviceType: "airtel_sme", duration: "3 days", price: "200" },

    // Weekly Plans (7 days)
    { size: "350MB", serviceType: "airtel_sme", duration: "7 days", price: "350" },
    { size: "500MB", serviceType: "airtel_sme", duration: "7 days", price: "500" }, 
    { size: "2GB", serviceType: "airtel_sme", duration: "2 days", price: "500" },   
    { size: "1.5GB", serviceType: "airtel_sme", duration: "7 days", price: "1000" },
    { size: "3.5GB", serviceType: "airtel_sme", duration: "7 days", price: "1500" },
    { size: "6GB", serviceType: "airtel_sme", duration: "7 days", price: "2500" },
    { size: "10GB", serviceType: "airtel_sme", duration: "7 days", price: "3000" },
    { size: "18GB", serviceType: "airtel_sme", duration: "7 days", price: "5000" },

    // Monthly Plans (30 days) – SME
    { size: "2GB", serviceType: "airtel_sme", duration: "30 days", price: "1500" },
    { size: "3GB", serviceType: "airtel_sme", duration: "30 days", price: "2000" },
    { size: "4GB", serviceType: "airtel_sme", duration: "30 days", price: "2500" },
    { size: "8GB", serviceType: "airtel_sme", duration: "30 days", price: "3000" },
    { size: "10GB", serviceType: "airtel_sme", duration: "30 days", price: "4000" },
    { size: "13GB", serviceType: "airtel_sme", duration: "30 days", price: "5000" },
    { size: "18GB", serviceType: "airtel_sme", duration: "30 days", price: "6000" },

    // Monthly Plans (30 days) – Corporate/Gifting
    { size: "25GB", serviceType: "airtel_cg", duration: "30 days", price: "8000" },
    { size: "35GB", serviceType: "airtel_cg", duration: "30 days", price: "10000" },
    { size: "60GB", serviceType: "airtel_cg", duration: "30 days", price: "15000" },
    { size: "100GB", serviceType: "airtel_cg", duration: "30 days", price: "20000" },
    { size: "160GB", serviceType: "airtel_cg", duration: "30 days", price: "30000" },
    { size: "210GB", serviceType: "airtel_cg", duration: "30 days", price: "40000" },

    // Mega Plans (Quarterly+)
    { size: "200GB", serviceType: "airtel_cg", duration: "90 days", price: "53900" },
    { size: "350GB", serviceType: "airtel_cg", duration: "120 days", price: "63386" },
    { size: "280GB", serviceType: "airtel_cg", duration: "30 days", price: "38031" },
    { size: "680GB", serviceType: "airtel_cg", duration: "365 days", price: "107800" },
  ],

  "9MOBILE": [
    // Daily Plans (1 day)
    { size: "10MB", serviceType: "etisalat_data", duration: "1 day", price: "50" },
    { size: "40MB", serviceType: "etisalat_data", duration: "1 day", price: "100" },
    { size: "650MB", serviceType: "etisalat_data", duration: "1 day", price: "200" },
    { size: "1GB", serviceType: "etisalat_data", duration: "1 day", price: "300" },
    { size: "300MB + 300 secs", serviceType: "etisalat_data", duration: "1 day", price: "150" },

    // Weekly Plans (7 days)
    { size: "250MB", serviceType: "etisalat_data", duration: "7 days", price: "200" },
    { size: "7GB + social", serviceType: "etisalat_data", duration: "7 days", price: "1,500" },
    { size: "1GB + social", serviceType: "etisalat_data", duration: "7 days", price: "500" },
    { size: "2GB + social", serviceType: "etisalat_data", duration: "3 days", price: "500" },

    // Monthly Plans (30 days)
    { size: "500MB", serviceType: "etisalat_data", duration: "30 days", price: "500" },
    { size: "1.5GB", serviceType: "etisalat_data", duration: "30 days", price: "1,000" },
    { size: "2GB", serviceType: "etisalat_data", duration: "30 days", price: "1,200" },
    { size: "2.5GB", serviceType: "etisalat_data", duration: "30 days", price: "2,000" },
    { size: "4GB", serviceType: "etisalat_data", duration: "30 days", price: "3,000" },
    { size: "5.5GB", serviceType: "etisalat_data", duration: "30 days", price: "4,000" },
    { size: "11.5GB", serviceType: "etisalat_data", duration: "30 days", price: "8,000" },
    { size: "15GB", serviceType: "etisalat_data", duration: "30 days", price: "10,000" },
    { size: "27.5GB", serviceType: "etisalat_data", duration: "30 days", price: "18,000" },

    // Night / Weekend Plans
    { size: "1GB Night Only (12 am–4 am)", serviceType: "etisalat_data", duration: "1 day", price: "200" },
    { size: "1GB Weekend (Fri 11:59 pm–Sun 11:59 pm)", serviceType: "etisalat_data", duration: "2 days", price: "500" },
    { size: "2GB Evening & Weekend (7 pm–7 am × 30 days)", serviceType: "etisalat_data", duration: "30 days", price: "1,000" },

    // Mega Plans (90+ days)
    { size: "30GB", serviceType: "etisalat_data", duration: "90 days", price: "27,500" },
    { size: "60GB", serviceType: "etisalat_data", duration: "180 days", price: "55,000" },
    { size: "100GB", serviceType: "etisalat_data", duration: "30 days", price: "84,992" },
    { size: "120GB", serviceType: "etisalat_data", duration: "365 days", price: "110,000" },
    { size: "75GB", serviceType: "etisalat_data", duration: "90 days", price: "25,000" },
    { size: "165GB", serviceType: "etisalat_data", duration: "180 days", price: "50,000" },
    { size: "225GB", serviceType: "etisalat_data", duration: "60 days", price: "30,000" },
    { size: "425GB", serviceType: "etisalat_data", duration: "90 days", price: "50,000" },
    { size: "600GB", serviceType: "etisalat_data", duration: "180 days", price: "70,000" },
    { size: "1TB", serviceType: "etisalat_data", duration: "365 days", price: "100,000" }
  ],

};
