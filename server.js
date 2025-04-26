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
  root: path.join(__dirname, 'public'),
  prefix: '/',
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
  if (username === 'admin' && password === '123456') {
    const token = fastify.jwt.sign({ user: username });
    return { token };
  } else {
    return reply.code(401).send({ error: 'Sai tài khoản hoặc mật khẩu' });
  }
});

// Serve index.html (bảo vệ bằng token)
fastify.get('/home', async (req, reply) => {
  return reply.sendFile('index.html');
});

// Serve video (có bảo vệ)
fastify.get('/video', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  return reply.sendFile('video.mp4');
});
fastify.get('/video2', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  return reply.sendFile('video2.mp4');
});

// Start server
fastify.listen({ port: 3000 }, (err, addr) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server chạy tại ${addr}`);
});
