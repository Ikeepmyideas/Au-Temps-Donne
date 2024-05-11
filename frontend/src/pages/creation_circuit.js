import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Image, PDFDownloadLink, Text, View } from '@react-pdf/renderer';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB3KofdS-3nitMbrTB0JVftrZXYU5WYxt4';

const YourComponent = () => {
  const [partners, setPartners] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [selectedEntrepot, setSelectedEntrepot] = useState('');
  const [selectedArrivalEntrepot, setSelectedArrivalEntrepot] = useState('');
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [carTime, setCarTime] = useState('');
  const [pdfVisible, setPdfVisible] = useState(false);
  const [routeData, setRouteData] = useState({ routeCoordinates: [], addresses: [] });
  const [selectedDate, setSelectedDate] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get('http://localhost:8000/api/admin/partners');
        setPartners(partnersResponse.data.map(partner => ({
          ...partner,
          adresse: '',
          ville: ''
        })));

        const entrepotsResponse = await axios.get('http://localhost:8000/api/admin/entrepots');
        setEntrepots(entrepotsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEntrepotChange = (e) => {
    setSelectedEntrepot(e.target.value);
  };

  const handleArrivalEntrepotChange = (e) => {
    setSelectedArrivalEntrepot(e.target.value);
  };

  const handlePartnerChange = async (partnerId) => {
    try {
      const lieuResponse = await axios.get(`http://localhost:8000/api/admin/partner/${partnerId}/lieu`);
      const { adresse, ville, latitude, longitude } = lieuResponse.data;
      const selectedPartner = partners.find(partner => partner.id === parseInt(partnerId));
      const updatedSelectedPartners = [...selectedPartners, { ...selectedPartner, adresse, ville, latitude, longitude }];
      setSelectedPartners(updatedSelectedPartners);
      console.log(`Address of selected partner: ${adresse}, ${ville}`);
    } catch (error) {
      console.error('Error fetching lieu data:', error);
    }
  };

  const handleSubmit = async () => {
    const departureEntrepot = entrepots.find(entrepot => entrepot.ID_Entrepot === parseInt(selectedEntrepot));
    const departureCity = departureEntrepot.ville;

    const arrivalEntrepot = entrepots.find(entrepot => entrepot.ID_Entrepot === parseInt(selectedArrivalEntrepot));
    const arrivalCity = arrivalEntrepot.ville;

    const pointsAddresses = selectedPartners.map(partner => `${partner.adresse}, ${partner.ville}`);

    const allAddresses = [departureCity, ...pointsAddresses, arrivalCity];

    console.log('Addresses to send:', allAddresses);
          console.log('VOICI LES SELECTED PARTNER',selectedPartners); 


    try {
      const response = await axios.post('http://localhost:8000/api/admin/generate-itinerary', { addresses: allAddresses, date_circuit: selectedDate, selectedPartners: selectedPartners }); // Send selected partners in the request body
      const { routeCoordinates, startAddress, destinationAddress, estimatedTime, estimatedCarTime } = response.data;
      
      setCarTime(estimatedCarTime);
      
      setPdfVisible(true);
      setRouteData({ routeCoordinates, addresses: allAddresses });
    } catch (error) {
      console.error('Error generating itinerary:', error);
    }
  };

  return (
    <div>
      <h2>Entrepots</h2>
      <select value={selectedEntrepot} onChange={handleEntrepotChange}>
        <option value="">Select a Departure Entrepot</option>
        {entrepots.map(entrepot => (
          <option key={entrepot.ID_Entrepot} value={entrepot.ID_Entrepot}>
            {entrepot.ville}
          </option>
        ))}
      </select>

      <select value={selectedArrivalEntrepot} onChange={handleArrivalEntrepotChange}>
        <option value="">Select an Arrival Entrepot</option>
        {entrepots.map(entrepot => (
          <option key={entrepot.ID_Entrepot} value={entrepot.ID_Entrepot}>
            {entrepot.ville}
          </option>
        ))}
      </select>

      {selectedEntrepot && selectedArrivalEntrepot && (
        <div>
          <h2>Partners</h2>
          <select onChange={(e) => handlePartnerChange(e.target.value)} multiple>
            {partners.map(partner => (
              <option key={partner.id} value={partner.id}>
                {partner.nom}
              </option>
            ))}
          </select>

          <h2>Selected Partners</h2>
          <ul>
            {selectedPartners.map(partner => (
              <li key={partner.id}>{partner.nom}</li>
            ))}
          </ul>

          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

          <button onClick={handleSubmit}>Submit</button>

          <div>
            <h2>Estimated Travel Time by Car:</h2>
            <div>{JSON.stringify(carTime)}</div>
          </div>
        </div>
      )}

      {pdfVisible && (
        <div>
          <PDFDownloadButton routeCoordinates={routeData.routeCoordinates} addresses={routeData.addresses} />
        </div>
      )}

      <div id="map" style={{ height: '400px', width: '100%' }}>
        {routeData.routeCoordinates.length > 0 && (
          <iframe
            title="map"
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(routeData.addresses[0])}&destination=${encodeURIComponent(routeData.addresses[routeData.addresses.length - 1])}&waypoints=${routeData.addresses.slice(1, -1).map(address => encodeURIComponent(address)).join('|')}`}
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};


const PDFDownloadButton = ({ routeCoordinates, addresses }) => {
  return (
    <PDFDownloadLink document={<MyDocument routeCoordinates={routeCoordinates} addresses={addresses} />} fileName="itinerary.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

const MyDocument = ({ routeCoordinates, addresses }) => {
  const path = routeCoordinates.map(coord => `${coord[0]},${coord[1]}`).join('|');
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x600&maptype=roadmap&path=color:0x0000ff|weight:5|${path}&key=${GOOGLE_MAPS_API_KEY}`;

  return (
    <Document>
      <Page size="A4">
        <Image src={staticMapUrl} />
        {routeCoordinates.map((coord, index) => (
          <Image
            key={index}
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${coord[0]},${coord[1]}&markers=color:red%7Clabel:${index + 1}%7C${coord[0]},${coord[1]}&zoom=10&size=100x100&key=${GOOGLE_MAPS_API_KEY}`}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        ))}
      </Page>
    </Document>
  );
};

export default YourComponent;