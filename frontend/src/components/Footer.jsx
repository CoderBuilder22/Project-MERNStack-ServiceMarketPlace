import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@KHADAMNI.com</p>
          <p>Phone: +216 (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h3>Site Location</h3>
          <p>123 Rades Melian</p>
          <p>Ben arous, Rades 12345</p>
          <p>Tunisia</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p>Facebook | Twitter | LinkedIn</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 ServiceHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
