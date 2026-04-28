
import createHttpError from "http-errors";

import PalletType from "../../lib/models/palletType.model.js";

import { compareDimensions } from '../services/comparePallets.services.js';

export const create = async (req, res) => {

    const { agencyId, name, constraints } = req.body;

    const palletType = await PalletType.create({ agencyId, name, constraints });

    res.status(201).json(palletType);
};

export const list = async (req, res) => {

    const pallets = await PalletType.find();

    if (!pallets) throw createHttpError(404, 'Pallets not founds');

    res.json(pallets);
};

export const details = async (req, res) => {
    
    const pallet = await PalletType.findById(req.params.palletTypeId);

    if (!pallet) throw createHttpError(404, 'Pallet not found');

    res.json(pallet);
};

export const remove = async (req, res) => {

    await PalletType.findByIdAndDelete(req.params.palletTypeId);

    res.status(204).end();
};

export const compare = async (req, res) => {
 
    const { item } = req.body;

    const maxDimensionns = await PalletType.aggregate([
        {
            $group: {
                _id: null, 
                maxWidth: { $max: "$constraints.maxWidth" },
                maxWeight: { $max: "$constraints.maxWeight" },
                maxLarge: { $max: "$constraints.maxLength"},
                maxHeight: { $max: "$constraints.maxHeight"}
            }
        }
    ]);

    if (!maxDimensionns) {
        throw createHttpError(404, 'Calcule dimensions errors');
    }

    const dimensionsPallet = compareDimensions(item, maxDimensionns);

    if (!dimensionsPallet) {
        throw createHttpError(404, 'Compare dimensions not founds');
    }

    res.send();
};