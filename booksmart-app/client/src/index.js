import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles
import "assets/css/bootstrap.min.css";
import "assets/css/now-ui-kit.css";
import "assets/demo/demo.css";

import 'index.css';

import LandingPage from "views/booksmart/LandingPage.js";
import Index from "views/Index.js";
import LibrarianDashboard from "views/booksmart/librarian/LibrarianDashboard"
import ReaderDashboard from "views/booksmart/reader/ReaderDashboard";
import RecommendationsPage from "views/booksmart/reader/Recommendations"
import InventoryManager from "views/booksmart/librarian/InventoryManager";

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Switch>
                <Route path="/index" render={props => <LandingPage {...props} />} />
                <Route path="/librarian-dashboard" render={props => <LibrarianDashboard/>} />
                <Route path="/reader-dashboard" render={props => <ReaderDashboard/>} />
                <Route path="/inventory-manager" render={props => <InventoryManager/>} />
                <Route path="/recommendations" render={props => <RecommendationsPage/>} />
                <Route path="/examples" render={props => <Index {...props} />} />
                <Redirect to="/index" />
                <Redirect from="/" to="/index" />
            </Switch>
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
