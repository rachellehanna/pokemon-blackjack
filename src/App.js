import Header from "./components/Header";
import Footer from "./components/Footer";
import DisplayGame from "./components/DisplayGame";

function App() {
    return (
        <>
            <div className="wrapper">
                <Header />
                <DisplayGame />
            </div>
            <Footer />
        </>
    );
}

export default App;
