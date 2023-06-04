import Redis from 'ioredis';


class RedisClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    });
  }
  
  public get getConnection(): Redis {
    return this.redis;
  }

  async logAllKeysAndValuesFromRedis() {
  
    try {
      const keys = await this.getConnection.keys('*');
      const values = await this.getConnection.mget(keys);
  
      keys.forEach((key, index) => {
        console.log(`Key: ${key}, Value: ${values[index]}`);
      });
    } catch (e) {
      console.error('Error retrieving keys and values from Redis:', e);
    }
  }

}

const redisClient = new RedisClient;
const connect = redisClient.getConnection;



export async function setTokenInRedis(token: string, userId: number) {
  return new Promise(async (resolve, reject) => {
    const res = connect.setex(String(userId), 259200, token);
      if (!res) {
        console.error('Error setting token in Redis:');
        reject(false);
      } else {
        // const all = await redisClient.logAllKeysAndValuesFromRedis();
        // console.log('all redis info ->', all);
        resolve(res);
      }
  });
}

export function getTokenFromRedis(id: number): Promise<string | null> {
  return new Promise((resolve, reject) => {
    connect.get(String(id), (error, token) => {
      if (error) {
        console.error('Error getting token from Redis:', error);
        reject(error);
        return;
      }
      resolve(token);
    });
  });
}

export async function deleteTokenFromRedis(id: number): Promise<void> {
  const deletedCount = await connect.del(String(id))
  .then((deletedCount) => {
    console.log(`Deleted ${deletedCount} token(s) from Redis.`);
  })
  .catch((e) => {
    console.error('Error deleting token from Redis:', e);
  })
}






// export function setTokenInRedis(token: string, userId: number){
//   return new Promise((resolve, reject) => {
//     client.set(userId.toString(), token, 'EX', 86400);

//       if (error) {
//         console.error('Error setting token in Redis:', error);
//         reject(error);
//         return;
//       }
//       resolve(reply);
//     });
//   });
// }