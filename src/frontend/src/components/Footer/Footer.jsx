import "./Footer.css";
function Footer() {
  return (
    <>
      <hr />
      <footer>
        <div className="footer-container container text-center">
          <div className="row align-items-start">
            <div className="footer-sitename col-3">
              <h3>Milky Way</h3>
              <img src="/img/logo.jpg" />
            </div>
            <div className="topic-list col-3">
              <h4>Info</h4>
              <ul className="text-start">
                <li>
                  <a href="">
                    <span style={{ color: "#132743" }}>Address: </span>Lot
                    E2a-7, Street D1, D. D1, Long Thanh My, Thu Duc City, Ho Chi
                    Minh 700000
                  </a>
                </li>
                <li>
                  <a href="">
                    <span style={{ color: "#132743" }}>Phone: </span>028 7300
                    5588
                  </a>
                </li>
                <li>
                  <a href="">
                    <span style={{ color: "#132743" }}>Email: </span>
                    milkshopsupport@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="topic-list col-3">
              <h4>Customer Support</h4>
              <ul>
                <li>
                  <a href="/Customer/QRBanking">
                    Regulations & payment methods
                  </a>
                </li>
                <li>
                  <a href="">Warranty & Maintenance</a>
                </li>
                <li>
                  <a href="">Returns & Refunds</a>
                </li>
              </ul>
            </div>

            <div className="topic-list col-3">
              <h4>About Us</h4>
              <ul>
                <li>
                  <a href="#">
                    We are dedicated to providing high-quality milk products for
                    mothers and children, ensuring optimal nutrition at every
                    stage of growth and development.
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
