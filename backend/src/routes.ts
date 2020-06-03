import { Router } from 'express'
import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'
const pointsController = new PointsController()
const itemsController = new ItemsController()
const routes = Router()

routes.get('/items', itemsController.index)

routes.post('/points', pointsController.create)
routes.get('/points/:id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes