import React, { useState, useEffect } from 'react';
import './styles.css';
import imageIt from "./assets/image_it.png";
import imageInd from "./assets/image_ind.png";
import imageMex from "./assets/image_mex.png";
import imageChinese from "./assets/image.png";
import { Room, RoomEvent } from "livekit-client";

const App = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    fetch('https://ai-voice-assistant-1-mkkg.onrender.com/')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setIsLoading(false);
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const startVoiceAssistant = async () => {
    if (isVoiceActive) return;

    try {
      console.log("Starting voice assistant...");
      setIsVoiceActive(true); 

      const response = await fetch("https://ai-voice-assistant-1-mkkg.onrender.com/getToken");
      const data = await response.json();
      console.log("Token received:", data);
                                         
      const audioElements = new Map();

      const room = new Room({
        webAudioMix: true,
        publishDefaults: { audioBitrate: 32000 },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        console.log(`Track subscribed: ${track.kind} from ${participant.identity}`);
        if (track.kind === "audio") {
          const el = track.attach();
          document.body.appendChild(el);
          audioElements.set(track.sid, el);
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        const el = audioElements.get(track.sid);
        if (el) { el.remove(); audioElements.delete(track.sid); }
      });

      
      room.on(RoomEvent.Disconnected, () => {
        console.log("Room session disconnected");
        setIsVoiceActive(false);
      });

      await room.connect(data.url, data.token);
      console.log("Connected to LiveKit room");

      await room.localParticipant.setMicrophoneEnabled(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      console.log("Microphone enabled");

    } catch(error) {
      console.error("LiveKit connection error:", error);
      setIsVoiceActive(false); 
    }
  };

  return (
    <>
      <header id="Navbar">
        <nav>
          <h1 id="nav">REACT RESTAURANT</h1>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <div className="container">
        {message && (
          <div style={{ textAlign: 'center', color: 'green', marginTop: '20px' }}>
            <h3>Backend Message: {message}</h3>
          </div>
        )}

        <div id="home">
          <h1 id="Heading">REACT RESTAURANT</h1>
          <p className="Paragraph">
            Welcome to REACT RESTAURANT! We are delighted to have you here. Our restaurant offers a wide variety of delicious dishes made from the freshest ingredients. Whether you're in the mood for a hearty meal or a light snack, we have something for everyone. Our friendly staff is here to ensure you have a wonderful dining experience. kitchen was drawn from Ahlan Foodpreneurs, the idea was to create an authentic North & South Non-Veg restaurant specialized in Chettinad, Tandoor, Andhra and lip-smacking barbecues with great taste, grand ambience and unmatched services to provide you a memorable dining experience. Tamil Muslim wedding Biriyani and South Indian seafood dishes are the unique attractions of the menu. The concept of REACT restaurant was established in 2011 with strong focus and commitment towards quality, exceptional service and warm hospitality, employs a team of highly skilled & experienced chefs and supported by a strong management team different levels to ensure it meets the standards. With due emphasis laid on quality, service & hygiene, Copper Kitchen is committed to Food Safety & Standards and strictly implements FSSAI : 2006 across the chain of restaurants and is periodically audited. Thank you for choosing REACT RESTAURANT, and we look forward to serving you!
          </p>
        </div>

        <h3 className="H">We offer The following cuisines</h3>
        <div className="Cuisine">
          <h3 className="H3">Italian</h3>
          <img src={imageIt} alt="Italian Cuisine" />
          <p className="image-description">
            Authentic Italian cuisine with a focus on fresh ingredients and traditional recipes. Indulge in the heartwarming, timeless flavors of Italy. Our Italian menu celebrates simplicity and quality, featuring artisanal, al dente pastas, slow-simmered rich sauces, and fresh, vibrant ingredients like basil, tomatoes, and olive oil. From comforting classics to regional specialties, each dish is crafted to bring the authentic spirit of Mediterranean dining to your table. Experience a culinary journey where every bite feels like a celebration of flavor.
          </p>

          <h3 className="H3">Indian</h3>
          <img src={imageInd} alt="Indian Cuisine" />
          <p className="image-description">
            Delicious Indian dishes with a variety of spices and flavors.Embark on a sensory journey through the rich and diverse landscape of Indian flavors. Our Indian cuisine is a masterpiece of complex spice blends and aromatic herbs, meticulously balanced to create depth in every dish. We offer a symphony of taste, ranging from creamy, comforting curries and succulent, tandoor-grilled kebabs to fragrant, perfectly cooked biryanis. Each recipe is a tribute to India’s culinary heritage, promising an explosive and authentic dining experience.
          </p>

          <h3 className="H3">Mexican</h3>
          <img src={imageMex} alt="Mexican Cuisine" />
          <p className="image-description">
            Authentic Mexican cuisine with a focus on fresh ingredients and traditional recipes.Taste the vibrant, festive energy of Mexico. Our Mexican menu is a bold explosion of dynamic flavors, packed with zest, heat, and freshness. We use traditional recipes focusing on smoky chiles, fresh cilantro, tangy lime, and authentic corn tortillas. From savory, street-style tacos and hearty enchiladas to our signature zesty salsas, each dish delivers an exciting and satisfying taste of Mexico’s rich culinary culture.
          </p>

          <h3 className="H3">Chinese</h3>
          <img src={imageChinese} alt="Chinese Cuisine" />
          <p className="image-description">
            Delicious Chinese dishes with a variety of flavors and cooking techniques.Discover the sophisticated balance of flavor and texture that defines authentic Chinese cooking. Our Chinese cuisine showcases masterful wok techniques, delivering dishes bursting with ‘wok hei’ (the breath of the wok), alongside delicate, handcrafted dim sum. From comforting noodle soups and savory stir-fries to refined regional specialties, we use fresh ingredients and traditional methods to offer a culinary experience that is both deeply satisfying and artfully balanced.
          </p>
        </div>

        <div>
          <h3 className="H3" id="about">our story</h3>
          <p className="Paragraph">
            Founded in 2010, REACT RESTAURANT has been serving the community with authentic and delicious cuisine. Our passion for food and commitment to quality have made us a beloved destination for food lovers. the idea was to create a unique restaurant with specialized authentic, Chettinadu,Chennai muslim wedding Biriyani, Tandoor cuisines with great taste, grand ambience and unmatched services to provide you a memorable dining experience. We at Ahlan food pruners started our journey in 2008 and the concept of 'copper kitchen' was established in 2011.we are providing the best cuisine in town! and multiple options to choose from various cuisines
          </p>
        </div>

        <div>
          <h4 className="H3">Menu</h4>
          <ul className="Menu" id="menu">
            <li>Pizza - 250</li>
            <li>idli - 25</li>
            <li>vada - 20</li>
            <li>Naan - 50</li>
            <li>Smoothie - 70</li>
            <li>Rice - 140</li>
            <li>Burger - 280</li>
            <li>Pasta - 280</li>
            <li>Salad - 150</li>
            <li>Drinks - 100</li>
            <li>Biryani - 350</li>
            <li>Dosa - 70</li>
            <li>Chow Mein - 170</li>
            <li>Desserts - 100</li>
          </ul>
        </div>

        <div>
          <h3 className="H3">Our service locations</h3>
          <p className="Paragraph">
            We are proud to serve our delicious cuisine in multiple locations across the city. Our restaurants can be found in downtown, uptown, and suburban areas, making it convenient for you to enjoy our food no matter where you are. We also offer delivery services to ensure that you can enjoy our meals from the comfort of your home. Check out our website for specific addresses and delivery options!
          </p>
        </div>

        <ul className="service-locations">
          <li>1. Chennai-123 Main St</li>
          <li>2. Bangalore-456 Ave</li>
          <li>3. Hyderabad-789  Rd</li>
        </ul>

        <div>
          <h3 className="H3">Contact Us</h3>
          <p className="Paragraph">For any inquiries or reservations, please feel free to contact us at:</p>
        </div>

        <div className="contact" id="contact">
          <a href="tel:9129469789">
            📞 Phone: 912-946-9789
          </a>
          <a href="mailto:info@reactrestaurant.com">
            ✉️ Email: info@reactrestaurant.com
          </a>
          <a href="https://maps.google.com/?q=123+Main+St,+Chennai,+State+12345" target="_blank" rel="noopener noreferrer">
            📍 Address: KNK Main St, Chennai City, Tamil Nadu 600005
          </a>
        </div>

        {}
        <button 
          className="phone-icon" 
          onClick={startVoiceAssistant}
          disabled={isVoiceActive}
          style={{ 
            backgroundColor: isVoiceActive ? 'gray' : '#25D366',
            cursor: isVoiceActive ? 'not-allowed' : 'pointer'
          }}
        >
          <i className={`fa-solid ${isVoiceActive ? 'fa-microphone' : 'fa-phone'}`}></i>
        </button>
      </div>
    </>
  );
};

export default App;