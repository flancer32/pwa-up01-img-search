import assert from 'assert';
import {config as cfgTest, container} from '@teqfw/test';
import {describe, it} from 'mocha';

// SETUP ENV
/** @type {TeqFw_Core_Back_Config} */
const config = await container.get('TeqFw_Core_Back_Config$');
config.init(cfgTest.pathToRoot, 'test');

// SETUP TEST INPUT

// GET OBJECT FROM CONTAINER AND RUN TESTS
/** @type {App_Back_Act_Image_Resize.act|function} */
const act = await container.get('App_Back_Act_Image_Resize$');

describe('App_Back_Act_Image_Resize', function () {
    it('can create action', async () => {
        assert(typeof act === 'function');
    });

    it('can execute action', async () => {
        const uuid = 'aee7735f-3b2e-4519-83c8-dfdb03ed2c7f';
        const ext = 'jpeg';
        await act({uuid, ext});
    });
});

