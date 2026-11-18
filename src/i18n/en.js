// English texts. Keep the structure identical to fa.js. Words wrapped in asterisks (*like this*) are shown in the accent color.
import {
  marquee,
  processSteps,
  projects,
  services,
  team,
} from "../database.js";
import { localize } from "./localizeData.js";

export default {
  brand: "Haft Studio",
  numerals: "0123456789",
  intl: "en-US",
  listSeparator: ", ",
  meta: {
    title: "Haft Studio | Web Design, Video & Advertising",
    description:
      "Haft Studio: website design, Instagram video and reels, content and page management, and advertising campaign design.",
    ogLocale: "en_US",
  },
  ui: {
    skip: "Skip to content",
    switchLang: "Switch language to Persian",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
  },
  nav: {
    label: "Main menu",
    links: ["Services", "Work", "Process", "Team"],
    cta: "Start a project",
    open: "Open menu",
    close: "Close menu",
  },
  hero: {
    pill: "Advertising & content studio · Newly founded",
    title: "We make your brand *worth* *watching.*",
    text: "Haft Studio is a young advertising team. We design websites, shoot Instagram videos and run social media pages for companies.",
    cta1: "Tell us about your project",
    cta2: "View services",
    scroll: "Scroll",
  },
  marquee: localize(marquee, "en"), // src/database.js (جدول marquee)
  services: {
    eyebrow: "01 — Services",
    title: "Website, video, social media and campaigns, all with one team.",
    items: localize(services, "en"), // src/database.js (جدول services)
  },
  work: {
    eyebrow: "02 — Work",
    title: "What we’ve built so far.",
    sub: "The first Haft Studio projects will be published here.",
    empty: "Our portfolio will be added here soon.",
    viewAll: "View all projects",
    open: "View project details",
    // Projects live in src/database.js (table: projects)
    projects: localize(projects, "en"),
  },
  worksPage: {
    eyebrow: "Work",
    title: "All of our work",
    sub: "The projects we have built. Open any of them to see the details.",
    all: "All",
    filterLabel: "Filter by category",
  },
  projectPage: {
    back: "All projects",
    client: "Client",
    year: "Year",
    services: "Services",
    results: "Results",
    visit: "Visit the project",
    gallery: "Project images",
    more: "More projects",
    prev: "Previous project",
    next: "Next project",
    cta: "Have a project in mind?",
    ctaText: "Tell us about it and let’s build the idea together.",
    notFoundTitle: "Project not found",
    notFoundText:
      "The address may be wrong, or the project may have been removed.",
  },
  process: {
    eyebrow: "03 — Process",
    title: "How a project works with us.",
    steps: localize(processSteps, "en"), // src/database.js (جدول processSteps)
  },
  manifesto:
    "We’re just getting started, so we treat every project like our *very* *first.*",
  team: {
    eyebrow: "04 — Team",
    title: "The people behind Haft Studio.",
    // src/database.js (جدول team)
    members: localize(team, "en"),
  },
  contact: {
    eyebrow: "05 — Contact",
    title: "Tell us about your project.",
    sub: "Write a few lines about your business and your goal. We will get in touch with you soon.",
    name: "Your name and company name",
    phone: "Phone number",
    service: "Which service do you need?",
    message: "Tell us about the project",
    submit: "Send request",
    sending: "Sending…",
    serviceOptions: [
      "Web design",
      "Instagram video & reels",
      "Content & page management",
      "Campaigns & advertising",
      "Several services together",
      "Other services",
    ],
    errors: {
      nameRequired: "Please enter your name and company name.",
      phoneRequired: "Please enter your phone number.",
      phoneInvalid: "The phone number is not valid. Enter digits only.",
      offline:
        "You are not connected to the internet. Check your connection and try again.",
      network:
        "Could not reach the server. Try again in a moment, or contact us directly using the phone number and email above.",
      failed:
        "Sending failed. Try again, or contact us directly using the phone number and email above.",
    },
    sent: "Your message has been sent. We will get in touch with you soon.",
  },
  privacy: {
    eyebrow: "Privacy",
    title: "What we do with your information.",
    sub: "A short, plain explanation of what we collect, why we collect it, and who sees it.",
    updated: "Last updated: November 2026",
    sections: [
      {
        title: "What we collect",
        text: [
          "Only what you type into the contact form: your name and company, phone number, the service you’re interested in, and a few lines about your project. We don’t ask for accounts, passwords or payment details.",
        ],
      },
      {
        title: "How we use it",
        text: [
          "Only to get back to you and talk about your project. We don’t sell your number, and we don’t use it for marketing.",
        ],
      },
      {
        title: "Where your message goes",
        text: [
          "The contact form runs on a service called Web3Forms, which delivers your message to our team’s email. That means the service handles your message on its way to us. Beyond that, we don’t share your information with anyone, unless the law requires us to.",
        ],
      },
      {
        title: "Cookies and tracking",
        text: [
          "Our site doesn’t set cookies and has no analytics or advertising tools. The only thing saved in your browser is your light or dark mode choice, so the site looks the way you left it. Fonts load from our own site, not from outside services.",
          "Like any website, our hosting server may keep ordinary technical records, such as your IP address and the time of your visit, for security and troubleshooting.",
        ],
      },
      {
        title: "How long we keep it",
        text: [
          "For as long as we need it to reply to you and work on your project. You can ask us at any time to send you what we have, correct it, or delete it.",
        ],
      },
      {
        title: "Questions?",
        text: [
          "Ask us anything about your information. If this page changes, it will be updated here.",
        ],
      },
    ],
    contactCta: "Email us",
  },
  footer: {
    privacy: "Privacy",
    rights: "© {year} · All rights reserved.",
    fallbackYear: "2026",
  },
};
