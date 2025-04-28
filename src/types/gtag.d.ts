interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    config?: {
      page_path?: string;
      [key: string]: string | number | boolean | undefined;
    }
  ) => void;
  dataLayer: Array<Record<string, unknown>>;
} 