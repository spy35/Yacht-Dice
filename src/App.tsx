// src/App.tsx
import { BrowserRouter } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Content from './layout/Content';

function App() {
    return (
        <BrowserRouter>
            <Content /> {/* Content 컴포넌트 랜더랑*/}
        </BrowserRouter>
    );
}

export default App;