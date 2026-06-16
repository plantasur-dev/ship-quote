
import createHttpError from "http-errors";

import PalletType from "../../lib/models/palletType.model.js";

export const create = async (req, res) => {

    const { agencyId, name, constraints } = req.body;

    const palletType = await PalletType.create({ agencyId, name, constraints });

    res.status(201).json(palletType);
};

export const list = async (req, res) => {

    const pallets = await PalletType.find();

    if (!pallets.length) throw createHttpError(404, 'Pallets not found');

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