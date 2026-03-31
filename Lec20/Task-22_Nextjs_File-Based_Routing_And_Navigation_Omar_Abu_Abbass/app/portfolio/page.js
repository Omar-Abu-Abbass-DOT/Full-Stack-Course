// Task B: 5th page (additional page for multi-page requirement)
export default function PortfolioPage() {
  const projects = [
    { name: "E-Commerce Store", tech: "Next.js, Stripe, MongoDB" },
    { name: "Social Media App", tech: "React, Node.js, Socket.io" },
    { name: "Task Manager", tech: "Next.js, Prisma, PostgreSQL" },
  ];

  return (
    <div>
      <h1>Our Portfolio</h1>
      <p>Check out some of our recent projects.</p>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div key={project.name} className="portfolio-card">
            <h3>{project.name}</h3>
            <p>{project.tech}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
