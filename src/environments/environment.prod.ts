export const environment = {
  production: true,
  apiUrl: 'http://localhost:8000',
  identityServer: 'http://localhost:5000',
  oDataBaseUrl: 'http://localhost:8000/odata',
  jsonSchemaUrl: 'http://localhost:8000/api/jsonschema',
  // 可以自动上传token的url
  oauthSendTokenUrl: ['http://localhost:8000/api', 'http://localhost:8000/odata']
};
