import { useEffect, useState } from 'react';

export interface PublicSettings {
  businessName: string;
  phone: string;
  email: string;
  location: string;
  hoursMonFri: string;
  hoursSat: string;
  budgetFilmPrice: number;
  premiumFilmPrice: number;
  smsAlertNumber: string;
  autoReplyCustomerEmail: boolean;
  facebookLink: string;
  instagramLink: string;
  whatsappLink: string;
  tiktokLink: string;
  heatRejectionPercentage: number | null;
  googleReviewCount: number;
}

const DEFAULT_SETTINGS: PublicSettings = {
  businessName: 'Weipa Tint',
  phone: '0498 367 791',
  email: 'weipatint@gmail.com',
  location: 'Weipa, QLD 4874',
  hoursMonFri: '8:00 am – 4:30 pm',
  hoursSat: 'By appointment',
  budgetFilmPrice: 420,
  premiumFilmPrice: 550,
  smsAlertNumber: '0498 367 791',
  autoReplyCustomerEmail: true,
  facebookLink: 'https://facebook.com',
  instagramLink: 'https://instagram.com',
  whatsappLink: 'https://wa.me/61498367791',
  tiktokLink: 'https://tiktok.com',
  heatRejectionPercentage: null,
  googleReviewCount: 22,
};

export function useSettings(): PublicSettings {
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object' && !data.error) {
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        }
      })
      .catch(console.error);
  }, []);

  return settings;
}
