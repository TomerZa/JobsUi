import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import { getJobsAsync } from "./jobsChartSlice";
import { DateRange } from "react-date-range";
import { subDays, format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export function JobsChart() {
  const serverDateFormat = "yyyy-MM-dd";
  const dispatch = useDispatch();
  const [state, setState] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const jobsChartData = useSelector((state) => state.jobsChart);
  const test = useSelector((state) => state);
  console.log(state);
  
  useEffect(() => {
    dispatch(getJobsAsync({ startDate: format(state[0].startDate, serverDateFormat), endDate: format(state[0].endDate, serverDateFormat) }));
  });

  if (jobsChartData.isLoading) {
    return <div>Loading...</div>;
  }

  if (!jobsChartData.isLoading && jobsChartData.error) {
    return <div>Error: {jobsChartData.error}</div>;
  }

  if (!jobsChartData.isLoading) {
    return (
      <div>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => {
            setState([item.selection]);
            if (item.selection.startDate !== item.selection.endDate) {
              dispatch(
                getJobsAsync({
                  startDate: format(item.selection.startDate, serverDateFormat),
                  endDate: format(item.selection.endDate, serverDateFormat),
                })
              );
            }
          }}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
        {jobsChartData.data.length && (
          <Chart
            chartType="ComboChart"
            width="100%"
            height="450px"
            data={jobsChartData.data}
            options={jobsChartData.options}
          />
        )}
        {jobsChartData.data.length === 0 && <div>No data found.</div>}
      </div>
    );
  }
}
