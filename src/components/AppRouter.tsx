import React from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import PublicRoutes from "../router/PublicRoutes";

const AppRouter = () => {
    return (
        <Routes>
            {PublicRoutes.map((route, index) => (
                <Route path={route.path} element={route.component} key={index}></Route>
            ))}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
};

export default AppRouter;
