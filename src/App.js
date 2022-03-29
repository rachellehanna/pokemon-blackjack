import { useState, useEffect } from "react";
import Modal from "react-modal";
import Footer from "./components/Footer";
import DisplayGame from "./components/DisplayGame";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        // When the modal is open hide the scrollbar
        document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    }, [isModalOpen]);

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                className="modal-content"
                ariaHideApp={false}
            >
                <h1>
                    <span className="header-pokemon">Pokemon</span> <br />
                    <span className="header-blackjack">Blackjack</span>
                </h1>

                <div className="welcome">
                    <p>
                        The player with a card total closest to 21 wins, but if
                        you go over 21, you lose. Win the game to evolve your
                        Pokemon!
                    </p>
                    <p>Press play to start.</p>

                    <button
                        id="playButton"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Play
                    </button>
                </div>
            </Modal>

            <div className="wrapper">
                <DisplayGame />
            </div>
            <Footer />
        </>
    );
}

export default App;
