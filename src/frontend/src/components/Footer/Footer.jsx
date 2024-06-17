import './Footer.css'
function Footer() {
  return (
    <>
      <hr />
      <footer>
        <div className="footer-container">
          <div className="footer-sitename">
            <h3>Milk Shop</h3>
            <img src='/img/logo.jpg' />
          </div>
          <div className="footer-topics">

            <div className="topic-list">
              <h4>Address</h4>
              <ul>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
              </ul>
            </div>

            <div className="topic-list">
              <h4>Topic</h4>
              <ul>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
              </ul>
            </div>

            <div className="topic-list">
              <h4>Topic</h4>
              <ul>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
                <li><a href="#">Page</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer
