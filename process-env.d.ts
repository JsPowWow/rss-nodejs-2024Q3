declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_SERVICE_PORT: number;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}

export {};
