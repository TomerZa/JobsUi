import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { format } from "date-fns";

const JOBS_URL = "http://localhost:5032/Jobs";

const initialState = {
  isLoading: false,
  data: [],
  error: "",
  options: {
    title: "Cumulative job view vs. prediction",
    vAxis: { title: "Job views" },
    hAxis: { title: "Month" },
    seriesType: "line",
    compareMode: true,
    aggregationTarget: "Job views",
    responsive: true,
    series: {
      0: { type: "bars", color: "#A0A0A0" },
      1: { color: "#3399FF", pointShape: "circle" },
      2: {
        color: "#00CC00",
        fillColor: "#FFFFFF",
        lineDashStyle: [4, 1],
        pointShape: "circle",
      },
    },
    legend: { position: "bottom" },
  },
};

export const getJobsAsync = createAsyncThunk(
  "jobsChart/fetchData",
  async (payload) => {
    try {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
      };
      const url = `${JOBS_URL}?startDate=${payload.startDate}&endDate=${payload.endDate}`;
      const response = await axios.get(url, config);

      return [...response.data];
    } catch (err) {
      return err.message;
    }
  }
);

export const jobsChartSlice = createSlice({
  name: "jobsChart",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getJobsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [];

        if (action.payload.length) {
          const dataArray = [
            ["Month", "Active Jobs", "Predicted job views", "Job views"],
          ];

          action.payload.map((row) =>
            dataArray.push([
              format(new Date(row.jobDate), "LLLL d"),
              row.activeJobs,
              row.predictedJobViews,
              row.jobViews,
            ])
          );
          state.data = dataArray;
        }
        state.error = "";
      })
      .addCase(getJobsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default jobsChartSlice.reducer;
