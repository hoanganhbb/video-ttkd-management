const path = require('path');
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');

const fastifyStatic = require('@fastify/static');
const fastifyJwt = require('@fastify/jwt');
const fastifyFormbody = require('@fastify/formbody');

// Plugin
fastify.register(fastifyFormbody);
fastify.register(fastifyJwt, { secret: 'supersecret123' });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'client/dist'),
  prefix: '/',
});

// Route fallback:
fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile('index.html');
});

// Middleware JWT
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// API login (POST)
fastify.post('/api/login', async (req, reply) => {
  const { username, password } = req.body;
  const token = fastify.jwt.sign({ user: username });
  return { token };

});

// Serve index.html (bảo vệ bằng token)
// fastify.get('/home', async (req, reply) => {
//   return reply.sendFile('index.html');
// });

// Serve video (có bảo vệ)
fastify.get('/video', async (req, reply) => {
  const { filename } = req.query
  const pathSource = path.join('/opt/data', 'video', filename);
  return reply.sendFile(pathSource);
});

// Start server
fastify.listen({ port: 8815 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server chạy tại ${addr}`);
});
