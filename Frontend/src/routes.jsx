import { createElement } from 'react';

// import every jsx file in a folder
const pages = import.meta.glob('./pages/*.jsx', { eager: true });

// build the routes based on the info in each pages component
const routes = Object.values(pages)
    .map(x => x.default)
    .map(x => ({ ...x.route, element: createElement(x) }))
    .sort((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity));

export default routes;