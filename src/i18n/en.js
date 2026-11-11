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
    title: "Advertising that *gets* *seen,* not just made.",
    text: "Haft Studio is a young advertising team. We design websites for companies, produce Instagram videos, and make their brands stand out on social media.",
    cta1: "Tell us about your project",
    cta2: "View services",
    scroll: "Scroll",
  },
  marquee: localize(marquee, "en"), // src/database.js (جدول marquee)
  services: {
    eyebrow: "01 — Services",
    title: "Everything you need to be seen, in one place.",
    items: localize(services, "en"), // src/database.js (جدول services)
  },
  work: {
    eyebrow: "02 — Work",
    title: "Work that speaks for itself.",
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
    title: "From the first conversation to launch, in four steps.",
    steps: localize(processSteps, "en"), // src/database.js (جدول processSteps)
  },
  manifesto:
    "We have only just begun; for us, every project is the *most* *important* *project* *of* *the* *year.*",
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
      "more...",
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
  footer: {
    rights: "© {year} · All rights reserved.",
    fallbackYear: "2026",
  },
};
