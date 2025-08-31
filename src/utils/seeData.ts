import { Data } from '../models/dataPlans';
import { dataList } from '../config/dataList';

export const seedData = async () => {
  try {
    for (const [provider, bundles] of Object.entries(dataList)) {
      for (const plan of bundles) {
        const data = new Data({
          networkProvider: provider,
          size: plan.size,
          serviceType: plan.serviceType,
          duration: plan.duration,
          price: plan.price,
        });

        await data.save();
      }
    }

    console.log('✅ Data seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
  }
};

seedData();
