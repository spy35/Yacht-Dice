import { HashRouter } from 'react-router-dom'; // BrowserRouter 대신 HashRouter 사용
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Content from './layout/Content';

function App() {
    return (
        <HashRouter>
            <Content /> {/* Content 컴포넌트 렌더링 */}
        </HashRouter>
    );
}

export default App;