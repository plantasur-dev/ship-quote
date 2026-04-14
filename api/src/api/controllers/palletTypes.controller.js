
import PalletType from "../../lib/models/palletType.model";

export const create = async (req, res) => {

    const { agencyId, name, constraints } = req.body;

    const palletType = PalletType.create({ agencyId, name, constraints });

    res.status(201).json(palletType);
};

export const remove = async (req, res) => {

    await PalletType.findByIdAndDelete(req.params.palletTypeId);

    res.status(204).end();
};