import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main>
                    <AppRoutes />
                </main>
                <footer>LearnHub · Student project</footer>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;