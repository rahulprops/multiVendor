import mongoose from 'mongoose'

const mongoDbUrl = process.env.MONGODB_URL;

if(!mongoDbUrl){
    throw new Error("DB error")
}

let  cache= global.mongoose
if(!cache){
    cache = global.mongoose = { conn : null , promise : null}
}


const connectDb = async ()=>{
    if(cache.conn){
        return cache.conn
    }
    if(!cache.promise){
    cache.promise = mongoose.connect(mongoDbUrl).then((conn)=>conn.connection)
}

    try {
        const conn = await cache.promise
        return conn 
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;