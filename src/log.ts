import { Log } from 'ts-tiny-log';
import { LogLevel } from 'ts-tiny-log/levels';

export const log = new Log({
	level: LogLevel.debug,
});
