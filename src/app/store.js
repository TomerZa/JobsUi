import { configureStore } from '@reduxjs/toolkit';
import jobsChartReducer from '../features/jobsChart/jobsChartSlice';

export const store = configureStore({
  reducer: {
    jobsChart: jobsChartReducer,
  },
});
