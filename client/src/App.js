import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Insight_Read from "../src/component/insight/Read";
import Insight_Create from "../src/component/insight/Create";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/insight" element={<Insight_Read/>} />
          <Route exact path="/insight/create" element={<Insight_Create/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;