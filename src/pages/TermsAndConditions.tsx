import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, User, CreditCard, CheckCircle, Server, AlertTriangle, RefreshCw, Mail, ArrowLeft, Scale } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      "By creating an account or using PetVault, you agree to these terms. If you don't agree, that's okay — but please don't use the service.",
      "We may update these terms from time to time. We'll always notify you of significant changes via email or in-app notification.",
    ],
  },
  {
    icon: User,
    title: "Use of Service",
    content: [
      "PetVault is designed to help you track and manage your pet's health records. Please use it for its intended purpose.",
      "You agree not to misuse the service, attempt to access other users' data, or use automated tools to scrape content.",
    ],
  },
  {
    icon: CheckCircle,
    title: "Account Responsibility",
    content: [
      "You're responsible for keeping your login credentials secure. If you suspect unauthorized access, let us know immediately.",
      "You must be at least 16 years old to create an account. If you're under 18, please have a parent or guardian review these terms.",
    ],
  },
  {
    icon: CreditCard,
    title: "Subscription & Billing",
    content: [
      "PetVault offers free and premium plans. Premium features are clearly marked and require a paid subscription.",
      "You can cancel your subscription at any time. Your access continues until the end of your current billing period.",
      "Refunds are handled on a case-by-case basis. Just reach out to us and we'll do our best to help.",
    ],
  },
  {
    icon: Scale,
    title: "Data Accuracy",
    content: [
      "You're responsible for the accuracy of the information you add to PetVault. We store what you provide but don't verify medical records.",
      "PetVault is not a substitute for professional veterinary advice. Always consult your vet for medical decisions.",
    ],
  },
  {
    icon: Server,
    title: "Service Availability",
    content: [
      "We work hard to keep PetVault running 24/7, but occasional downtime for maintenance or updates may occur.",
      "We'll give advance notice for planned maintenance whenever possible.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      "PetVault is provided \"as is.\" While we strive for reliability, we can't guarantee the service will be error-free at all times.",
      "We are not liable for any decisions made based on data stored in PetVault. Always verify important health information with your veterinarian.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes to Terms",
    content: [
      "We may revise these terms as PetVault grows. Material changes will be communicated at least 30 days before taking effect.",
      "Continued use of PetVault after changes take effect means you accept the updated terms.",
    ],
  },
  {
    icon: Mail,
    title: "Contact Information",
    content: [
      "Questions about these terms? Email us at hello@petvault.com.",
      "We're real people who care about your experience — don't hesitate to reach out.",
    ],
  },
];

const TermsAndConditions = () => {
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
            <h1 className="text-hero text-foreground mb-3">Terms & Conditions</h1>
            <p className="text-body text-muted-foreground mb-2">
              Last updated: February 2026
            </p>
            <div className="h-px bg-border my-8" />

            <p className="text-body text-muted-foreground mb-10">
              Welcome to PetVault. These terms are written in simple, human-friendly language because we believe transparency builds trust. Here's what you need to know.
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

export default TermsAndConditions;
