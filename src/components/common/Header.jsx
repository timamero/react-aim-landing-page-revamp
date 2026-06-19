import { useState, useEffect, useRef, useCallback } from "react";
import Button from "./Button";
import { navLinks, headerCta } from "../../data/navigation";
import { initHeaderLoadAnimations } from "../../utils/headerAnimations";
import logoIcon from "../../assets/icons/logo.svg";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navListRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    const navItems = navListRef.current?.querySelectorAll(".header__nav-item");
    return initHeaderLoadAnimations(navItems);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const handleNavClick = () => {
    closeMenu();
  };

  return (
    <header
      className={`header${isScrolled ? " header--scrolled" : ""}${menuOpen ? " header--menu-open" : ""}`}
    >
      <div className="header__inner container">
        <a href="#hero" className="header__logo">
          <img
            src={logoIcon}
            alt=""
            className="header__logo-icon"
            width={32}
            height={32}
            decoding="async"
          />
          <span className="header__logo-text">Aim</span>
        </a>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="header-nav"
          onClick={toggleMenu}
        >
          <span className="header__menu-icon" aria-hidden="true" />
        </button>

        <nav
          id="header-nav"
          className={`header__nav${menuOpen ? " header__nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <ul className="header__nav-list" ref={navListRef}>
            {navLinks.map((link) => (
              <li key={link.href} className="header__nav-item">
                <a
                  href={link.href}
                  className="header__nav-link"
                  onClick={handleNavClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="header__cta">
            <Button
              variant="primary"
              size="medium"
              type="button"
              disabled={headerCta.disabled}
            >
              {headerCta.label}
            </Button>
          </div>
        </nav>
      </div>

      <button
        type="button"
        className={`header__overlay${menuOpen ? " header__overlay--visible" : ""}`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </header>
  );
}

export default Header;
