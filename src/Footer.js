//Footer.js

const Footer = () => {
  return (
    <footer>
      <p>
        Built by{` `}
        <a
          href="https://github.com/allisonvilla"
          target="_blank"
          rel="noreferrer"
        >
          Allison Villa
        </a>
        ,{' '}
        <a
          href="https://github.com/ish-codes/"
          target="_blank"
          rel="noreferrer"
        >
          Ishween Sehmbhi
        </a>
        ,{' '}
        <a
          href="https://github.com/shradhaMe"
          target="_blank"
          rel="noreferrer"
        >
          Shradha Mehta
        </a>
        , and{' '}
        <a
          href="https://github.com/rachellehanna"
          target="_blank"
          rel="noreferrer"
        >
          Rachelle Hanna
        </a>
      </p>

      <p className="small-copy">
        Powered by{' '}
        <a
          href="https://pokeapi.co/docs/v2"
          target="_blank"
          rel="noreferrer"
        >
          Poke API
        </a>{' '}
        and{' '}
        <a
          href="https://deckofcardsapi.com/"
          target="_blank"
          rel="noreferrer"
        >
          Deck of Cards API
        </a>
        &nbsp;
        Created at{` `}
        <a
          href="https://junocollege.com/"
          target="_blank"
          rel="noreferrer"
        >
          Juno College of Technology
        </a>
      </p>
    </footer>
  );
}


export default Footer;