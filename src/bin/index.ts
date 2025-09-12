#! /usr/bin/env node

import { CommandDispatcher } from 'ts-commands';

import { PullCommand } from './pull';

new CommandDispatcher({
	commands: [PullCommand],
}).run();
