# SSL Setup for Development

**Generate SSL certificates** (required for first-time setup):
   ```bash
   # Navigate to core app
   cd apps/core
   
   # Create .ssl directory
   mkdir .ssl
   
   # Generate self-signed certificate
   openssl req -x509 -newkey rsa:4096 -keyout .ssl/key.pem -out .ssl/cert.pem -days 365 -nodes -subj "/CN=localhost"
   ```
