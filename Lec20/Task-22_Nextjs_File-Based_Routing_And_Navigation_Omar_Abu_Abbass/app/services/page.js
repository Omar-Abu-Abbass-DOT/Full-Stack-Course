export default function ServicesPage() {
  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with modern frameworks.",
    },
    {
      title: "Mobile Apps",
      description: "Cross-platform mobile applications for iOS and Android.",
    },
    {
      title: "UI/UX Design",
      description: "Beautiful and user-friendly interface designs.",
    },
    {
      title: "SEO Optimization",
      description: "Improve your website visibility on search engines.",
    },
  ];

  return (
    <div>
      <h1>Our Services</h1>
      <p>We offer a wide range of digital services to help your business succeed.</p>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
