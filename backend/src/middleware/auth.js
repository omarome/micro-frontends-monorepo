/**
 * Simple Authentication Middleware
 * 
 * For development/testing: API key authentication
 * For production: Replace with JWT or proper authentication
 */

const authenticate = (req, res, next) => {
  // Get API key from header or query (for testing)
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validApiKey = process.env.API_KEY;

  // If no API key is set, allow access (development mode)
  if (!validApiKey) {
    console.warn('⚠️  WARNING: API_KEY not set - API is open to everyone!');
    return next();
  }

  // Check if API key is valid
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required. Set x-api-key header or ?apiKey= query parameter.'
    });
  }

  next();
};

module.exports = authenticate;


