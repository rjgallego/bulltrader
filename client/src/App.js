import './App.css';
import {Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard'
import StockSummary from './pages/StockSummary/StockSummary'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Home}/>
        <Route path="/register" component={Register}/>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/stock-summary/:symbol" component={StockSummary} />
      </BrowserRouter>
    </div>
  );
}

export default App;
