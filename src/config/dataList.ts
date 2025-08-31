export const dataList: {
  [key: string]: { size: string; serviceType: string; duration?: string; price?: string }[];
} = {
  MTN: [
    // Daily Plans (1 day) - SME
    { size: "75MB", serviceType: "mtn_sme", duration: "1 day", price: "75" },
    { size: "110MB", serviceType: "mtn_sme", duration: "1 day", price: "100" },
    { size: "230MB", serviceType: "mtn_sme", duration: "1 day", price: "200" },
    { size: "500MB", serviceType: "mtn_sme", duration: "1 day", price: "350" },
    { size: "1GB + 1.5 mins", serviceType: "mtn_sme", duration: "1 day", price: "500" },
    { size: "2.5GB", serviceType: "mtn_sme", duration: "1 day", price: "750" },

    // Daily Plans (1 day) - CG Lite (SME 2.0)
    { size: "100MB", serviceType: "mtn_cg_lite", duration: "1 day", price: "80" },
    { size: "200MB", serviceType: "mtn_cg_lite", duration: "1 day", price: "150" },
    { size: "500MB", serviceType: "mtn_cg_lite", duration: "1 day", price: "300" },
    { size: "1GB", serviceType: "mtn_cg_lite", duration: "1 day", price: "450" },

    // Daily Plans (1 day) - Gifting
    { size: "150MB", serviceType: "mtn_gifting", duration: "1 day", price: "120" },
    { size: "350MB", serviceType: "mtn_gifting", duration: "1 day", price: "250" },
    { size: "750MB", serviceType: "mtn_gifting", duration: "1 day", price: "400" },

    // Daily Plans (1 day) - Coupon
    { size: "100MB", serviceType: "mtn_coupon", duration: "1 day", price: "100" },
    { size: "300MB", serviceType: "mtn_coupon", duration: "1 day", price: "250" },
    { size: "600MB", serviceType: "mtn_coupon", duration: "1 day", price: "400" },

    // 2-Day Plans - SME
    { size: "1.5GB", serviceType: "mtn_sme", duration: "2 days", price: "600" },
    { size: "2GB", serviceType: "mtn_sme", duration: "2 days", price: "750" },
    { size: "2.5GB", serviceType: "mtn_sme", duration: "2 days", price: "900" },
    { size: "3.2GB", serviceType: "mtn_sme", duration: "2 days", price: "1000" },
    { size: "7GB", serviceType: "mtn_sme", duration: "2 days", price: "1800" },

    // 2-Day Plans - CG Lite
    { size: "1GB", serviceType: "mtn_cg_lite", duration: "2 days", price: "500" },
    { size: "2GB", serviceType: "mtn_cg_lite", duration: "2 days", price: "700" },
    { size: "3GB", serviceType: "mtn_cg_lite", duration: "2 days", price: "950" },

    // Weekly Plans (7 days) - SME
    { size: "500MB", serviceType: "mtn_sme", duration: "7 days", price: "500" },
    { size: "1GB", serviceType: "mtn_sme", duration: "7 days", price: "800" },
    { size: "1.5GB", serviceType: "mtn_sme", duration: "7 days", price: "1000" },
    { size: "3.5GB", serviceType: "mtn_sme", duration: "7 days", price: "1500" },
    { size: "6GB", serviceType: "mtn_sme", duration: "7 days", price: "2500" },
    { size: "11GB", serviceType: "mtn_sme", duration: "7 days", price: "3500" },
    { size: "20GB", serviceType: "mtn_sme", duration: "7 days", price: "5000" },

    // Weekly Plans (7 days) - Gifting
    { size: "1GB", serviceType: "mtn_gifting", duration: "7 days", price: "700" },
    { size: "2GB", serviceType: "mtn_gifting", duration: "7 days", price: "1200" },
    { size: "5GB", serviceType: "mtn_gifting", duration: "7 days", price: "2200" },
    { size: "10GB", serviceType: "mtn_gifting", duration: "7 days", price: "3800" },

    // Weekly Plans (7 days) - Corporate Gifting
    { size: "15GB", serviceType: "mtncg", duration: "7 days", price: "4500" },
    { size: "25GB", serviceType: "mtncg", duration: "7 days", price: "6500" },

    // Monthly Plans (30 days) - SME
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

    // Monthly Plans (30 days) - CG Lite (SME 2.0)
    { size: "3GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "1800" },
    { size: "5GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "2800" },
    { size: "8GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "4000" },
    { size: "15GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "6500" },
    { size: "25GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "9500" },
    { size: "40GB", serviceType: "mtn_cg_lite", duration: "30 days", price: "13000" },

    // Monthly Plans (30 days) - Gifting
    { size: "2.5GB", serviceType: "mtn_gifting", duration: "30 days", price: "1800" },
    { size: "5GB", serviceType: "mtn_gifting", duration: "30 days", price: "3200" },
    { size: "10GB", serviceType: "mtn_gifting", duration: "30 days", price: "5500" },
    { size: "20GB", serviceType: "mtn_gifting", duration: "30 days", price: "9500" },
    { size: "30GB", serviceType: "mtn_gifting", duration: "30 days", price: "12000" },

    // Monthly Plans (30 days) - Corporate Gifting
    { size: "50GB", serviceType: "mtncg", duration: "30 days", price: "15000" },
    { size: "80GB", serviceType: "mtncg", duration: "30 days", price: "22000" },
    { size: "120GB", serviceType: "mtncg", duration: "30 days", price: "30000" },
    { size: "200GB", serviceType: "mtncg", duration: "30 days", price: "45000" },

    // Monthly Plans (30 days) - Coupon
    { size: "1.5GB", serviceType: "mtn_coupon", duration: "30 days", price: "1200" },
    { size: "3GB", serviceType: "mtn_coupon", duration: "30 days", price: "2200" },
    { size: "6GB", serviceType: "mtn_coupon", duration: "30 days", price: "3800" },
    { size: "12GB", serviceType: "mtn_coupon", duration: "30 days", price: "6500" },

    // 2-Month Plans (60 days)
    { size: "90GB", serviceType: "mtn_sme", duration: "60 days", price: "25000" },
    { size: "150GB", serviceType: "mtn_sme", duration: "60 days", price: "40000" },
    { size: "120GB", serviceType: "mtncg", duration: "60 days", price: "32000" },
    { size: "200GB", serviceType: "mtncg", duration: "60 days", price: "48000" },

    // 3-Month Plans (90 days)
    { size: "480GB", serviceType: "mtn_sme", duration: "90 days", price: "90000" },
    { size: "300GB", serviceType: "mtncg", duration: "90 days", price: "65000" },
    { size: "500GB", serviceType: "mtncg", duration: "90 days", price: "95000" },

    // Yearly Plan (365 days)
    { size: "800GB", serviceType: "mtn_sme", duration: "365 days", price: "125000" },
    { size: "1TB", serviceType: "mtncg", duration: "365 days", price: "180000" },
  ],

  GLO: [
    // Short-Term Plans - Regular Data
    { size: "105MB", serviceType: "glo_data", duration: "2 days", price: "100" },
    { size: "350MB", serviceType: "glo_data", duration: "4 days", price: "200" },

    // Short-Term Plans - SME
    { size: "200MB", serviceType: "glo_sme", duration: "2 days", price: "80" },
    { size: "400MB", serviceType: "glo_sme", duration: "4 days", price: "180" },

    // Weekly Plans (7 days) - Regular Data
    { size: "1GB", serviceType: "glo_data", duration: "7 days", price: "600" },
    { size: "2.5GB", serviceType: "glo_data", duration: "7 days", price: "1200" },
    { size: "5GB", serviceType: "glo_data", duration: "7 days", price: "2000" },

    // Weekly Plans (7 days) - SME
    { size: "1.5GB", serviceType: "glo_sme", duration: "7 days", price: "500" },
    { size: "3GB", serviceType: "glo_sme", duration: "7 days", price: "900" },
    { size: "6GB", serviceType: "glo_sme", duration: "7 days", price: "1800" },

    // Monthly Plans (30 days) - Regular Data
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

    // Monthly Plans (30 days) - SME
    { size: "200MB", serviceType: "glo_sme", duration: "14 days", price: "70" },
    { size: "1GB", serviceType: "glo_sme", duration: "30 days", price: "320" },
    { size: "3GB", serviceType: "glo_sme", duration: "30 days", price: "960" },
    { size: "10GB", serviceType: "glo_sme", duration: "30 days", price: "3100" },
    { size: "5GB", serviceType: "glo_sme", duration: "30 days", price: "1800" },
    { size: "8GB", serviceType: "glo_sme", duration: "30 days", price: "2500" },
    { size: "15GB", serviceType: "glo_sme", duration: "30 days", price: "4200" },
    { size: "25GB", serviceType: "glo_sme", duration: "30 days", price: "6800" },
    { size: "40GB", serviceType: "glo_sme", duration: "30 days", price: "9500" },

    // Quarterly Plans (90 days) - Regular Data
    { size: "200GB", serviceType: "glo_data", duration: "90 days", price: "45000" },
    { size: "300GB", serviceType: "glo_data", duration: "90 days", price: "60000" },

    // Quarterly Plans (90 days) - SME
    { size: "150GB", serviceType: "glo_sme", duration: "90 days", price: "35000" },
    { size: "250GB", serviceType: "glo_sme", duration: "90 days", price: "52000" },
  ],

AIRTEL: [
    // Daily Plans (1 day) - SME
    { size: "40MB", serviceType: "airtel_sme", duration: "1 day", price: "50" },
    { size: "75MB", serviceType: "airtel_sme", duration: "1 day", price: "75" },
    { size: "100MB", serviceType: "airtel_sme", duration: "1 day", price: "100" },
    { size: "300MB", serviceType: "airtel_sme", duration: "1 day", price: "300" },
    { size: "1GB", serviceType: "airtel_sme", duration: "1 day", price: "350" },

    // Daily Plans (1 day) - Corporate Gifting
    { size: "100MB", serviceType: "airtel_cg", duration: "1 day", price: "80" },
    { size: "250MB", serviceType: "airtel_cg", duration: "1 day", price: "180" },
    { size: "500MB", serviceType: "airtel_cg", duration: "1 day", price: "320" },
    { size: "1.2GB", serviceType: "airtel_cg", duration: "1 day", price: "450" },

    // Multi-day Plans - SME
    { size: "200MB", serviceType: "airtel_sme", duration: "3 days", price: "200" },
    { size: "2GB", serviceType: "airtel_sme", duration: "2 days", price: "500" },

    // Multi-day Plans - Corporate Gifting
    { size: "1.5GB", serviceType: "airtel_cg", duration: "3 days", price: "600" },
    { size: "3GB", serviceType: "airtel_cg", duration: "2 days", price: "800" },

    // Weekly Plans (7 days) - SME
    { size: "350MB", serviceType: "airtel_sme", duration: "7 days", price: "350" },
    { size: "500MB", serviceType: "airtel_sme", duration: "7 days", price: "500" },
    { size: "1.5GB", serviceType: "airtel_sme", duration: "7 days", price: "1000" },
    { size: "3.5GB", serviceType: "airtel_sme", duration: "7 days", price: "1500" },
    { size: "6GB", serviceType: "airtel_sme", duration: "7 days", price: "2500" },
    { size: "10GB", serviceType: "airtel_sme", duration: "7 days", price: "3000" },
    { size: "18GB", serviceType: "airtel_sme", duration: "7 days", price: "5000" },

    // Weekly Plans (7 days) - Corporate Gifting
    { size: "2GB", serviceType: "airtel_cg", duration: "7 days", price: "1200" },
    { size: "5GB", serviceType: "airtel_cg", duration: "7 days", price: "2200" },
    { size: "12GB", serviceType: "airtel_cg", duration: "7 days", price: "4200" },
    { size: "20GB", serviceType: "airtel_cg", duration: "7 days", price: "6500" },

    // Monthly Plans (30 days) - SME
    { size: "2GB", serviceType: "airtel_sme", duration: "30 days", price: "1500" },
    { size: "3GB", serviceType: "airtel_sme", duration: "30 days", price: "2000" },
    { size: "4GB", serviceType: "airtel_sme", duration: "30 days", price: "2500" },
    { size: "8GB", serviceType: "airtel_sme", duration: "30 days", price: "3000" },
    { size: "10GB", serviceType: "airtel_sme", duration: "30 days", price: "4000" },
    { size: "13GB", serviceType: "airtel_sme", duration: "30 days", price: "5000" },
    { size: "18GB", serviceType: "airtel_sme", duration: "30 days", price: "6000" },

    // Monthly Plans (30 days) - Corporate Gifting
    { size: "25GB", serviceType: "airtel_cg", duration: "30 days", price: "8000" },
    { size: "35GB", serviceType: "airtel_cg", duration: "30 days", price: "10000" },
    { size: "60GB", serviceType: "airtel_cg", duration: "30 days", price: "15000" },
    { size: "100GB", serviceType: "airtel_cg", duration: "30 days", price: "20000" },
    { size: "160GB", serviceType: "airtel_cg", duration: "30 days", price: "30000" },
    { size: "210GB", serviceType: "airtel_cg", duration: "30 days", price: "40000" },
    { size: "280GB", serviceType: "airtel_cg", duration: "30 days", price: "38031" },

    // Mega Plans - Corporate Gifting
    { size: "200GB", serviceType: "airtel_cg", duration: "90 days", price: "53900" },
    { size: "350GB", serviceType: "airtel_cg", duration: "120 days", price: "63386" },
    { size: "680GB", serviceType: "airtel_cg", duration: "365 days", price: "107800" },

    // Mega Plans - SME (Extended)
    { size: "50GB", serviceType: "airtel_sme", duration: "60 days", price: "18000" },
    { size: "85GB", serviceType: "airtel_sme", duration: "90 days", price: "28000" },
    { size: "150GB", serviceType: "airtel_sme", duration: "120 days", price: "42000" },
  ],

  "9MOBILE": [
    // Daily Plans (1 day) - Regular Data
    { size: "10MB", serviceType: "etisalat_data", duration: "1 day", price: "50" },
    { size: "40MB", serviceType: "etisalat_data", duration: "1 day", price: "100" },
    { size: "650MB", serviceType: "etisalat_data", duration: "1 day", price: "200" },
    { size: "1GB", serviceType: "etisalat_data", duration: "1 day", price: "300" },
    { size: "300MB + 300 secs", serviceType: "etisalat_data", duration: "1 day", price: "150" },

    // Night Plans
    { size: "1GB Night Only (12 am–4 am)", serviceType: "etisalat_data", duration: "1 day", price: "200" },

    // Multi-day Plans - Regular Data
    { size: "2GB + social", serviceType: "etisalat_data", duration: "3 days", price: "500" },
    { size: "1GB Weekend (Fri 11:59 pm–Sun 11:59 pm)", serviceType: "etisalat_data", duration: "2 days", price: "500" },

    // Weekly Plans (7 days) - Regular Data
    { size: "250MB", serviceType: "etisalat_data", duration: "7 days", price: "200" },
    { size: "1GB + social", serviceType: "etisalat_data", duration: "7 days", price: "500" },
    { size: "7GB + social", serviceType: "etisalat_data", duration: "7 days", price: "1500" },

    // Monthly Plans (30 days) - Regular Data
    { size: "500MB", serviceType: "etisalat_data", duration: "30 days", price: "500" },
    { size: "1.5GB", serviceType: "etisalat_data", duration: "30 days", price: "1000" },
    { size: "2GB", serviceType: "etisalat_data", duration: "30 days", price: "1200" },
    { size: "2.5GB", serviceType: "etisalat_data", duration: "30 days", price: "2000" },
    { size: "4GB", serviceType: "etisalat_data", duration: "30 days", price: "3000" },
    { size: "5.5GB", serviceType: "etisalat_data", duration: "30 days", price: "4000" },
    { size: "11.5GB", serviceType: "etisalat_data", duration: "30 days", price: "8000" },
    { size: "15GB", serviceType: "etisalat_data", duration: "30 days", price: "10000" },
    { size: "27.5GB", serviceType: "etisalat_data", duration: "30 days", price: "18000" },
    { size: "100GB", serviceType: "etisalat_data", duration: "30 days", price: "84992" },

    // Evening & Weekend Plans
    { size: "2GB Evening & Weekend (7 pm–7 am × 30 days)", serviceType: "etisalat_data", duration: "30 days", price: "1000" },

    // Quarterly Plans (90 days) - Regular Data
    { size: "30GB", serviceType: "etisalat_data", duration: "90 days", price: "27500" },
    { size: "75GB", serviceType: "etisalat_data", duration: "90 days", price: "25000" },
    { size: "425GB", serviceType: "etisalat_data", duration: "90 days", price: "50000" },

    // Semi-Annual Plans (180 days) - Regular Data
    { size: "60GB", serviceType: "etisalat_data", duration: "180 days", price: "55000" },
    { size: "165GB", serviceType: "etisalat_data", duration: "180 days", price: "50000" },
    { size: "225GB", serviceType: "etisalat_data", duration: "60 days", price: "30000" },
    { size: "600GB", serviceType: "etisalat_data", duration: "180 days", price: "70000" },

    // Annual Plans (365 days) - Regular Data
    { size: "120GB", serviceType: "etisalat_data", duration: "365 days", price: "110000" },
    { size: "1TB", serviceType: "etisalat_data", duration: "365 days", price: "100000" },
  ],
};