export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Have a question? Fill out the form below and we will get back to you.</p>
      <div className="contact-form">
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea rows="5" placeholder="Your Message"></textarea>
        <button type="button">Send Message</button>
      </div>
    </div>
  );
}
