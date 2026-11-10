// English texts. Keep the structure identical to fa.js. Words wrapped in asterisks (*like this*) are shown in the accent color.
export default {
  brand: 'Haft Studio',
  numerals: '0123456789',
  intl: 'en-US',
  meta: {
    title: 'Haft Studio | Web Design, Video & Advertising',
    description:
      'Haft Studio: website design, Instagram video and reels, content and page management, and advertising campaign design.',
    ogLocale: 'en_US',
  },
  ui: {
    skip: 'Skip to content',
    switchLang: 'Switch language to Persian',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
  },
  nav: {
    label: 'Main menu',
    links: ['Services', 'Work', 'Process', 'Team'],
    cta: 'Start a project',
    open: 'Open menu',
    close: 'Close menu',
  },
  hero: {
    pill: 'Advertising & content studio · Newly founded',
    title: 'Advertising that *gets* *seen,* not just made.',
    text: 'Haft Studio is a young advertising team. We design websites for companies, produce Instagram videos, and make their brands stand out on social media.',
    cta1: 'Tell us about your project',
    cta2: 'View services',
    scroll: 'Scroll',
  },
  marquee: ['Web design', 'Instagram video', 'Page management', 'Ad campaigns'],
  services: {
    eyebrow: '01 — Services',
    title: 'Everything you need to be seen, in one place.',
    items: [
      { title: 'Web design', text: 'Fast, mobile-friendly company sites and landing pages that match your brand identity.' },
      {
        title: 'Instagram video & reels',
        text: 'Idea, filming, editing and motion graphics: videos that get watched to the very last second.',
      },
      {
        title: 'Content & page management',
        text: 'Content calendar, post and story design, and regular production for your brand’s social media.',
      },
      {
        title: 'Campaigns & advertising',
        text: 'Campaign design and advertising creative to introduce your product and win new customers.',
      },
    ],
  },
  work: {
    eyebrow: '02 — Work',
    title: 'Work that speaks for itself.',
    sub: 'The first Haft Studio projects will be published here.',
    empty: 'Our portfolio will be added here soon.',
    projects: [
      { tag: 'Web design', title: '[Project one name]', hint: 'Space for a sample image or video' },
      { tag: 'Instagram reels', title: '[Project two name]', hint: 'Space for a sample' },
      { tag: 'Ad campaign', title: '[Project three name]', hint: 'Space for a sample' },
      { tag: 'Page management', title: '[Project four name]', hint: 'Space for a sample image or video' },
    ],
  },
  process: {
    eyebrow: '03 — Process',
    title: 'From the first conversation to launch, in four steps.',
    steps: [
      { title: 'Conversation & discovery', text: 'We get to know your brand, audience and goal so the path becomes clear.' },
      {
        title: 'Idea & strategy',
        text: 'We finalize the creative idea and the execution plan together before production starts.',
      },
      {
        title: 'Design & production',
        text: 'The website, video and content are made, and we ask for your feedback at every stage.',
      },
      {
        title: 'Launch & growth',
        text: 'We publish the work and measure the result so the next step is even better.',
      },
    ],
  },
  manifesto: 'We have only just begun; for us, every project is the *most* *important* *project* *of* *the* *year.*',
  team: {
    eyebrow: '04 — Team',
    title: 'The people behind Haft Studio.',
    members: [
      { name: 'Person One', role: 'Works in the team' },
      { name: 'Person Two', role: 'Works in the team' },
    ],
  },
  contact: {
    eyebrow: '05 — Contact',
    title: 'Tell us about your project.',
    sub: 'Write a few lines about your business and your goal. We will get in touch with you soon.',
    name: 'Your name and company name',
    phone: 'Phone number',
    service: 'Which service do you need?',
    message: 'Tell us about the project',
    submit: 'Send request',
    sending: 'Sending…',
    serviceOptions: [
      'Web design',
      'Instagram video & reels',
      'Content & page management',
      'Campaigns & advertising',
      'Several services together',
    ],
    errors: {
      nameRequired: 'Please enter your name and company name.',
      phoneRequired: 'Please enter your phone number.',
      phoneInvalid: 'The phone number is not valid. Enter digits only.',
      offline: 'You are not connected to the internet. Check your connection and try again.',
      network:
        'Could not reach the server. Try again in a moment, or contact us directly using the phone number and email above.',
      failed: 'Sending failed. Try again, or contact us directly using the phone number and email above.',
    },
    sent: 'Your message has been sent. We will get in touch with you soon.',
  },
  footer: {
    rights: '© {year} · All rights reserved.',
    fallbackYear: '2026',
  },
};
