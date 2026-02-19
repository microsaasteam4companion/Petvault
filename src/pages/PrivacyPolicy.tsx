import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Database, Lock, Share2, Cookie, UserCheck, Mail, ArrowLeft } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Information We Collect",
    content: [
      "We collect only the information you choose to add about your pets — names, breeds, health records, vet visits, and photos.",
      "We also collect basic account information like your name and email address when you sign up.",
      "We do not collect data from your device beyond what's needed to run the app smoothly.",
    ],
  },
  {
    icon: Database,
    title: "How We Use It",
    content: [
      "Your data is used to power your pet's health timeline, generate reminders, and provide insights about your pet's wellness journey.",
      "We never sell your data to advertisers or third-party marketers.",
      "Anonymous, aggregated data may be used to improve our service and features.",
    ],
  },
  {
    icon: Lock,
    title: "Data Storage & Security",
    content: [
      "All data is encrypted at rest and in transit using industry-standard AES-256 encryption.",
      "Our servers are hosted in secure, SOC 2-compliant data centers.",
      "We perform regular security audits and vulnerability assessments to keep your data safe.",
    ],
  },
  {
    icon: Share2,
    title: "Sharing With Vets",
    content: [
      "You can choose to share your pet's timeline with your veterinarian. This is always opt-in and under your control.",
      "Shared data is read-only — your vet can view but never modify your records.",
      "You can revoke access at any time from your account settings.",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: [
      "We use essential cookies to keep you logged in and remember your preferences.",
      "We use analytics cookies to understand how people use PetVault so we can make it better.",
      "You can manage cookie preferences in your browser settings at any time.",
    ],
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: [
      "You can export all your data at any time in a standard format.",
      "You can request deletion of your account and all associated data.",
      "You have the right to access, correct, or restrict processing of your personal information.",
    ],
  },
  {
    icon: Mail,
    title: "Contact Information",
    content: [
      "If you have questions about this policy, reach out to us at hello@petvault.com.",
      "We aim to respond to all privacy-related inquiries within 48 hours.",
      "Our data protection team is always happy to help clarify how we handle your information.",
    ],
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-poppins">
      <div className="section-padding">
        <div className="max-w-[900px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-small text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-card rounded-card-lg shadow-card border border-border p-8 md:p-12">
            <h1 className="text-hero text-foreground mb-3">Privacy Policy</h1>
            <p className="text-body text-muted-foreground mb-2">
              Last updated: February 2026
            </p>
            <div className="h-px bg-border my-8" />

            <p className="text-body text-muted-foreground mb-10">
              At PetVault, your trust matters more than anything. This policy explains — in plain language — what data we collect, how we use it, and how we protect it. No legal jargon, just honesty.
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-card-title text-foreground">{section.title}</h2>
                  </div>
                  <div className="space-y-3 pl-[52px]">
                    {section.content.map((paragraph, i) => (
                      <p key={i} className="text-body text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
