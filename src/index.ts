import React from 'react';

// import './index.css';

// import * as serviceWorker from './serviceWorker';

import('./App').then(async ({startApplication}) => {
    return startApplication();
})