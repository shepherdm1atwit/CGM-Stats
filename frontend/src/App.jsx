/**
 * @file App.jsx
 * @brief Main application component defining the routes.
 */
import {Route, Routes, Navigate} from 'react-router-dom';
import AppMain from "./pages/AppMain";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import VerifyDexcom from "./pages/VerifyDexcom";

/**
 * @function App
 * @brief The main application component.
 *
 * This function defines the routing paths for the application. It specifies
 * the main components responsible for handling different URL paths.
 *
 * @return The JSX code for the application's routes.
 */
function App() {
    return (
        <>
            <Routes>
                <Route path={"/"} element={<AppMain/>}/>
                <Route path='verifyemail' element={<VerifyEmail/>}>
                    <Route path=':verificationCode' element={<VerifyEmail/>}/>
                </Route>
                <Route path='resetpassword' element={<ResetPassword/>}>
                    <Route path=':resetCode' element={<ResetPassword/>}/>
                </Route>
                <Route path='verifydexcom' element={<VerifyDexcom/>}></Route>
                <Route path='*' element={<Navigate to='/'/>}/>
            </Routes>
        </>
    );
}

export default App;
