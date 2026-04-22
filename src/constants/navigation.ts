// Primary navigation — single source of truth
// Single product: Vinculum → /product/vinculum

export const NAV_LINKS = [
  { label: 'Home',    href: '/'                  },
  { label: 'Product', href: '/product/vinculum'  },
] as const;

export const FOOTER_NAV = [
  { label: 'Home',    href: '/'                  },
  { label: 'Product', href: '/product/vinculum'  },
  { label: 'Cart',    href: '/cart'              },
  { label: 'Auth',    href: '/auth'              },
] as const;

export const FOOTER_SOCIALS = [
  { label: 'Instagram',   href: 'https://instagram.com' },
  { label: 'LinkedIn',    href: 'https://linkedin.com'  },
  { label: 'X / Twitter', href: 'https://x.com'        },
] as const;

export const FOOTER_EMAIL = [
  { label: 'General', href: 'mailto:contact@cryostasis.com', display: 'contact@cryostasis.com' },
  { label: 'Press',   href: 'mailto:press@cryostasis.com',   display: 'press@cryostasis.com'   },
] as const;

export const PRODUCT_SLUG = 'vinculum' as const;
export const PRODUCT_PATH = `/product/${PRODUCT_SLUG}` as const;
