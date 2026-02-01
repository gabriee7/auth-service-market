import schemas from './components/schemas.js';
import { authPaths } from './views/paths.js';

const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Microservice Market API',
    version: '1.0.0',
    description: 'API Microservices para autenticação de usuários no Market'
  },
  components: { schemas },
  paths: authPaths
};

export default openapi;