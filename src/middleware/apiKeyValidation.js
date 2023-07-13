const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.query.api_key;

  // Verificar si la API key es válida
  if (!apiKey || apiKey !== process.env.API_KEY) {
    const error = new Error();
    error.status = 401;
    error.message = "invalid api key token";
    res.status(error.status);

    res.json({
      status: error.status,
      message: error.message,
    });
  }

  next();
};

module.exports = apiKeyMiddleware;
