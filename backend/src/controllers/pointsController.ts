import knex from '../database/connection'
import { Request, Response } from 'express'
export default class pointsController {
    async create(req: Request, res: Response) {
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body
    
        const trx = await knex.transaction()

        const point = { name, email, whatsapp, latitude, longitude, city, uf, image: req.file.filename }
        
        const ids = await trx('points').insert(point)
    
    
        const pointItems = items.split(',').map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return {
                item_id,
                point_id: ids[0]
            }
        })
        await trx('point_items').insert(pointItems)

        trx.commit()
    
        return res.json({...point, id: ids[0]})
    }

    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if(!point) {
            return res.status(400).json({ message: 'point not found '})
        }

        const serializedPoint = { ...point, image_url: `http://localhost:3333/uploads/${point.image}` }
        

        const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id).select('items.title')

        return res.json({point: serializedPoint, items})
    }

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedPoints = points.map(point => {
            return { ...point, image_url: `http://localhost:3333/uploads/${point.image}` }
        })

        return res.json(points)
    }
}