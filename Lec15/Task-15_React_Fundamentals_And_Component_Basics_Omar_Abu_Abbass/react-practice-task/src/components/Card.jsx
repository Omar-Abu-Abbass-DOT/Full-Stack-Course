const Card = (props) => {
  const handleClick = () => {
    console.log(`You clicked on the ${props.title} card!`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={props.image} alt={props.title} className="card-image" />
      <div className="card-content">
        <h3>{props.title}</h3>
      </div>
    </div>
  );
};

export default Card;