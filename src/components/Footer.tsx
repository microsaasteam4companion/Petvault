import { Link } from "react-router-dom";
import { SocialIcons } from "./CommunitySection";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        {/* Community Block */}
        <div className="border-b border-primary-foreground/10 pb-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <h4 className="font-poppins font-semibold text-primary-foreground text-sm whitespace-nowrap">
              Join the Community
            </h4>
            <div className="w-full sm:w-auto">
              <SubscribeForm variant="footer" />
            </div>
          </div>
          <SocialIcons compact />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="mb-4">
              <span className="font-poppins font-bold text-lg text-primary-foreground">PetVault</span>
            </div>
            <p className="text-sm text-primary-foreground/60">
              The complete pet health timeline vault. Organize, track, and share your pet's wellness journey.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2">
              {["Home", "Features", "Pricing", "FAQ"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">© 2026 PetVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
