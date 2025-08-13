
import { Command } from 'commander';
import { config } from '../../config/config.js';

const program = new Command();
const logger = config.createLogger('Cron');


const cronNodeConfig = (server) => {
    console.log(server.cronTasks, 'asdasdasdadsdasd')
    program
        .command('start-cron <name>')
        .description('Bắt đầu một cronjob cụ thể')
        .action((name) => {
            if (server.cronTasks[name]) {
                server.cronTasks[name].start();
                logger.info(`Cronjob ${name} started`);
            } else {
                logger.error(`Cronjob ${name} not found`);
            }
        });

    program
        .command('stop-cron <name>')
        .description('Dừng một cronjob cụ thể')
        .action((name) => {
            if (server.cronTasks[name]) {
                server.cronTasks[name].stop();
                logger.info(`Cronjob ${name} stopped`);
            } else {
                logger.error(`Cronjob ${name} not found`);
            }
        });

    program
        .command('list-crons')
        .description('Liệt kê tất cả cronjob')
        .action(() => {
            logger.info('Danh sách cronjob:', Object.keys(server.cronTasks));
        });

    program.parse();

}


export default cronNodeConfig