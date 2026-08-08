/**
 * Turn the phone numbers from Settings into links.
 *
 * Both fields are stored exactly as the client typed them, so the Contact page
 * can display familiar formatting ("+91 98765 43210") while the href gets the
 * stripped-down form each scheme actually requires.
 */

/**
 * `tel:` accepts a leading + and digits; spaces, brackets and dashes are
 * decoration that some diallers choke on.
 */
export const telHref = (value) => {
  const cleaned = String(value || '').replace(/[^\d+]/g, '');
  if (!cleaned.replace(/\+/g, '')) return '';
  // A + is only meaningful at the front.
  return `tel:${cleaned.startsWith('+') ? '+' : ''}${cleaned.replace(/\+/g, '')}`;
};

/**
 * wa.me wants digits only - no +, spaces or dashes - and the country code is
 * mandatory. There is no way to detect a missing country code from the digits
 * alone (an Indian mobile and a full international number are both plausible),
 * so the admin field asks for it explicitly instead of guessing here.
 */
export const whatsappHref = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
};
