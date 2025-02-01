
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandFiles = fs.readdirSync(path.join(__dirname, 'Crons')).filter(file => file.endsWith('.js'));
const CronJobInit = (redisClient) => {
    
    commandFiles.forEach(async (file) => {          
        const fileURL = `file://${path.join(__dirname, 'Crons', file).replace(/\\/g, '/')} `;
        const { default: cronJob } = await import(fileURL);
        if(cronJob) 
        {
            var cronDetail = cronJob(redisClient)
            program
            .command(cronDetail.name)
            .description(cronDetail.description)
            .action(() => {
                cronDetail.startTask()
            })
        }
            // cronJob(redisClient).startTask()
         else 
            console.log('wrapper cronjob fair at ', file)
    });
    program.parse(process.argv);
}


export default CronJobInit