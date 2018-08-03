'use strict';

import BaseRepository from '../repositories/base-repository';
import {Block} from '../models/'

export default class BlockRepository extends BaseRepository {

	constructor() {
		super(Block);
	}

}
