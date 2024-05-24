import ReactDOMServer from 'react-dom/server';

import App from './components/App';

const app = ReactDOMServer.renderToString(<App/>)
