import React from 'react';
import './App.css';
import { JobsChart } from './features/jobsChart/JobsChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <JobsChart />
      </header>
    </div>
  );
}

export default App;
