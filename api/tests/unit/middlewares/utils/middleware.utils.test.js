
import mongoose from 'mongoose';

vi.mock('../../../../src/lib/models/palletType.model.js');
vi.mock('../../../../src/lib/models/agency.model.js');
vi.mock('../../../../src/lib/models/zone.model.js');

import Agency from '../../../../src/lib/models/agency.model.js';
import PalletType from '../../../../src/lib/models/palletType.model.js';
import Zone from '../../../../src/lib/models/zone.model.js';

import { 
    unknownFields,
    missingFields,
    validatePalletType,
    validateAgency,
    validateZoneById
} from '../../../../src/lib/utils/middleware/middleware.utils.js';

describe('unknownFields', () => {
    it('lanza un 400 si contiene campos desconocidos', () => {

        const fields = {
            notValid: 'not-valid',
            field1: 'field1',
            field2: 'field2'
        };

        const allowedFiedls = ['field1', 'field2'];

        expect(() => unknownFields(fields, allowedFiedls)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: `Unknown fields: notValid`
            })
        );
    });

    it('no lanza error cuando todos los campos están permitidos', () => {

        const fields = {
            field1: 'field1',
            field2: 'field2'
        };

        const allowedFiedls = ['field1', 'field2'];

        expect(() => unknownFields(fields, allowedFiedls)).not.toThrowError();
    });
});

describe('missingFields', () => {
    it('lanza 400 cuando falta algún campo requerido', () => {

        const fields = { field1: 'field1', field2: 'field2' };
        const requiredFields = ['field1', 'field2', 'field3'];

        expect(() => missingFields('Demo', fields, requiredFields)).toThrowError(
            expect.objectContaining({
                status: 400,
                message: 'Required fields in Demo: field3'
            })
        );
    });

    it('no lanza error cuando están todos los campos requeridos', () => {

        const fields = { field1: 'field1', field2: 'field2' };
        const requiredFields = ['field1', 'field2'];

        expect(() => missingFields('Demo', fields, requiredFields)).not.toThrowError();
    });
});

describe('validatePalletType', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 cuando palleTypeId es null', async () => {
        await expect(() => validatePalletType(null)).rejects.toMatchObject({
            status: 400,
            message: 'palletTypeId is required'
        })
    });

    it('lanza 400 cuando palleTypeId es vacío', async () => {
        await expect(() => validatePalletType()).rejects.toMatchObject({
            status: 400,
            message: 'palletTypeId is required'
        })
    });

    it('lanza 400 si palleTypeId no es un ObjectId correcto de mongo', async () => {
        await expect(() => validatePalletType('invalid-objectId')).rejects.toMatchObject({
            status: 400,
            message: 'palletTypeId is not a valid id'
        });
    });

    it('lanza 400 si palleTypeId no existe', async () => {

        const fakeId = new mongoose.Types.ObjectId();

        await expect(() => validatePalletType(fakeId)).rejects.toMatchObject({
            status: 404,
            message: `PalletType ${ fakeId } not found`
        });
    });

    it('devuelve el palletTypeId si el palletType existe', async () => {
        const palletTypeId = new mongoose.Types.ObjectId();

        PalletType.findById.mockResolvedValue({
            _id: palletTypeId,
        });

        const result = await validatePalletType(palletTypeId);

        expect(result).toBe(palletTypeId);
        expect(PalletType.findById).toHaveBeenCalledWith(palletTypeId);
    });
});

describe('validateAgency', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lanza 400 si agencyId es null', async () => {
        await expect(() => validateAgency(null)).rejects.toMatchObject({
            status: 400,
            message: 'agencyId is required'
        })
    });

    it('lanza 400 si agencyId no es un ObjectId correcto de mongo', async () => {
        await expect(() => validateAgency('invalid-objectId')).rejects.toMatchObject({
            status: 400,
            message: 'agencyId is not a valid id'
        });
    });

    it('lanza 400 si agencyId no existe', async () => {

        const fakeId = new mongoose.Types.ObjectId();

        await expect(() => validateAgency(fakeId)).rejects.toMatchObject({
            status: 404,
            message: `Agency ${ fakeId } not found`
        });
    });
    
    it('lanza 400 si agencyId no está activa', async () => {

        const agencyId = new mongoose.Types.ObjectId();

        Agency.findById.mockResolvedValue({
            _id: agencyId,
            name: 'PruebaAg',
            active: false

        });
        
        await expect(() => validateAgency(agencyId)).rejects.toMatchObject({
            status: 400,
            message: `Agency PruebaAg is not active`
        });
    });
    
    it('lanza 400 si agencyId es type api', async () => {

        const agencyId = new mongoose.Types.ObjectId();

        Agency.findById.mockResolvedValue({
            _id: agencyId,
            name: 'PruebaAg',
            active: true,
            type: 'api'

        });
        
        await expect(() => validateAgency(agencyId)).rejects.toMatchObject({
            status: 400,
            message: `Agency ${ agencyId } is type API`
        });
    });

    it('devuelve un object de la agency consultada', async () => {

        const agencyId = new mongoose.Types.ObjectId();

        const agencyData = {
            _id: agencyId,
            name: 'PruebaAg',
            active: true,
            type: 'static'

        };

        Agency.findById.mockResolvedValue(agencyData);

        const result = await validateAgency(agencyId);

        expect(result).toBe(agencyData);
        expect(Agency.findById).toHaveBeenCalledWith(agencyId);
    });
});

describe('validateZoneById', () => {

    it('lanza 400 si agencyId es null', async () => {
        await expect(() => validateZoneById(null)).rejects.toMatchObject({
            status: 400,
            message: 'agencyId is required'
        });
    });

    it('lanza 400 si zoneId es null', async () => {

        const fakeAgencyId = new mongoose.Types.ObjectId();

        await expect(() => validateZoneById(fakeAgencyId, null)).rejects.toMatchObject({
            status: 400,
            message: 'zoneId is required'
        });
    });

    it('lanza 400 si zoneId no se encuentra', async () => {

        const fakeAgencyId = new mongoose.Types.ObjectId();

        const fakeZoneId = new mongoose.Types.ObjectId();
        
        await expect(() => validateZoneById(fakeAgencyId, fakeZoneId)).rejects.toMatchObject({
            status: 404,
            message: `Zone ${ fakeZoneId } not found`
        });
    });

    it('devuelve un object de zone si es encontrado', async () => {

        const fakeAgencyId = new mongoose.Types.ObjectId();

        const zoneId = new mongoose.Types.ObjectId;

        const zoneData = { _id: zoneId };

        Zone.findById.mockResolvedValue(zoneData);

        const result = await validateZoneById(fakeAgencyId, zoneId);
        
        expect(result).toBe(zoneData);
        expect(Zone.findById).toHaveBeenCalledWith(zoneId);
    });
});
