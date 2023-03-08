import { Route, Routes, Navigate } from 'react-router-dom';
import AppMain from "./pages/AppMain";
import VerifyEmail from "./pages/VerifyEmail";


function App(){
    return(
        <>
            <Routes>
                <Route path={"/"} element={<AppMain/>}/>
                <Route path='verifyemail' element={<VerifyEmail />}>
                    <Route path=':verificationCode' element={<VerifyEmail />} />
                </Route>
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </>
    );
}

export default App;
