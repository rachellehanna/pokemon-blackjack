const Hand = ({ cards }) => {
    return (
        <div className="current-hand">
            {cards.map((card) => {
                return <img key={card.code} src={card.image} alt={card.code} />;
            })}
        </div>
    );
};

export default Hand;
