import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card text-card-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">{t('footer.logoName')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          <nav className="flex space-x-4 mb-4 md:mb-0">
            <Link to="/about" className="hover:text-primary transition-colors">
              {t('footer.about')}
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary transition-colors"
            >
              {t('footer.contact')}
            </Link>
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              {t('footer.privacyPolicy')}
            </Link>
          </nav>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;