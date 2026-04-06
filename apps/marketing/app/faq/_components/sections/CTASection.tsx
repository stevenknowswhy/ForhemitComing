"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="about-section faq-cta-section">
      <div className="container">
        <Card className="faq-cta-card">
          <CardContent className="faq-cta-card-content">
            <div className="faq-cta-icon">
              <MessageCircle size={32} strokeWidth={1.5} />
            </div>
            <h2>Still have questions?</h2>
            <p>
              We&apos;re here to help. Reach out and our team will get back to you with answers
              tailored to your specific situation.
            </p>
            <Button asChild size="lg" className="faq-cta-button">
              <Link href="/introduction">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
