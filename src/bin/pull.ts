import { writeFileSync } from 'fs';
import { Command, OptionType, ParsedArguments } from 'ts-commands';
import { log } from '../log';

import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

interface PullCommandArgs extends ParsedArguments {
	awsAccessId: string;
	awsAccessKey: string;
	secret: string;
	region: string;
	output: string;
}

export class PullCommand extends Command {
	override key = 'pull';
	override description = 'Pull changes from remote repository';

	override positional = [];

	override options = [
		{
			key: 'awsAccessId',
			type: OptionType.string,
			description: 'AWS Access Key ID',
			required: true,
		},
		{
			key: 'awsAccessKey',
			type: OptionType.string,
			description: 'AWS Secret Access Key',
			required: true,
		},
		{
			key: 'secret',
			type: OptionType.string,
			description: 'Secret name in AWS Secrets Manager',
			required: true,
		},
		{
			key: 'region',
			type: OptionType.string,
			description: 'AWS region',
			default: 'us-east-1',
			required: true,
		},
		{
			key: 'output',
			type: OptionType.string,
			description: 'Output file path',
			default: './.env',
			required: true,
		},
	];

	override async handle(args: PullCommandArgs): Promise<void | number> {
		log.info('Pulling secret...');

		const client = new SecretsManagerClient({
			region: args.region,
			credentials: {
				accessKeyId: args.awsAccessId,
				secretAccessKey: args.awsAccessKey,
			},
		});

		const response = await client.send(
			new GetSecretValueCommand({
				SecretId: args.secret,
				VersionStage: 'AWSCURRENT',
			})
		);

		log.info('Parsing secret...');

		if (!response.SecretString) {
			throw new Error('SecretString is empty');
		}

		log.info(`Writing secret to ${args.output}...`);

		await writeFileSync(args.output, response.SecretString);
	}
}
