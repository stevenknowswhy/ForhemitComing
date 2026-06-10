"use client";

import { teamMembers } from "../../_data/team";

export function TeamSection() {
  return (
    <section className="about-section about-section-team">
      <div className="container">
        <div className="team-header">
          <span className="about-eyebrow">The Team</span>
          <h2>Built by operators, for operators.</h2>
          <p className="team-intro">
            Forhemit combines deep private equity and corporate finance experience with a
            mission-driven focus on long-term stewardship and operational resilience.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => {
            const initials = member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={member.name} className="team-card">
                <div className="team-photo-wrapper">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="team-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div className="team-photo-placeholder" aria-hidden="true">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="team-content">
                  <div className="team-identity">
                    <h3>{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                  </div>
                  {member.bio.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index} className="team-bio">
                    {paragraph.trim()}
                  </p>
                ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
