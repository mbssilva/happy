import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import orphanageView from '../views/orphanages_view';

import Orphanage from '../models/Orphanage';

export default {
  async index(req: Request, res: Response) {
    try {
      const orphanagesRepository = getRepository(Orphanage);

      const orphanages = await orphanagesRepository.find({
        relations: ['images']
      });

      return res.status(200).json({ orphanages: orphanageView.renderMany(orphanages) });

    } catch (err) {
      return res.status(400).json({ error: 'Orphanages not found.' });
    }
  },

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orphanagesRepository = getRepository(Orphanage);

      const orphanage = await orphanagesRepository.findOneOrFail(id, {
        relations: ['images']
      });

      return res.status(200).json({ orphanage: orphanageView.render(orphanage) });
    }
    catch (err) {
      return res.status(400).json({ error: 'Orphanage not found.' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
      } = req.body;

      const orphanagesRepository = getRepository(Orphanage);

      const requestImages = req.files as Express.Multer.File[];

      const images = requestImages.map(image => ({
        path: image.filename
      }));

      const data = {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends,
        images
      };

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        about: Yup.string().required().max(300),
        instructions: Yup.string().required(),
        opening_hours: Yup.string().required(),
        open_on_weekends: Yup.boolean().required(),
        images: Yup.array(Yup.object().shape({
          path: Yup.string().required()
        })),
      });

      await schema.validate(data, { abortEarly: false });

      const orphanage = orphanagesRepository.create(data);

      await orphanagesRepository.save(orphanage);

      return res.status(201).json({ orphanage });
    } catch (err) {
      return res.status(400).json({ error: err.message || 'Orphanage could not created.' });
    }
  }
}