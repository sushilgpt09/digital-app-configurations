import { useState, useEffect } from 'react';
import { appLanguagesApi } from '../api/appLanguages.api';

export interface LangOption {
  code: string;
  label: string;
}

const FALLBACK_LANGS: LangOption[] = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'Khmer' },
];

export function useAppLanguages(): LangOption[] {
  const [langs, setLangs] = useState<LangOption[]>(FALLBACK_LANGS);

  useEffect(() => {
    appLanguagesApi.getAll({ page: 0, size: 100 })
      .then(res => {
        const content = res.data.data?.content || [];
        const active = content.filter(l => l.status === 'ACTIVE');
        if (active.length > 0) {
          setLangs(active.map(l => ({ code: l.code, label: l.name })));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  return langs;
}
