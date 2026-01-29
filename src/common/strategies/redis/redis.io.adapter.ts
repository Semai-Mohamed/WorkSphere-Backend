/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

 async connectToRedis(): Promise<void> {
    let pubClient;
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      console.log(' WebSocket Adapter connecting to provided REDIS_URL...');
      
      // Determine if we are using a Secure (SSL) connection
      const isSecure = redisUrl.startsWith('rediss://');

      // Build the options object dynamically to satisfy TypeScript types
      const clientOptions: any = {
        url: redisUrl,
        socket: {
          family: 4, // Force IPv4 for Render
        },
      };

      if (isSecure) {
        clientOptions.socket = {
          family: 4,
          tls: true,
          rejectUnauthorized: false, 
        };
      }

      pubClient = createClient(clientOptions);
    } else {
      // Localhost Fallback
      console.log('⚠️ WebSocket Adapter using Localhost Redis');
      pubClient = createClient({ 
        url: 'redis://localhost:6379',
        socket: { family: 4 } 
      });
    }

    const subClient = pubClient.duplicate();

    // Error handling to prevent crashes
    pubClient.on('error', (err) => console.error(' Redis Pub Error:', err.message));
    subClient.on('error', (err) => console.error(' Redis Sub Error:', err.message));

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
    console.log('✅ WebSocket Redis Adapter connected!');
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}