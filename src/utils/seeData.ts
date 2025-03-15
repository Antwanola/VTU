import { Data } from '../models/dataPlans';
import { dataList } from '../config/dataList';

export const seedData = async () => {
  for (const [provider, bundles] of Object.entries(dataList)) {
    for (const plan of bundles) {
      const data = new Data({ networkProvider: provider, plan });
      await data.save();
    }
  }
  console.log('Data seeded successfully');
};

seedData().catch((err) => console.error('Error seeding data:', err));