import './App.css';
import {Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Home}/>
        <Route path="/register" component={Register}/>
        <Route path="/dashboard" component={Dashboard} />
      </BrowserRouter>
    </div>
  );
}

export default App;
