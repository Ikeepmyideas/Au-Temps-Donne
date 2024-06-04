const express = require('express');
const router = express.Router();

const dentreeController = require('../controllers/denreeController');

const authentication = require('../middleware/authentication');
const cors = require('cors');
const {
  generateItineraryCollecte,
  addCollecte,
  getMaraude,
  getCollecte,
  generateItinerary,
  getVolunteersDisponibles,
  addMaraude,
  getAllStockedDenreesByEntrepotId,
  getAllStockedDenrees,
  createEntrepot,
  getAllEntrepots,
  getEntrepotById,
  updateEntrepot,
  deleteEntrepot,
  getMaraudeStocks
} = require('../controllers/entrepotController');

router.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001', 'http://10.0.2.2:8000', 'http://10.0.2.3:8000'], // Ajoutez l'adresse de l'émulateur Android
    credentials: true 
  }));

router.post('/addEntrepot',createEntrepot );

router.get('/AllEntrepots',getAllEntrepots );

router.put('/updateEntrepot/:id',updateEntrepot );

router.delete('/deleteEntrepot/:id',deleteEntrepot );


router.get('/AllDenrees',dentreeController.getAllDenrees );
router.get('/AllStocks', getAllStockedDenrees );

router.get('/maraude/stocks', getMaraudeStocks );

router.get('/:entrepotId/stocks', getAllStockedDenreesByEntrepotId );
router.get('/:idEntrepot', getEntrepotById );

router.get('/entrepot/maraudes', getMaraude );
router.get('/entrepot/collectes', getCollecte );

router.get('/VolunteerAvailable', getVolunteersDisponibles);

router.post('/addMaraude', addMaraude );
router.post('/addCollecte', addCollecte );
router.post('/route', generateItineraryCollecte );

router.post('/itinerary', generateItinerary);
router.post('/generateItineraryCollecte', generateItineraryCollecte);

module.exports = router;
