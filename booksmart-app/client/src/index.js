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
import BestsellersPage from "views/booksmart/Bestsellers"
import InventoryManagerPage from "views/booksmart/librarian/InventoryManager";
import DisplayPlannerPage from "views/booksmart/librarian/DisplayPlanner";
import NotReadBooksPage from "views/booksmart/librarian/NotReadBooks";
import BookBackgroundPage from "views/booksmart/reader/BookBackground";
import GreatBooksPage from "views/booksmart/reader/GreatBooks";
import RecommendationsPage from "views/booksmart/reader/Recommendations";
import FavoritesPage from "views/booksmart/reader/Favorites";
import BorrowingTrendsPage from "views/booksmart/librarian/BorrowingTrends";

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Switch>
                <Route path="/index" render={props => <LandingPage {...props} />} />
                <Route path="/librarian-dashboard" render={props => <LibrarianDashboard/>} />
                <Route path="/reader-dashboard" render={props => <ReaderDashboard/>} />
                <Route path="/inventory-manager" render={props => <InventoryManagerPage/>} />
                <Route path="/display-planner" render={props => <DisplayPlannerPage/>} />
                <Route path="/not-read-books" render={props => <NotReadBooksPage/>} />
                <Route path="/book-background" render={props => <BookBackgroundPage/>} />
                <Route path="/bestsellers" render={props => <BestsellersPage/>} />
                <Route path="/recommendations" render={props => <RecommendationsPage/>} />
                <Route path="/examples" render={props => <Index {...props} />} />
                <Route path="/great-books" render={props => <GreatBooksPage/>} />
                <Route path="/favorites" render={props => <FavoritesPage/>} />
                <Route path="/borrowing-trends" render={props => <BorrowingTrendsPage/>} />
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
