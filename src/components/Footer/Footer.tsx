import logoUrl from "../../assets/capitec-logo-black.svg";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    heading: "Get in touch",
    link: "Contact us",
    href: "https://www.capitecbank.co.za/contact-us/",
  },
  {
    heading: "Personal",
    link: "Transact",
    href: "https://www.capitecbank.co.za/personal/transact/",
  },
  {
    heading: "Business",
    link: "Transact",
    href: "https://www.capitecbank.co.za/business/transact/",
  },
  {
    heading: "Rewards",
    link: "Cash back",
    href: "https://www.capitecbank.co.za/rewards/bank-better/",
  },
  {
    heading: "Company",
    link: "About us",
    href: "https://www.capitecbank.co.za/about-us/",
  },
];

export function Footer() {
  const {
    footerBar,
    logo,
    columns,
    heading,
    linkList,
    footerLink,
    disclaimer,
  } = styles;
  return (
    <footer className={footerBar}>
      <img className={logo} src={logoUrl} alt="Capitec" />
      <div className={columns}>
        {COLUMNS.map((column) => (
          <section key={column.heading} aria-label={column.heading}>
            <h2 className={heading}>{column.heading}</h2>
            <ul className={linkList}>
              <li>
                <a className={footerLink} href={column.href}>
                  {column.link}
                </a>
              </li>
            </ul>
          </section>
        ))}
      </div>
      <p className={disclaimer}>
        Note: this a concept personal project. All data is mocked; not
        affiliated with Capitec Bank.
      </p>
    </footer>
  );
}
