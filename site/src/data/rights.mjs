// Copyright and usage terms for every photo on the site. tools/copyright.mjs writes them into the
// image files themselves (EXIF + the XMP/IPTC fields Google Images shows as Creator, Credit and
// Copyright), and /photo-copyright/ states them in words — the files' "Web Statement of Rights".
import { BUSINESS as B, SITE_URL } from './business.mjs';

export const RIGHTS = {
  creator: B.photographer,
  owner: B.name,
  notice: `© ${B.name}. All rights reserved.`,
  exifNotice: `Copyright ${B.name}. All rights reserved.`, // EXIF text is ASCII-only
  terms: `All rights reserved. No copying, editing, sharing or other use without written permission from ${B.name} (${B.email}).`,
  path: '/photo-copyright/',
  url: `${SITE_URL}/photo-copyright/`,
  contact: {
    url: `${SITE_URL}/`,
    email: B.email,
    phone: '+1 409-354-3075',
    city: B.locality,
    region: B.regionName,
    country: 'United States',
  },
};
