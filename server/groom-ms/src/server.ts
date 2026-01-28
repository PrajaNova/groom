import { buildApp } from './app'
import dotenv from 'dotenv'

dotenv.config()

const start = async () => {
    const app = await buildApp()
    
    try {
        const port = Number(process.env.PORT) || 3003
        await app.listen({ port, host: '0.0.0.0' })
        console.log(`Groom MS listening on port ${port}`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
