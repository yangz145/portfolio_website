import { useState } from "react";
import { Col, Row, Alert } from "react-bootstrap";
import emailjs from "@emailjs/browser";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || email.indexOf("@") === -1) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    setMessage("Sending...");

    try {
      // Send confirmation to subscriber
      const subscriberParams = {
        email: email,  // matches {{email}} in your subscriber template
        from_name: "Website Newsletter",
        message: "Thank you for subscribing!",
      };

      const subscriberResult = await emailjs.send(
        "service_meowrpc",      // Service ID
        "template_qlgwnon",     // Template ID for subscriber confirmation
        subscriberParams,
        "5tNzeXaMnu00WaTpi"     // Public Key
      );
      console.log("Subscriber email result:", subscriberResult);

      // Send notification to admin
      const adminParams = {
        firstName: "N/A",       
        lastName: "N/A",
        email: email,           // subscriber email
        phone: "N/A",
        message: "Request a subscription",
      };

      const adminResult = await emailjs.send(
        "service_meowrpc",
        "template_kwg5u18",        // Template ID for admin notification
        adminParams,
        "5tNzeXaMnu00WaTpi"
      );
      console.log("Admin email result:", adminResult);

      // Check if both emails were sent
      if (
        (subscriberResult.status === 200 || subscriberResult.text === "OK") &&
        (adminResult.status === 200 || adminResult.text === "OK")
      ) {
        setStatus("success");
        setMessage("Subscription email sent successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }

    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
      setMessage("Failed to send. Please try again.");
    }
  };

  return (
    <Col lg={12}>
      <div className="newsletter-bx wow slideInUp">
        <Row>
          <Col lg={12} md={6} xl={5}>
            <h3>
              Subscribe to our Newsletter
              <br /> & Never miss latest updates
            </h3>
            {status === "sending" && <Alert>Sending...</Alert>}
            {status === "error" && <Alert variant="danger">{message}</Alert>}
            {status === "success" && <Alert variant="success">{message}</Alert>}
          </Col>
          <Col md={6} xl={7}>
            <form onSubmit={handleSubmit}>
              <div className="new-email-bx">
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
                <button type="submit">Submit</button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </Col>
  );
};
