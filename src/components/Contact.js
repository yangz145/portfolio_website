import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../assets/img/cute-capybara.svg";
import "animate.css";
import TrackVisibility from "react-on-screen";
import emailjs from "@emailjs/browser";

export const Contact = () => {
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState("Send");
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Sending...");

    try {
      // 1️⃣ Send automatic reply to user
      const userResult = await emailjs.send(
        "service_meowrpc",        // EmailJS Service ID
        "template_qlgwnon",     // Template ID for automatic reply to user
        formDetails,
        "5tNzeXaMnu00WaTpi"       // EmailJS Public Key
      );
      console.log("User reply result:", userResult);

      // 2️⃣ Send contact details to your email
      const adminResult = await emailjs.send(
        "service_meowrpc",         // Same Service ID
        "template_kwg5u18",    // Template ID for sending to you
        formDetails,
        "5tNzeXaMnu00WaTpi"       // Same Public Key
      );
      console.log("Admin email result:", adminResult);

      // Check if either send was successful
      if (
        (userResult.status === 200 || userResult.text === "OK" || userResult.success) &&
        (adminResult.status === 200 || adminResult.text === "OK" || adminResult.success)
      ) {
        setStatus({ success: true, message: "Message sent successfully!" });
        setFormDetails(formInitialDetails);
      } else {
        setStatus({ success: false, message: "Something went wrong, try again." });
      }

    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus({ success: false, message: "Failed to send. Please try again." });
    }

    setButtonText("Send");
  };


  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={isVisible ? "animate__animated animate__zoomIn" : ""}
                  src={contactImg}
                  alt="Contact Us"
                />
              )}
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2>Get In Touch</h2>
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="text"
                          name="firstName"
                          value={formDetails.firstName}
                          placeholder="First Name"
                          onChange={(e) => onFormUpdate("firstName", e.target.value)}
                          required
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="text"
                          name="lastName"
                          value={formDetails.lastName}
                          placeholder="Last Name"
                          onChange={(e) => onFormUpdate("lastName", e.target.value)}
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="email"
                          name="email"
                          value={formDetails.email}
                          placeholder="Email Address"
                          onChange={(e) => onFormUpdate("email", e.target.value)}
                          required
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="tel"
                          name="phone"
                          value={formDetails.phone}
                          placeholder="Phone No."
                          onChange={(e) => onFormUpdate("phone", e.target.value)}
                        />
                      </Col>
                      <Col size={12} className="px-1">
                        <textarea
                          name="message"
                          rows="6"
                          value={formDetails.message}
                          placeholder="Message"
                          onChange={(e) => onFormUpdate("message", e.target.value)}
                          required
                        ></textarea>
                        <button type="submit">
                          <span>{buttonText}</span>
                        </button>
                      </Col>
                      {status.message && (
                        <Col>
                          <p className={status.success === false ? "danger" : "success"}>
                            {status.message}
                          </p>
                        </Col>
                      )}
                    </Row>
                  </form>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

