import ratelimit from "../config/upstash.js"


const rateLimiter  = async (req,res,next) => {
    try {
        const {success} = await ratelimit.limit("enabled-herring-14203")

        if(!success){
            return res.status(429).json({
                message:"To many request, please try again later"
            });
        }

        next();

    } catch (error) {
        console.log("Rate Limit error",error);
        next(error);
    }
}

export default rateLimiter;