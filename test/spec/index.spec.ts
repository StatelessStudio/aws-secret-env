import 'jasmine';
import * as index from '../../src';

describe('aws-secret-env', () => {
	it('exports a', () => {
		expect(index.a).toBeTrue();
	});
});
