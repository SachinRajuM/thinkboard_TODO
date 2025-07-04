
import pkg from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
const { Ratelimit } = pkg;

import dotenv from "dotenv";

dotenv.config();

//crete a rate limiter that allows 10 request for 20 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10,"20 s"),
});


export default ratelimit
